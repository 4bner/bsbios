var appDash = angular.module('appDash');

appDash.controller('logisticaController', function($scope, $rootScope, ModalService, requestFactory, $timeout, Constantes, Auth) {
	
	$scope.Constantes = Constantes;
	$scope.loading=true;
	$scope.logisticas = {};
	
	var _timeout;
	
	$scope.obterLogisticas = function () {
		requestFactory.httpRequestFunction('Logistica/obterLogisticas', null).then(function(data) {
			
			$scope.logisticas = data;
		   angular.forEach($scope.logisticas, function(value, key){
			   value.descricao = Constantes.TipoOperLogistica[value.tipo_operacao - 1].tipo + " " + 
			   		Constantes.NatOperLogistica[value.natureza_operacao - 1].descricao + " de " +
			   		value.origem_descricao + " para " + value.destino_descricao;
		    });
			$scope.loading=false;
		}, function(e) {
	    	console.log('erro: ', e);
	    })
	};
	
	$scope.obterLogisticas();
	
	$scope.obterDetalhesLogistica = function(logistica) {
		requestFactory.httpRequestFunction('Logistica/obterValoresLogisticaByLogistica', logistica.id).then(function(data) {
			logistica.valoresDetalhe = data.todos;
		}, function(e) {
	    	console.log('erro: ', e);
	    })
	};
	
	$scope.adicionarNovoValor = function(registro, indice) {
		
		if (registro == null) {
			data = moment().set('date', 1).format('YYYY-MM-DD HH:mm:ss');
		} else {
			data = moment().set('date', 1).set('month', moment(registro.data).get('month')+1).format('YYYY-MM-DD HH:mm:ss');
		}
		
		$scope.logistica.valores.splice(indice+1, 0, {data : data, valor: 0, id: null});
	};
	
	$scope.mostrarBtnAdd = function(index) {
		return index+1 == $scope.logistica.valores.length;
	};
	
	$scope.mostrarBtnRmv = function(index) {
		return index+1 == $scope.logistica.valores.length && index > 0;
	};
	
	$scope.removerItem = function(registro, indice) {
		$scope.logistica.valores.splice(indice, 1);
	};
	
	$scope.salvarEditar = function() {
		
		requestFactory.httpRequestFunction('Logistica/validarEditar', $scope.logistica).then(function(data) {
			
			if (data == true) {
				
				requestFactory.httpRequestFunction('Logistica/salvarEditar', {logistica: $scope.logistica, usuario_id: Auth.getUserData().id}).then(function(data) {
					
					if (data.resultado == true) {
						
				    	requestFactory.mensagemNoty('information', 'Registro alterado com sucesso.', 2000);
						$('#modal_form_editar').modal('toggle');
						
					} else {
						console.log('erro: ', data.mensagem);
				    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);	
					}
				}, function(e) {
			    	console.log('erro: ', e);
			    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
			    });
			} else {
				if (data == "-1") { //NENHUM VALOR INFORMADO
					requestFactory.mensagemNoty('warning', '<strong>Aviso!</strong> <br/>Nenhum valor informado.', 2000);
				}
			}
		}, function(e) {
			console.log('erro: ', e);
		});
	};
	
	$scope.salvarNovo = function() {
		
		requestFactory.httpRequestFunction('Logistica/validarSalvar', $scope.logistica).then(function(data) {
			
			if (data == true) {
				
				requestFactory.httpRequestFunction('Logistica/salvarNovo', $scope.logistica).then(function(data) {
					
					if (data.resultado == true) {
						
						$scope.logistica.id = data.id;
						$scope.logistica.data_cadastro = data.data_cadastro;
						$scope.logistica.descricao = Constantes.TipoOperLogistica[$scope.logistica.tipo_operacao - 1].tipo + " " + 
					   		Constantes.NatOperLogistica[$scope.logistica.natureza_operacao - 1].descricao + " de " +
					   		$scope.logistica.origem_descricao + " para " + $scope.logistica.destino_descricao;
						$scope.logisticas.unshift($scope.logistica);
				    	requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
						$('#modal_form_novo').modal('toggle');	
					} else {
						console.log('erro: ', data.mensagem);
				    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);	
					}
			    }, function(e) {
			    	console.log('erro: ', e);
			    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
			    });
				
			} else {
				if (data == "-1") { //ERRO DE DUPLICIDADE NA CHAVE ÚNICA (PRODUTO+ITINERARIO);
					requestFactory.mensagemNoty('warning', '<strong>Aviso!</strong> <br/>Logistica j&aacute; existente para o itiner&aacute;rio '+
							$scope.logistica.itinerario_descricao+' e produto '+$scope.logistica.produto_descricao+'.', 2000);	
				}
				if (data == "-2") { //NENHUM VALOR INFORMADO
					requestFactory.mensagemNoty('warning', '<strong>Aviso!</strong> <br/>Nenhum valor informado.', 2000);
				}
			}
		}, function(e) {
	    	console.log('erro: ', e);
	    });
	};

	$scope.obterHistoricoLogistica = function(logistica) {
		requestFactory.httpRequestFunction('Logistica/obterHistoricoById', logistica.id).then(function(data) {
			logistica.historico = data;
		});
	};

	$scope.formularioEdicao = function(logistica) {
		
		$scope.logistica=logistica;
		requestFactory.httpRequestFunction('Logistica/obterValoresLogisticaByLogistica', logistica.id).then(function(data) {
			$scope.logistica.valores = data.novos;
			$scope.logistica.valoresOriginais = data.todos;
			$scope.logistica.valoresAntigos = data.antigos;
			
			$('#modal_form_editar').modal('toggle');
		}, function(e) {
	    	console.log('erro: ', e);
	    })
	};
	
	$scope.formularioNovo = function() {
		$scope.logistica = {natureza_operacao: "1", tipo_operacao: "1", ativo: 1, usuario_id: Auth.getUserData().id, valores: []};
		$scope.adicionarNovoValor(null, -1);
		$('#modal_form_novo').modal('toggle');
	};
	
	$scope.buscarProduto = function() {
	    if(_timeout) $timeout.cancel(_timeout);
	    _timeout = $timeout(function(){
	    	requestFactory.httpRequestFunction('Produto/getProdutoById', $scope.logistica.produto_id).then(function(data) {
	    		if (data) $scope.logistica.produto_descricao = data;
	    		else {
	    			$scope.logistica.produto_id = null;
	    			$scope.logistica.produto_descricao = null;
	    		}
	        }, function(e) {
		    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		    	console.log('erro: ', e);
		    });
	    }, 500);
	};
	
	$scope.buscarItinerario = function() {
		
		if(_timeout) $timeout.cancel(_timeout);
	    _timeout = $timeout(function(){
	    	requestFactory.httpRequestFunction('Itinerario/getDescricaoItinerarioById', $scope.logistica.itinerario_id).then(function(data) {
	    		
	    		if (data) $scope.logistica.itinerario_descricao = data;
	    		else {
	    			$scope.logistica.itinerario_id = null;
	    			$scope.logistica.itinerario_descricao = null;
	    		}
	        }, function(e) {
		    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		    	console.log('erro: ', e);
		    });
	    }, 500);
	};
	
	$scope.buscarProdutoForeignReference = function() {
		
		requestFactory.httpRequestFunction('Produto/getProdutos', null).then(function(data) {
			$rootScope.registros = data;
			ModalService.showModal({templateUrl: './application/views/foreignreference/ProdutoForeignReference.html', controller: 'frController'}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					$scope.logistica.produto_id = result.registro.id;
					$scope.logistica.produto_descricao = result.registro.descricao;
				});
			}).catch(function(e) {
				console.log('erro: ', e);
			});
		});
	};
	
	$scope.buscarItinerarioForeignReference = function() {
		
		requestFactory.httpRequestFunction('Itinerario/getItinerarios', null).then(function(data) {
			$rootScope.registros = data;
			ModalService.showModal({
				templateUrl: './application/views/foreignreference/ItinerarioForeignReference.html', controller: 'frController'
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					$scope.logistica.itinerario_id = result.registro.id;
					$scope.logistica.itinerario_descricao = result.registro.origem_descricao+" X "+result.registro.destino_descricao; 
				});
			}).catch(function(e) {
				  console.log('erro: ', e);
			});
		});
	};
});

