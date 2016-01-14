<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Solicitacao extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('solicitacao/SolicitacaoModel');
	}
	
	public function getSolicitacaoValidaByTipoAndStatus() {
		
		$dados = $this->input->post("registro");
		echo json_encode($this->SolicitacaoModel->getSolicitacaoValidaByTipoAndStatus($dados['tipo_solicitacao'], $dados['status_solicitacao']));
	}
	
	public function  efetuarSolicitacao() {
		$dados = $this->input->post("registro");
		
		$dados['data_solicitacao'] = date('Y-m-d h:i:s');
		$dados['data_validade'] = date('Y-m-d');
		$dados['status_solicitacao'] = 1;
		$dados['finalizado'] = 0;
		
		echo json_encode($this->SolicitacaoModel->efetuarSolicitacao($dados));
	}
	
	public function deferirSolicitacao() {
	
		$dados = $this->input->post("registro");
		$solicitacao = $dados['solicitacao'];
		$status = $dados['status_solicitacao'];
		
		$data = array(
			'usuario_deferimento_id' => $dados['usuario_id'],
			'resposta' => $solicitacao['resposta'],
			'status_solicitacao' => $status
		);
		if ($status == 3) $data['finalizado'] = 1;
		
		$resp = $this->SolicitacaoModel->save($data, $solicitacao['id']);
		echo json_encode($resp);
	}
	
	public function rejeitarSolicitacao() {
	
		$solicitacao = $this->input->post("registro");
		echo json_encode($solicitacao);
	}
	
	public function getAllSolicitacaoAberto() {
		echo json_encode($this->SolicitacaoModel->getAllSolicitacaoAberto());
	}
	
	public function getCountSolicitacaoAberto() {
		echo json_encode($this->SolicitacaoModel->getCountSolicitacaoAberto());
	}
	
	public function getAllSolicitacoes() {
		echo json_encode($this->SolicitacaoModel->getAllSolicitacoes());
	}
}