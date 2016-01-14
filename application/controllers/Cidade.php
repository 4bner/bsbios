<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cidade extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('localidade/CidadeModel');
	}

	public function getCidades() {
		echo json_encode($this->CidadeModel->getCidades());
	}
	
	public function getDescricaoCidadeById() {
		echo json_encode($this->CidadeModel->getDescricaoCidadeById($this->input->post("registro")));
	}
}
