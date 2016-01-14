var appDash = angular.module('appDash');

appDash.controller('inicialController' ,function($scope) {
	$scope.loading = false;
});

appDash.controller('dashController', function($rootScope, $state, $scope, Auth, Idle, requestFactory, timeFunctions) {
	
	$rootScope.menuShown = false;
	$scope.usuario = Auth.getUserData();
	$scope.acessoSolicitacoes = false;
	$scope.solicitacoes = [];
	$scope.loading = true;
	
	$scope.$on('IdleTimeout', function() {
		$rootScope.sessaoExpirada=true;
		Auth.setUser(false);
    });
	
	$scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
	    if(!value && oldValue) {
		    if ($rootScope.menuShown) {
		    	$scope.showLeftPush();
		    }
	    }
	}, true);
	
	if ($scope.usuario.profile_pic) {
		$scope.imgSrc = "./uploads/profile/"+$scope.usuario.profile_pic;
	} else {
		$scope.imgSrc = "./uploads/profile/male-placeholder.jpg";
	}
	
	requestFactory.httpRequestFunction('Usuario/validarAcesso', {usuario_id : $scope.usuario.id, statename : "dashboard.solicitacao"}).then(function(data) {
		if (data) {
			$scope.acessoSolicitacoes = true;
			$scope.buscarCountSolicitacoes();
			$scope.scrollTimeout = timeFunctions.$setInterval($scope.buscarCountSolicitacoes, 30000, $scope);
		}
		$scope.loading = false;
	});
	
	$scope.abrirModalSolicitacao = function(solicitacao) {
		$('#modal_solicitacao').modal('toggle');
		$scope.solicitacao = solicitacao;
	}
	
	$scope.deferirSolicitacao = function(status_solicitacao) {
		data = {usuario_id : $scope.usuario.id, solicitacao: $scope.solicitacao, status_solicitacao: status_solicitacao};
		requestFactory.httpRequestFunction('Solicitacao/deferirSolicitacao', data).then(function(data) {
			$('#modal_solicitacao').modal('toggle');
			$scope.buscarCountSolicitacoes();
			requestFactory.mensagemNoty('success', 'Opera&ccedil;&atilde;o efetuada com sucesso.', 2000);
		}, function(e) {
			console.log('erro: ', e);
			requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		});
	}
	
	$scope.showLeftPush = function() {
		$rootScope.menuShown = !$rootScope.menuShown;
		classie.toggle(document.getElementById( 'cbp-spmenu-s1' ), 'active' );
		classie.toggle(document.body, 'cbp-spmenu-push-toright' );
		classie.toggle(document.getElementById( 'cbp-spmenu-s1' ), 'cbp-spmenu-open' );
	}

	$scope.logout = function() {
		Auth.setUser(false);
		$state.go('login');
	}
	
	$scope.buscarCountSolicitacoes = function() {
		requestFactory.httpRequestFunction('Solicitacao/getCountSolicitacaoAberto', null).then(function(data) {
			$scope.numeroSolicitacoes = data || 0;
		}, function(e) {
			timeFunctions.$clearInterval($scope.scrollTimeout); //destruir timeout quando a sessão expirar ou ocorrer algum erro.
			console.log('erro: ', e);
		});
	}
	
	$scope.buscarSolicitacoes= function() {
		requestFactory.httpRequestFunction('Solicitacao/getAllSolicitacaoAberto', null).then(function(data) {
			$scope.solicitacoes = data;
		}, function(e) {
	    	console.log('erro: ', e);
	    })
	}
});

appDash.controller('frController', function($scope, close) {
	$scope.selecionar = function(registro) {
		close({registro: registro});
	};
});

appDash.controller('modalController', function($rootScope, $scope, close, requestFactory, Constantes, Auth) {
	$scope.solicitar = function() {
		observacao = Constantes.TipoSolicitacao[$rootScope.tipo_solicitacao - 1].tipo+". "+$scope.observacao;
		dados = {usuario_solicitante_id: Auth.getUserData().id, tipo_solicitacao: $rootScope.tipo_solicitacao, observacao: observacao};
		requestFactory.httpRequestFunction('Solicitacao/efetuarSolicitacao', dados).then(function(resposta) {
			
			requestFactory.mensagemNoty('information', '<strong>Solicita&ccedil;&atilde;o efetuada.</strong><br/>Aguarde aprova&ccedil;&atilde;o.', 3000);
			close({retorno: true});
		}, function(e) {
			console.log('erro: ', e);
			close({observacao: null});
		});
	};
});

appDash.controller('loginController', function($scope, requestFactory, $state, Auth) {
	
    $scope.usuario = {'login': "", 'senha': ""};
    $scope.msgWarning = false; $scope.msgError = false;
    
    $scope.desabilitarLogin = function() {
    	if ($scope.usuario.login == "") return true;
		return false;
	}

	$scope.mostrarMensagem = function(mensagem, error) {

		$scope.mensagem = mensagem;	
		if (error) {
			$scope.msgError = true;
			$("#msgError").fadeTo(2000, 500).slideUp(500, function(){
			    $("#msgError").hide();
			    $scope.msgError = false;
			});
		} else {
			$scope.msgWarning = true;
			$("#msgWarning").fadeTo(2000, 500).slideUp(500, function(){
			    $("#msgWarning").hide();
			    $scope.msgWarning = false;
			});
		}
	}

 	$scope.login = function () {
 		requestFactory.httpRequestFunction('Login/efetuarLogin', $scope.usuario).then(function(data) {
 			if (!data.bool) $scope.mostrarMensagem(data.msg, false);
			else {
	          	Auth.setUser(data.usr);
	          	$state.go('dashboard.inicio');
			}
	    }, function(e) {
	    	console.log('erro: ', e);
	      	$scope.mostrarMensagem('Ocorreu um erro', true);
	    })
	};

});

appDash.controller('solicitacaoController', function($scope, requestFactory ) {
	
	$scope.loading = true;
	
	$scope.atualizarDados = function(data) {
		$scope.solicitacao;
	}
	
	$scope.deferirSolicitacaoLista = function(status_solicitacao) {
		
		data = {usuario_id : $scope.usuario.id, solicitacao: $scope.solicitacao, status_solicitacao: status_solicitacao};
		requestFactory.httpRequestFunction('Solicitacao/deferirSolicitacao', data).then(function(data) {
			
			$scope.solicitacao.status_solicitacao = status_solicitacao;
			$('#modal_solicitacao_lista').modal('toggle');
			$scope.buscarCountSolicitacoes();
			requestFactory.mensagemNoty('success', 'Opera&ccedil;&atilde;o efetuada com sucesso.', 2000);
		}, function(e) {
			console.log('erro: ', e);
			requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		});
	}
	
	requestFactory.httpRequestFunction('solicitacao/getAllSolicitacoes', null).then(function(data) {
		$scope.solicitacoes = data;
		$scope.loading = false;
    }, function(e) {
    	console.log('erro: ', e);
		requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
    });
    
    $scope.mostrarEdicao = function(solicitacao) {
		
    	if (solicitacao && solicitacao.status_solicitacao == 1) return true;
    	return false;
	};
	
    $scope.formulario = function(solicitacao) {
    	
    	$scope.solicitacao = solicitacao;
		$('#modal_solicitacao_lista').modal('toggle');
	};
});
