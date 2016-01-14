var appDash = angular.module('appDash');

appDash.factory('Auth', function($rootScope, $state){
	return{
	    setUser : function(aUser){
	    	$rootScope.user = aUser;
	    },
	    getUserData : function(){
	        return($rootScope.user) ? $rootScope.user : false;
	    },
	    isLoggedIn : function(){
	        return($rootScope.user) ? true : false;
	    }
	}
})

appDash.factory('requestFactory', function($rootScope, $q, Auth, $state) {
	
	return {
		mensagemNoty : function(tipo, texto, tempo) {
			noty({layout: 'center', type: tipo, theme: 'relax', text: texto, timeout: tempo,
	    	    animation: {open: 'animated flipInX', close: 'animated flipOutX',}});
		},
		httpRequestFunction : function(url, registro) {
			
			var defer = $q.defer();
			
			if ($rootScope.sessaoExpirada) {
				noty({layout: 'center', type: "warning", theme: 'relax', text: "<strong>Sess&atilde;o expirada</strong>", timeout: 3000,
		    	    animation: {open: 'animated flipInX', close: 'animated flipOutX',}});
				$state.go('login');
				defer.reject("Session Expired");
				return defer.promise;
			}
				
			data = {registro : registro, csrf_token_name: $rootScope.csrf_hash}
			$.ajax({url: url, type:'POST', dataType: 'json',
		        data: data,
		        success: function(output){ defer.resolve(output)},
		        error: function(output) {defer.reject(output)}
		    });
			return defer.promise;
		}
	}
})

appDash.service('fileUpload', function ($rootScope, $http, Auth, requestFactory, $q) { 
	
    this.uploadFileToUrl = function(file, uploadUrl){
    	
    	var defer = $q.defer();
    	
        var fd = new FormData();
        fd.append('file', file);
        fd.append('csrf_token_name', $rootScope.csrf_hash);
        fd.append('usuario_id', Auth.getUserData().id);
        
        $http.post(uploadUrl, fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).success(function(data){
        	if (data.upload == "false") {
        		requestFactory.mensagemNoty('error', data.erro, 2000);	
        	} else {
        		requestFactory.mensagemNoty('information', 'Upload efetuado com sucesso.', 2000);
        	}
        	defer.resolve(data)
        }).error(function(e){
        	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />O upload falhou.', 2000);
        	defer.reject(e)
        });
        
        return defer.promise;
    }
});

appDash.factory('timeFunctions', function timeFunctions($timeout) {
    
	var _intervals = {}, _intervalUID = 1;
    return {
    	$setInterval: function(operation, interval, $scope) {
    		var _internalId = _intervalUID++;
    		
	        _intervals[ _internalId ] = $timeout(function intervalOperation(){
	            operation( $scope || undefined );
	            _intervals[ _internalId ] = $timeout(intervalOperation, interval);
	        }, interval);

	        return _internalId;
    	},
    	$clearInterval: function(id) {
    		return $timeout.cancel(_intervals[ id ]);
    	}
    }
  }
);