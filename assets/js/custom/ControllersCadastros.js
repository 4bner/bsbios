var appDash = angular.module('appDash');

appDash.controller('permissaoController', function($scope, requestFactory) {
	
	$scope.reverse = false;
	$scope.sortField = "nome";
	$scope.loading = true;
	
	requestFactory.httpRequestFunction('Usuario/getUsuarios', $scope.usuario).then(function(data) {
		$scope.loading = false;
		$scope.usuarios = data;
    }, function(e) {
    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
    	console.log('erro: ', e);
    })
    
    $scope.obterPermissoes = function(index) {
		
		requestFactory.httpRequestFunction('UsuarioModulo/obterPermissoesDoUsuario', index.id).then(function(data) {
			index.permissoes = data;
	    }, function(e) {
	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
	    	console.log('erro: ', e);
	    })
	}
	
	$scope.salvar = function() {
		
		dados = {'removidos': $scope.removidos, 'adicionados': $scope.adicionados, 'usuario_id' : $scope.usuario.id};
		requestFactory.httpRequestFunction('UsuarioModulo/salvarPermissoes', dados).then(function(data) {
			
			if (data == true) {
				requestFactory.mensagemNoty('success', 'Altera&ccedil;&atilde;es efetuadas com sucesso.', 2000);	
			} else {
				requestFactory.mensagemNoty('warning', '<strong>Aviso!</strong> <br />As altera&ccedil;&otilde;es n&atilde;o foram persistidas.', 2000);	
			}
			$('#modal_permissao').modal('toggle');
			$scope.removidos = []; 
			$scope.adicionados = [];
	    	
	    	$scope.obterPermissoes($scope.usuario);
	    	
	    }, function(e) {
	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
	    	console.log('erro: ', e);
	    })
	}
	
	$scope.toggleModulo = function(index) {
		
		//NAO TEM VINCULO
		if (angular.isUndefined(index.usuario_id) || index.usuario_id === null) {
			
			index.usuario_id = $scope.usuario.id;
			
			//REMOVE DO ARRAY DE REMOVIDOS, CASO ESTEJA LA.
			listaAuxiliar = [];
			angular.forEach($scope.removidos, function(registro) {
			      if (registro.modulo_id != index.modulo_id) listaAuxiliar.push(registro); 
		    });
			$scope.removidos = listaAuxiliar;
			
			// SE NÃO ESTAVA NO BANCO DEVE SER ADICIONADO NO ARRAY DE INCLUSÕES
			if (angular.isUndefined(index.usuariomodulo_id) || index.usuariomodulo_id === null) {
				$scope.adicionados.push(index);
			}
		} else { //JA TEM VINCULO
			
			index.usuario_id = null;
			
			//REMOVE DO ARRAY DE INCLUIDOS, CASO ESTEJA LA.
			listaAuxiliar = [];
			angular.forEach($scope.adicionados, function(registro) {
			      if (registro.modulo_id != index.modulo_id) listaAuxiliar.push(registro); 
		    });
			$scope.adicionados = listaAuxiliar;
			
			// SE ESTAVA NO BANCO. ADICIONA NO ARRAY PARA REMOÇÃO DO BANCO DE DADOS
			if (!(angular.isUndefined(index.usuariomodulo_id) || index.usuariomodulo_id === null)) { //
				$scope.removidos.push(index);
			}
		}
	}
	
    $scope.formulario = function(usuario) {
    	
    	$scope.usuario = usuario;
    	$scope.removidos = [];
    	$scope.adicionados = [];
    	
    	requestFactory.httpRequestFunction('UsuarioModulo/obterModulosParaPermissoes', usuario.id).then(function(data) {
    		
    		$scope.modulos = data;
    		angular.forEach($scope.modulos, function(registro) {
			      if (registro.usuario_id === null) registro.checked = false;
			      else registro.checked = true; 
		    });
    		
    		$('#modal_permissao').modal('toggle');
    	});
	}
});

