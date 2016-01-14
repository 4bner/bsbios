<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CustoFinanceiro extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('custos/CustoFinanceiroModel');
		$this->load->model('solicitacao/SolicitacaoModel');
		
	}
	
	public function getCustoHoje() {
		echo json_encode($this->CustoFinanceiroModel->getCustoHoje());
	}
	
	public function salvar() {
		
		$dados = $this->input->post("registro");
		$dados['data_cadastro'] = date("Y-m-d h:i:s");
		$dados['status'] = 1;
		
		echo json_encode($this->CustoFinanceiroModel->save($dados));
	}
	
	public function alterar() {
		
		$dados = $this->input->post("registro");
		$custo_fin = $dados['custo_financeiro'];
		$custo_fin['data_cadastro'] = date("Y-m-d h:i:s");
		$custo_fin['status'] = 1;
		
		$id_anterior = $dados['id'];
		$id_solicitacao = $dados['id_solicitacao'];
		
		$alteracao = array('status' => 0);
		$alteracaoSolicitacao = array('finalizado' => 1);
		$resposta = array('resultado' => TRUE);
		
		$this->db->trans_begin();
		
		$this->CustoFinanceiroModel->save($custo_fin);
		$this->CustoFinanceiroModel->save($alteracao, $id_anterior);
		$this->SolicitacaoModel->save($alteracaoSolicitacao, $id_solicitacao);
		
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
}