appDash.controller('fxController', function($scope, requestFactory, $interval) {
	
	$scope.loading = true; $scope.chart = [];
	$scope.dolarSpot = null; $scope.dolarAnterior = null;
	$scope.dataSimulacao = new Date().toISOString().split('T')[0];
	$scope.dataCabMes = new Date(); 
	$scope.minDate = new Date();
	$scope.chartSeries = ["D&oacute;lar Futuro"];
	nomesMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
	$scope.colours = ['#1C89AD'];
	
	$scope.formulario = function() {
		$('#modal_simulacao').modal('toggle');
	};
	
	$scope.obterDolarCurva = function () {
		
		requestFactory.httpRequestFunction('DolarForward/obterTaxasBroadCast', null)
			.then(function(data) {
				dados = {'dolar': $scope.dolarSpot, 'feriados': $scope.feriados, 'taxas': data, 'calcularDias': true};
				requestFactory.httpRequestFunction('DolarForward/simular', dados).then(function(data) {
					$scope.taxas = data;
					$scope.montarChart();
					$scope.loading = false;
				}, function(e) {
					console.log('erro: ', e);
				});
			}
		);
	};
	
	$scope.obterDolarSpot = function() {
		
		requestFactory.httpRequestFunction('DolarForward/obterDolarSpot', null).then(function(data) {
			$scope.dolarSpot = data;
			$scope.dolarCalculado = $scope.dolarSpot;
			$scope.dolarCabMes = $scope.dolarSpot;
			
			$scope.obterDolarCurva();
		})
	};
	
	requestFactory.httpRequestFunction('dolarForward/obterFeriados', null).then(function(data) {
		$scope.feriados = data;
		$scope.obterDolarSpot();
	});
	
	$scope.chartOptions = {
        'pointHitDetectionRadius': 4,
        scaleShowVerticalLines: false,
        
    };
    
	$scope.montarChart = function() {
		
		$scope.chartData = [];
		$scope.chartLabels = [];
		
		data = [];
		angular.forEach($scope.taxas, function(value, key){
			
			date = new Date(value.vcto.split("/").reverse().join("-"));
			$scope.chartLabels.push(moment.utc(date).format('MMM/YYYY'));
			data.push(parseFloat(value.dolar.toFixed(4)));
	    });
		$scope.chartData.push(data);
	};
	
	$scope.simular = function() {
		dados = {'dolar': $scope.dolarSpot, 'taxas': $scope.taxas, 'feriados': $scope.feriados, 'calcularDias': false};
		requestFactory.httpRequestFunction('DolarForward/simular', dados).then(function(data) {
			$scope.taxas = data;
			$scope.montarChart();
		}, function(e) {
			console.log('erro: ', e);
		});
	};
	
	$scope.changeDolar = function() {
		if ($scope.dolarSpot != $scope.dolarAnterior) {
			$scope.dolarAnterior = $scope.dolarSpot;
			$scope.simular();
			$scope.obterDolarNaData($scope.dataSimulacao);
    	}
	};
	
	$scope.obterDolarNaData = function(data) {
		if ($scope.taxas) {
			registro = {'data': data, 'feriados': $scope.feriados, 'dolar': $scope.dolarSpot, 'taxas': $scope.taxas};
			requestFactory.httpRequestFunction('DolarForward/obterDolarNaData', registro).then(function(resposta) {
				$scope.dolarCalculado = resposta.dolarData;
				$scope.dolarCabMes = resposta.dolarCabMes;
				$scope.dataCabMes = resposta.dataCabMes;
			}, function(e) {
				console.log('erro: ', e);
			});
		}
	};
	
	 $scope.changeDate = function (modelName, newDate) {
		 $scope.dataSimulacao = newDate.format("YYYY-MM-DD"); 
		 $scope.obterDolarNaData($scope.dataSimulacao);
	 };
});