appDash.controller('usuarioController', function($scope, requestFactory) {
	
	$scope.reverse = false;
	$scope.sortField = 'nome';
	$scope.loading = true;
	
	requestFactory.httpRequestFunction('Usuario/getUsuarios', $scope.usuario).then(function(data) {
		
		$scope.loading = false;
		$scope.usuarios = data;
		
    }, function(e) {
    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
    	console.log('erro: ', e);
    })
    
    $scope.alterarStatusUsuario = function(usuario) {
		
		acao = usuario.ativo == 1 ? 'desativar' : 'ativar';
		mensagem = "Deseja realmente "+acao+" este usuario: <b>"+usuario.nome+"</b>";
		bootbox.confirm({size: 'medium', message: mensagem, 
		    callback: function(result){
		    	if (result) {
		    		requestFactory.httpRequestFunction('Usuario/alterarStatusUsuario', usuario).then(function(data) {
		    			usuario.ativo = usuario.ativo == 1 ? 0 : 1;
		    	    }, function(e) {
		    	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		    	    	console.log('erro: ', e);
		    	    })
		    	}
		    }
		})
	}
    
    $scope.formulario = function(usuario) {
    	
    	$scope.inserir = usuario ? false : true;
    	$scope.usuario = angular.copy(usuario);
    	$scope.index = usuario;
		$('#modal_usuario').modal('toggle');
	}
	
	$scope.salvar = function() {
		
		requestFactory.httpRequestFunction('Usuario/salvar', $scope.usuario).then(function(data) {

			if (data.id == -2) {
				requestFactory.mensagemNoty('warning', '<strong>N&atilde;o foi poss&iacute;vel salvar!</strong> <br />Login duplicado.', 2000);
			} else {
				
				if ($scope.inserir) {
					
					$scope.usuarios.unshift(data);
			    	requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
				} else {
					
					$scope.index.nome = $scope.usuario.nome;
					$scope.index.email = $scope.usuario.email;
					$scope.index.login = $scope.usuario.login;
					$scope.index.senha = $scope.usuario.senha;
					$scope.index.centrocusto = $scope.usuario.centrocusto;
					$scope.index.cargo = $scope.usuario.cargo;
					
					requestFactory.mensagemNoty('information', 'Registro alterado com sucesso.', 2000);
				}
				
				$('#modal_usuario').modal('toggle');
			}
	    }, function(e) {
	    	console.log('erro: ', e);
	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
	    })
	}
});

appDash.controller('perfilController', function($scope, requestFactory, Auth, fileUpload, $timeout) {
	
	$scope.usuario = Auth.getUserData();
	
	$scope.loading = true;
	
	if ($scope.usuario.profile_pic) $scope.imgSrc = "./uploads/profile/"+$scope.usuario.profile_pic;
	else $scope.imgSrc = "./uploads/profile/male-placeholder.jpg";
	
	$scope.salvar = function() {
		requestFactory.httpRequestFunction('Usuario/salvar', $scope.usuario).then(function(data) {
			
			requestFactory.mensagemNoty('success', 'Perfil alterado com sucesso.', 2000);
	    }, function(e) {
	    	console.log('erro: ', e);
	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
	    })
	}

	$scope.uploadFile = function(){
		
		var file = $scope.myFile;
        if ($scope.myFile) {
        	$scope.loading = true;
            var uploadUrl = "Usuario/uploadProfilePicture";
            fileUpload.uploadFileToUrl(file, uploadUrl).then(function(data) {
            	
            	$scope.loading = false;
            	if (data.upload == "true") {
                	
            		filename = data.filename;
                	alteracao = {'profile_pic': filename};
                	dados = {'id': $scope.usuario.id, 'alteracao': alteracao};
                	setTimeout(function () {$scope.imgSrc = './uploads/profile/'+filename}, 5000);
                	
                	requestFactory.httpRequestFunction('Usuario/alterar', dados).then(function(data) {
                	}, function(e) {
                    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
                    	console.log('erro: ', e);
                    })
                } 
            });
        } else {
        	requestFactory.mensagemNoty('warning', '<strong>Aviso!</strong> <br />Selecione um arquivo para fazer o upload.', 2000);
        }
    };
    
    $scope.loading = false;
});

