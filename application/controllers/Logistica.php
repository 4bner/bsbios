<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Logistica extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('logistica/LogisticaModel');
	}
	
	public function salvarEditar() {
		
		$dados = $this->input->post('registro');
		
		$logistica = $dados['logistica'];
		$usuario_id = $dados['usuario_id'];
		
		$valoresArray = $this->validarValores($logistica['valores']);
		$valoresAntigos = isset($logistica['valoresAntigos']) ? $logistica['valoresAntigos'] : array();;
		
		$arrays = $this->montarArrays($logistica['valoresOriginais'], $valoresArray['novos'], $valoresAntigos);
		$arrUpdate = $arrays['update'];
		$arrDelete = $arrays['delete'];
		$arrInsert = $arrays['insert'];
		$arrays['antigos'] = $valoresAntigos;
		
		$resposta = array('resultado' => TRUE);
		
		$this->db->trans_begin();
		
		$this->LogisticaModel->inserirValores($logistica['id'], $arrInsert);
		$this->LogisticaModel->deleteValores($arrDelete, $usuario_id);
		$this->LogisticaModel->updateValores($arrUpdate, $usuario_id);
		$this->LogisticaModel->moveToHistorico($valoresAntigos, $usuario_id);
		
		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			$resposta['resultado'] = FALSE;
			$resposta['errMsg'] = $this->db->_error_number()." - ".$this->db->_error_message();
			echo json_encode($resposta); // ERRO NA DATABASE
		} else {
			$this->db->trans_commit();
			echo json_encode($resposta);
		}
	}
	
	private function montarArrays($valoresOriginais, $valores, $valoresAntigos) {
		
		$arrUpdate = array(); $arrDelete = array(); $arrInsert = array();
		
		foreach ($valores as $valor) {
			
			$achou = false;
			$time = strtotime($valor['data']);
			$mesN = date("F",$time); $anoN = date("Y",$time);
			
			foreach ($valoresOriginais as $vOrig) {
				
				$time = strtotime($vOrig['data']);
				$mesO = date("F",$time); $anoO = date("Y",$time);
				
				if ($mesO == $mesN && $anoO == $anoN) {
					$achou = true;
					if ($vOrig['valor'] != $valor['valor']) array_push($arrUpdate, array('id' => $vOrig['id'], 'valor' => $valor['valor'], 'original' => $vOrig));
				}
			}
			
			if (!$achou) array_push($arrInsert, $valor);
		}
		
		foreach ($valoresOriginais as $vOrig) {
				
			$achou = false;
			$time = strtotime($vOrig['data']);
			$mesO = date("F",$time); $anoO = date("Y",$time);
				
			foreach ($valores as $valor) {
		
				$time = strtotime($valor['data']);
				$mesN = date("F",$time); $anoN = date("Y",$time);
		
				if ($mesO == $mesN && $anoO == $anoN) {
					$achou = true;
					break;
				}
			}
			
			if (!$achou) {
				$antigo = false;
				foreach ($valoresAntigos as $valorAntigo) {
					
					$time = strtotime($valorAntigo['data']);
					$mesA = date("F",$time); $anoA = date("Y",$time);
					
					if ($mesO == $mesA && $anoO == $anoA) $antigo = true;
				}
				if (!$antigo) array_push($arrDelete, $vOrig);
			}
		}
		
		return array('update' => $arrUpdate, 'delete' => $arrDelete, 'insert' => $arrInsert);
	}

	public function salvarNovo() {
		
		$logistica = $this->input->post('registro');
		$valoresArray = $this->validarValores($logistica['valores']);
		
		$valores = $valoresArray['novos'];
		
		unset($logistica['valores']);
		unset($logistica['itinerario_descricao']);
		unset($logistica['produto_descricao']);
		
		$logistica['data_cadastro'] = date('Y-m-d h:i:s');
		
		$resposta = array('resultado' => TRUE);
		$resposta['data_cadastro'] = $logistica['data_cadastro'];
		
		$this->db->trans_begin();
		
			$resposta['id'] = $this->LogisticaModel->save($logistica, 0);
			$this->LogisticaModel->inserirValores($resposta['id'], $valores);
			
		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
				$resposta['resultado'] = FALSE;
				$resposta['errMsg'] = $this->db->_error_number()." - ".$this->db->_error_message();
				echo json_encode($resposta); // ERRO NA DATABASE
		} else {
			$this->db->trans_commit();
				echo json_encode($resposta);
		}
	}
	
	public function obterLogisticas() {
		echo json_encode($this->LogisticaModel->obterLogisticas());
	}
	
	public function obterValoresLogisticaByLogistica() {
		echo json_encode($this->validarValores($this->LogisticaModel->obterValoresLogisticaByLogistica($this->input->post("registro"))));
	}
	
	public function validarEditar() {
		
		$logistica = $this->input->post("registro");
		$valores = $logistica['valores'];
		
		$valoresArray = $this->validarValores($valores);
		$valores = $valoresArray['novos'];
		if (empty($valores)) {
			echo json_encode("-1"); //NENHUM VALOR INFORMADO
		} else {
			echo json_encode(TRUE);
		}
	}
	
	public function validarSalvar() {
		
		$logistica = $this->input->post('registro');
		$valores = $logistica['valores'];
		
		if (!$this->validarDuplicidadeLogistica($logistica)) {
			$valoresArray = $this->validarValores($valores);
			$valores = $valoresArray['novos'];
			if (empty($valores)) {
				echo json_encode("-2"); //NENHUM VALOR INFORMADO
			} else {
				echo json_encode(TRUE);
			}
		} else {
			echo json_encode("-1"); // ERRO DE DUPLICIDADE NA CHAVE ÚNICA (PRODUTO+ITINERARIO);
		}
	}
	
	private function validarValores($valores) {
		
		$indexArrAntigos = array(); 
		$indexArrSemValor = array(); 
		$index = 0; 
		$first_day_mes_atual = date("Y-m-01");
		
		$valoresArray = array('todos' => $valores);
				
		foreach ($valores as $value) {
			if ($value['valor'] <= 0) array_push($indexArrSemValor, $index);
			$index++;
		}
		foreach ($indexArrSemValor as $value) unset($valores[$value]);
		
		$index = 0;
		foreach ($valores as $value) {
			if ($first_day_mes_atual > date('Y-m-01', strtotime($value['data']))) array_push($indexArrAntigos, $index);
			$index++;
		}
		
		$antigos = array();
		foreach ($indexArrAntigos as $value) {
			array_push($antigos, $valores[$value]);
			unset($valores[$value]);
		}
		$valores = array_values($valores);
	
		$valoresArray['novos'] = $valores;
		$valoresArray['antigos'] = $antigos;
		
		return $valoresArray;
	}
	
	private function validarDuplicidadeLogistica($logistica) {
		return $this->LogisticaModel->getLogisticaByProdutoAndItinerario($logistica['produto_id'], $logistica['itinerario_id']);
	}
}
