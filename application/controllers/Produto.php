<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Produto extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('produto/ProdutoModel');
	}

	public function getProdutos() {
		echo json_encode($this->ProdutoModel->getProdutos());
	}
	
	public function getProdutoById() {
		echo json_encode($this->ProdutoModel->getProdutoById($this->input->post("registro")));
	}
	
}