appDash.controller('itinerarioController', function($scope, requestFactory, ModalService, $timeout, $rootScope) {
	
	$scope.loading = true;
	$scope.itinerario = [];
	var _timeout;
	
	requestFactory.httpRequestFunction('Itinerario/getItinerarios', null).then(function(data) {
		$scope.loading = false;
		$scope.itinerarios = data;
    }, function(e) {
    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
    	console.log('erro: ', e);
    })
    
    $scope.formulario = function(itinerario) {
    	
    	$scope.editar = itinerario ? true : false;
    	$scope.itinerario = $scope.editar ? angular.copy(itinerario) : {};
    	$scope.index = itinerario;
		$('#modal_itinerario').modal('toggle');
	}
	
	$scope.buscarOrigem = function() {
		
		if(_timeout) $timeout.cancel(_timeout);
	    _timeout = $timeout(function(){
	    	requestFactory.httpRequestFunction('Cidade/getDescricaoCidadeById', $scope.itinerario.origem_id).then(function(data) {
	    		
	    		if (data) $scope.itinerario.origem_descricao = data;
	    		else {
	    			$scope.itinerario.origem_id = null;
	    			$scope.itinerario.origem_descricao = null;
	    		}
	    		
	        }, function(e) {
		    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		    	console.log('erro: ', e);
		    });
	    }, 500);
	}
	
	$scope.buscarDestino = function() {
		
		if(_timeout) $timeout.cancel(_timeout);
	    _timeout = $timeout(function(){
	    	requestFactory.httpRequestFunction('Cidade/getDescricaoCidadeById', $scope.itinerario.destino_id).then(function(data) {
	    		
	    		if (data) $scope.itinerario.destino_descricao = data;
	    		else {
	    			$scope.itinerario.destino_id = null;
	    			$scope.itinerario.destino_descricao = null;
	    		}
	        }, function(e) {
		    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		    	console.log('erro: ', e);
		    });
	    }, 500);
	}
	
	$scope.buscarOrigemForeignReference = function() {
		
		requestFactory.httpRequestFunction('Cidade/getCidades', null).then(function(data) {
			$rootScope.registros = data;
			ModalService.showModal({
				templateUrl: './application/views/foreignreference/LocalidadeForeignReference.html', controller: 'frController'
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					$scope.itinerario.origem_id = result.registro.id;
					$scope.itinerario.origem_descricao = result.registro.nome + ' - ' + result.registro.sigla;
				});
			}).catch(function(e) {
				  console.log('erro: ', e);
			});
		});
	}
	
	$scope.buscarDestinoForeignReference = function() {
		
		requestFactory.httpRequestFunction('Cidade/getCidades', null).then(function(data) {
			$rootScope.registros = data;
			ModalService.showModal({
				templateUrl: './application/views/foreignreference/LocalidadeForeignReference.html', controller: 'frController'
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					$scope.itinerario.destino_id = result.registro.id;
					$scope.itinerario.destino_descricao = result.registro.nome + ' - ' + result.registro.sigla;
				});
			}).catch(function(e) {
				  console.log('erro: ', e);
			});
		});
	}
	
	$scope.salvar = function() {
		
		requestFactory.httpRequestFunction('Itinerario/salvar', $scope.itinerario).then(function(data) {

			if ($scope.editar) {
				
				$scope.index.origem_id = $scope.itinerario.origem_id;
				$scope.index.origem_descricao  = $scope.itinerario.origem_descricao;
				$scope.index.destino_id = $scope.itinerario.destino_id;
				$scope.index.destino_descricao = $scope.itinerario.destino_descricao;

				requestFactory.mensagemNoty('information', 'Registro alterado com sucesso.', 2000);
			} else {
				
				$scope.itinerario.id = data.id;
				$scope.itinerarios.unshift($scope.itinerario);
		    	requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
			}
			
			$('#modal_itinerario ').modal('toggle');

	    }, function(e) {
	    	console.log('erro: ', e);
	    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
	    })
	}
});