appDash.controller('custoFinanceiroController', function($rootScope, ModalService, $scope, requestFactory, Constantes, Auth) {
	
	$scope.jaCadastrado = false;
	$scope.loading = true;
	$scope.alteracao = false;
	$scope.custo_fin = {data_referencia: moment().format('YYYY-MM-DD')};
	
	$scope.solicitarAlteracao = function() {
		
		requestFactory.httpRequestFunction('Solicitacao/getSolicitacaoValidaByTipoAndStatus', {tipo_solicitacao: 1, status_solicitacao: [1, 2]}).then(function(resposta) {
			if (resposta) {
				if (resposta.status_solicitacao == 1) requestFactory.mensagemNoty('warning', '<strong>Aviso</strong><br/>J&aacute; existe uma solicita&ccedil;&atilde;o pendente para a opera&ccedil;&atilde;o. Aguarde aprova&ccedil;&atilde;o.', 3000);
				else {
					$scope.solicitacaoAprovada = resposta;
					requestFactory.mensagemNoty('success', '<strong>Sua ultima solicita&ccedil;&atilde;o foi aprovada</strong>', 3000);
					$scope.alteracao = true;
				}
			} else {
				
				$rootScope.tipo_solicitacao = 1;
				ModalService.showModal({
					templateUrl: './application/views/solicitacao/SolicitacaoModal.html', controller: 'modalController'
				}).then(function(modal) {
					modal.element.modal();
					modal.close.then(function(result) {
						$('.modal-backdrop').remove();
					});
				}).catch(function(e) {
					  console.log('erro: ', e);
				});
			}
		}, function(e) {
			console.log('erro: ', e);
		});
	};
	
	$scope.mostrarSolicitar = function() {
		return $scope.jaCadastrado && !$scope.alteracao;
	}
	
	requestFactory.httpRequestFunction('CustoFinanceiro/getCustoHoje', null).then(function(resposta) {
		
		if (resposta) {
			
			$scope.jaCadastrado = true;
			$scope.taxame = resposta.taxame;
			$scope.taxami = resposta.taxami;
			$scope.custo_cadastrado = resposta;
			
			data = {tipo_solicitacao: 1, status_solicitacao: [2]}
			requestFactory.httpRequestFunction('Solicitacao/getSolicitacaoValidaByTipoAndStatus', data).then(function(resposta) {
				$scope.alteracao = false;
				if (resposta) {
					$scope.solicitacaoAprovada = resposta;
					$scope.alteracao = true;
				}
			});
		}
		$scope.loading = false;
		
	}, function(e) {
		console.log('erro: ', e);
	});
	
	$scope.alterar = function() {
		
		$scope.custo_fin.usuario_id = Auth.getUserData().id;
		$scope.custo_fin.taxame = $scope.taxame;
		$scope.custo_fin.taxami = $scope.taxami;
		
		dados = {custo_financeiro : $scope.custo_fin, id: $scope.custo_cadastrado.id, id_solicitacao: $scope.solicitacaoAprovada.id};
		
		requestFactory.httpRequestFunction('CustoFinanceiro/alterar', dados).then(function(resposta) {
			if (resposta.resultado == true) {
				$scope.alteracao = false;
				requestFactory.mensagemNoty('information', 'Registro alterado com sucesso.', 2000);
			} else {
				console.log('erro: ', resposta.errMsg);	
				requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
			}
		}, function(e) {
			console.log('erro: ', e);
			requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		});
	}
	
	$scope.salvar = function() {
		
		$scope.custo_fin.usuario_id = Auth.getUserData().id;
		$scope.custo_fin.taxame = $scope.taxame;
		$scope.custo_fin.taxami = $scope.taxami;
		
		requestFactory.httpRequestFunction('CustoFinanceiro/salvar', $scope.custo_fin).then(function(resposta) {
			$scope.jaCadastrado = true;
			$scope.custo_fin.id=resposta;
			requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
		}, function(e) {
			console.log('erro: ', e);
			requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		});
	}
});

