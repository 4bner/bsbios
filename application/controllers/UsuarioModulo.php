<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UsuarioModulo extends CI_Controller {
	
	public function __construct() {
		parent::__construct();
		$this->load->model('usuariomodulo/UsuarioModuloModel');
	}
	
	public function obterModulosParaPermissoes() {
	
		$usuario_id = $this->input->post('registro');
		$modulos = $this->UsuarioModuloModel->obterModulosParaPermissoes($usuario_id);
		echo json_encode($modulos);
	}
	
	public function obterPermissoesDoUsuario() {
	
		$usuario_id = $this->input->post('registro');
		echo json_encode($this->UsuarioModuloModel->obterPermissoesDoUsuario($usuario_id));
	}
	
	public function salvarPermissoes() {
	
		$dados = $this->input->post('registro');
		
		$rem = array(); 
		if (isset($dados['removidos'])) {
			$removidos = $dados['removidos'];
			foreach ($removidos as $registro) {
				$rem[] = $registro['usuariomodulo_id'];
			}
		}
		
		$adi = array();
		if (isset($dados['adicionados'])) {
			$adi = $dados['adicionados'];
		}
		
		echo json_encode($this->UsuarioModuloModel->salvarPermissoes($rem, $adi, $dados['usuario_id']));
	}
}