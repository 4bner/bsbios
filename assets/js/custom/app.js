var appDash = angular.module('appDash', [
	'angularModalService', 
	 'angularUtils.directives.dirPagination', 
	 'ui.router', 
	 'ngCookies', 
	 'ngIdle', 
	 'datePicker', 
	 'ui.utils.masks', 
	 'chart.js'	
]);

appDash.constant('Constantes', {
	NatOperLogistica: [
	    { id: 1, natureza: 'ME', descricao: 'Mercado Externo' },
	    { id: 2, natureza: 'MI', descricao: 'Mercado Interno' }
	],
	TipoOperLogistica: [
   	    { id: 1, tipo: 'Frete'},
   	    { id: 2, tipo: 'Fobbings'}
   	],
   	TipoSolicitacao: [
   	    { id: 1, tipo: 'Alteração custos fincanceiros'},
   	    { id: 2, tipo: 'Alteração custos crush'}
   	],
   	StatusSolicitacao: [
		{ id: 1, tipo: 'Aberta'},
		{ id: 2, tipo: 'Aprovada'},
		{ id: 3, tipo: 'Rejeitada'},
		{ id: 4, tipo: 'Cancelada'}
	], 
}); 

appDash.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('./assets/templates/dirPagination.tpl.html');
});
  
appDash.config(function($stateProvider, $urlRouterProvider, IdleProvider, KeepaliveProvider) {
	
    IdleProvider.idle(120);
    IdleProvider.timeout(120);
    KeepaliveProvider.interval(125);
    
    var dashboard = {url: "", abstract: true, data: {requireLogin: true}, views: {"role": {templateUrl: "./application/views/principal/DashboardView.html", controller: "dashController"}}};
    var login = {url: "/login", data: {requireLogin: false}, views: {"role": {templateUrl: "./application/views/login/LoginView.php", controller: "loginController"}}};
    var inicio = {url: '/inicio', views: {"conteudo" : {templateUrl: "./application/views/principal/InicialView.html", controller: "inicialController"}}};
    var perfil = {url: '/perfil', data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/usuario/PerfilView.html", controller: 'perfilController'}}};
    var usuario = {url: '/usuario', data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/usuario/UsuarioFormView.html", controller: 'usuarioController'}}};
    var permissao = {url: '/permissao', data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/usuario/PermissaoView.html", controller: 'permissaoController'}}};
    var fx = {url: '/fx',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/dolar/FXView.html", controller: 'fxController'}}};
    var itinerario = {url: '/itinerario',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/logistica/ItinerarioView.html", controller: 'itinerarioController'}}};
    var logistica = {url: '/logistica',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/logistica/LogisticaView.html", controller: 'logisticaController'}}};
    var custos_fin = {url: '/custos_fin',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/custos/CustoFinanceiroView.html", controller: 'custoFinanceiroController'}}};
    var custos_crush = {url: '/custos_crush',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/custos/CustoCrushView.html", controller: 'custoCrushController'}}};
    var rendimentos = {url: '/rendimentos',  data: {requireAccess: true, construcao: true}, views: {"conteudo" : {templateUrl: ""}}};
    var basis = {url: '/basis',  data: {requireAccess: true, construcao: true}, views: {"conteudo" : {templateUrl: ""}}};
    var cbot = {url: '/cbot',  data: {requireAccess: true, construcao: true}, views: {"conteudo" : {templateUrl: ""}}};
    var solicitacao = {url: '/solicitacao',  data: {requireAccess: true}, views: {"conteudo" : {templateUrl: "./application/views/solicitacao/SolicitacaoView.html", controller: 'solicitacaoController'}}};

    // STATES
    $stateProvider
    	.state('login', login)
    	.state('dashboard', dashboard)
    	.state('dashboard.inicio', inicio)
        .state('dashboard.perfil', perfil)
        .state('dashboard.fx', fx)
        .state('dashboard.custos_fin', custos_fin)
        .state('dashboard.custos_crush', custos_crush)
        .state('dashboard.rendimentos', rendimentos)
        .state('dashboard.basis', basis)
        .state('dashboard.cbot', cbot)
		.state('dashboard.usuario', usuario)
    	.state('dashboard.permissao', permissao)
    	.state('dashboard.itinerario', itinerario)
		.state('dashboard.logistica', logistica)
		.state('dashboard.solicitacao', solicitacao);

});

appDash.run(function($rootScope, Idle, Auth, $state, requestFactory, $urlRouter) {
	
	Idle.watch();
	
	$rootScope.$on('$stateChangeStart', function(e, toState, toStateParams, fromState, fromStateParams) {
		
		var requireLogin = toState.data.requireLogin;
		var userData = Auth.getUserData();
		
		if ($rootScope.menuShown && !toState.data.construcao) {
			$rootScope.menuShown = !$rootScope.menuShown;
			classie.toggle(document.getElementById( 'cbp-spmenu-s1' ), 'active' );
			classie.toggle(document.body, 'cbp-spmenu-push-toright' );
			classie.toggle(document.getElementById( 'cbp-spmenu-s1' ), 'cbp-spmenu-open' );
		}
		
		if ($rootScope.acessou) {
			$rootScope.acessou = false;
			return;
		}
		
		if (!requireLogin) return;
		else {
			if (!userData) {
				e.preventDefault();
				$state.go('login');
			}
	    }
		
		if (toState.data.construcao) {
			requestFactory.mensagemNoty('information', '<strong><h4>EM CONSTRU&Ccedil;&Atilde;O.</h4></strong>', 2000);
			e.preventDefault();
			return;
		}
		
		if (toState.data.requireAccess && userData) {

			e.preventDefault();
			requestFactory.httpRequestFunction('Usuario/validarAcesso', {usuario_id : userData.id || null, statename : toState.name})
			.then(function(data) {
				if (data) {
					$rootScope.acessou = true;
					$state.go(toState, toStateParams);
				} else {
					requestFactory.mensagemNoty('warning', '<strong><h4>Seu usu&aacute;rio n&atilde;o tem acesso &agrave; essa funcionalidade.</h4></strong>', 2000);
					e.preventDefault();	
				}
			});
		} else return;
	});
})