appDash.controller('custoCrushController', function($rootScope, $scope, requestFactory, Constantes, Auth, ModalService) {
	
	$scope.jaCadastrado = false;
	$scope.loading = true;
	$scope.alteracao = false;

	$scope.minDate = moment().add(-1, 'month');
	$scope.data_ref_form = moment().set('date', 1);
	
	$scope.custo_crush = {data_referencia: $scope.data_ref_form.format("YYYY-MM-DD"), usuario_id: Auth.getUserData().id};
	$scope.custosCrush = {};
		
	requestFactory.httpRequestFunction('CustoCrush/getCustosAtivos', null).then(function(resposta) {
		$scope.custosCrush = resposta;
		$scope.loading = false;
	}, function(e) {
		console.log('erro: ', e);
	});
	
	data = {tipo_solicitacao: 2, status_solicitacao: [2]}
	requestFactory.httpRequestFunction('Solicitacao/getSolicitacaoValidaByTipoAndStatus', data).then(function(resposta) {
		$scope.alteracao = false;
		if (resposta) {
			$scope.solicitacaoAprovada = resposta;
			$scope.alteracao = true;
		}
	});
	
	$scope.buscarCustosData = function(data) {
		requestFactory.httpRequestFunction('CustoCrush/getCustoByData', data).then(function(resposta) {
			
			if (resposta) {
				
				data = {tipo_solicitacao: 2, status_solicitacao: [2]}
				requestFactory.httpRequestFunction('Solicitacao/getSolicitacaoValidaByTipoAndStatus', data).then(function(resposta) {
					$scope.alteracao = false;
					if (resposta) {
						$scope.solicitacao_id = resposta.id;
						$scope.alteracao = true;
					}
				});
				
				$scope.jaCadastrado = true;
				$scope.custo_crush_antigo = {id: resposta.id};
				$scope.custo_crush.data_referencia = resposta.data_referencia;
				$scope.custo_crush.valor_matriz = resposta.valor_matriz;
				$scope.custo_crush.valor_marialva = resposta.valor_marialva;
			} else {
				$scope.jaCadastrado = false;
				$scope.custo_crush.valor_matriz = 0;
				$scope.custo_crush.valor_marialva = 0;
			}
			 
		}, function(e) {
			console.log('erro: ', e);
			requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);
		});
	}
	
	 $scope.changeDate = function (modelName, newDate) {
		 $scope.custo_crush.data_referencia = newDate.format("YYYY-MM-DD");
		 $scope.buscarCustosData(newDate.format("YYYY-MM-DD"));
		 $('.date-picker-date-time').hide();
	 };
	 
	 $scope.formulario = function() {
		 
		 $scope.data_ref_form = moment().set('date', 1);
		 $scope.custo_crush.usuario_id = Auth.getUserData().id;
		 $scope.custo_crush.status = 1;
		 
		 $scope.buscarCustosData($scope.data_ref_form.format("YYYY-MM-DD"));
		 
		 $('#modal_custo_crush').modal('toggle');
	 }
	 
	 $scope.salvar = function() {
		 requestFactory.httpRequestFunction('CustoCrush/salvar', $scope.custo_crush).then(function(data) {
				if (data.id) {
					$scope.custo_crush.id = data.id;
					$scope.custo_crush.data_cadastro = data.data_cadastro;
					$scope.custosCrush.unshift($scope.custo_crush);
					
			    	requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
					$('#modal_custo_crush').modal('toggle');
					
				} else {
					console.log('erro: ', data.mensagem);
			    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);	
				}
			}, function(e) {
		    	console.log('erro: ', e);
		    });
	 }
	 
	 $scope.alterar = function() {
		 
		 data = {novo: $scope.custo_crush, antigo_id: $scope.custo_crush_antigo.id, solicitacao_id: solicitacao_id}
		 requestFactory.httpRequestFunction('CustoCrush/alterar', $scope.custo_crush).then(function(data) {
				
				if (data.id) {
					$scope.custo_crush.id = data.id;
					$scope.custo_crush.data_cadastro = data.data_cadastro;
					$scope.custosCrush.unshift($scope.custo_crush);
					
			    	requestFactory.mensagemNoty('success', 'Registro incluido com sucesso.', 2000);
					$('#modal_custo_crush').modal('toggle');
					
				} else {
					console.log('erro: ', data.mensagem);
			    	requestFactory.mensagemNoty('error', '<strong>Erro!</strong> <br />Opera&ccedil;&atilde;o falhou.', 2000);	
				}
			}, function(e) {
		    	console.log('erro: ', e);
		    });
	 }
		
	$scope.mostrarSolicitar = function() {
		return $scope.jaCadastrado && !$scope.alteracao;
	}
 
	$scope.solicitarAlteracao = function() {
		
		requestFactory.httpRequestFunction('Solicitacao/getSolicitacaoValidaByTipoAndStatus', {tipo_solicitacao: 2, status_solicitacao: [1, 2]}).then(function(resposta) {
			if (resposta) {
				if (resposta.status_solicitacao == 1) requestFactory.mensagemNoty('warning', '<strong>Aviso</strong><br/>J&aacute; existe uma solicita&ccedil;&atilde;o pendente para a opera&ccedil;&atilde;o. Aguarde aprova&ccedil;&atilde;o.', 3000);
				else {
					$scope.solicitacaoAprovada = resposta;
					requestFactory.mensagemNoty('success', '<strong>Sua ultima solicita&ccedil;&atilde;o foi aprovada</strong>', 3000);
					$scope.alteracao = true;
				}
			} else {
				$rootScope.tipo_solicitacao = 2;
				ModalService.showModal({templateUrl: './application/views/solicitacao/SolicitacaoModal.html', controller: 'modalController'}).then(function(modal) {
					modal.element.modal();
					modal.close.then(function(result) {
						$('.modal-backdrop').remove();
					});
				}).catch(function(e) {
					  console.log('erro: ', e);
				});
			}
		}, function(e) {
			console.log('erro: ', e);
		});
	};
		
	$scope.obterHistorico = function(custo_crush) {
		requestFactory.httpRequestFunction('CustoCrush/getHistoricoByDataReferencia', custo_crush.data_referencia).then(function(resposta) {
			custo_crush.historico = resposta;
			console.log('resposta: ', resposta);
		}, function(e) {
			console.log('erro: ', e);
		});
	}
});