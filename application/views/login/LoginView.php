<div ng-controller="loginController">
	<div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-4 col-lg-4 login-block">
		<h1 class="col-xs-offset-4 col-xs-4 text-center form-grop">BSBIOS</h1>
		<div class="form-group"><input type="text" ng-enter="login()" ng-model="usuario.login" placeholder="Usu&aacute;rio" id="login" /></div>
		<div class="form-group"><input type="password" ng-enter="login()" ng-model="usuario.senha" placeholder="Senha" id="senha" /></div>
		
		<div class="alert alert-warning text-center" id="msgWarning" ng-show="msgWarning"><strong>{{mensagem}}</strong></div>
		<div class="alert alert-danger text-center" id="msgError" ng-show="msgError"><strong>{{mensagem}}</strong></div>
		
		<div class="form-group text-center">
			<div class="btn btn-lg btn-success" style="margin-bottom: 20px; background-color: #555C76; border-color: #222" 
				type="submmit" ng-disabled="desabilitarLogin()" ng-click="desabilitarLogin() || login()">Login</div>
		</div>
	</div>
</div>
