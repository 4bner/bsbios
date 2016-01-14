<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CustoCrush extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('custos/CustoCrushModel');
		$this->load->model('solicitacao/SolicitacaoModel');
	}
	
	public function getCustoByData() {
		echo json_encode($this->CustoCrushModel->getCustoByData($this->input->post("registro")));
	}
	
	public function getCustosAtivos() {
		echo json_encode($this->CustoCrushModel->getCustosAtivos());
	}
	
	public function salvar() {
		$dados = $this->input->post("registro");
		
		$dados['data_cadastro'] = date("Y-m-d h:i:s");
		$dados['id'] = $this->CustoCrushModel->save($dados);
		echo json_encode($dados);
	}
	
	public function alterar() {
		
		$dados = $this->input->post("registro");
		
		if (isset($custo_crush['historico'])) unset($custo_crush['historico']);
		
		$resposta = array("resultado" => TRUE);
		
		$this->db->trans_begin();
		
		$this->CustoCrushModel->save(array('status' => 0), $dados['antigo_id']);
		$this->CustoCrushModel->save($dados['novo']);
		$this->SolicitacaoModel->save(array('finalizado' => 1), $dados['solicitacao_id']);
		
		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			$resposta['resultado'] = FALSE;
			$resposta['errMsg'] = $this->db->_error_number()." - ".$this->db->_error_message();
			echo json_encode($resposta);
		} else {
			$this->db->trans_commit();
			echo json_encode($resposta);
		}
	}
	
	public function getHistoricoByDataReferencia() {
		
		$data_referencia = $this->input->post("registro");
		echo json_encode($this->CustoCrushModel->getHistoricoByDataReferencia($data_referencia));
	}
}
