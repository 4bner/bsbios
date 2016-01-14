<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Itinerario extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('logistica/ItinerarioModel');
	}

	public function getDescricaoItinerarioById() {
		echo json_encode($this->ItinerarioModel->getDescricaoItinerarioById($this->input->post("registro")));
	}
	
	public function getItinerarios() {
		echo json_encode($this->ItinerarioModel->getItinerarios());
	}
	
	public function salvar() {
	
		$dados = $this->input->post('registro');
	
		unset($dados['origem_descricao']);
		unset($dados['destino_descricao']);
	
		if (!array_key_exists('id', $dados)) $id = 0;
		else $id = $dados['id'];
	
		$dados['id'] = $this->ItinerarioModel->save($dados, $id);
		echo json_encode($dados);
	}
}
