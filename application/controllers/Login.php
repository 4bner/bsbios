<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {
	
	public function __construct() {
		parent::__construct();
		$this->load->model('usuario/UsuarioModel');
	}
	
	public function index() {
		
		$data = array(
				'csrf_token' => $this->security->get_csrf_token_name(), 
				'csrf_hash' => $this->security->get_csrf_hash(), 
				'site_url' => site_url('')
		);
		
		$this->load->view('principal/CabecalhoView', $data);
	}
	
	public function efetuarLogin() {
		
		$dados = $this->input->post('registro');
		$res = $this->validarLogin($dados);
		
		if ($res['bool']) {
			
			$usuario = $this->UsuarioModel->buscarUsuario($dados);
			if (!isset($usuario) || is_null($usuario) || empty($usuario)) {
				$res['bool'] = FALSE;
				$res['msg'] = html_entity_decode('Usu&aacute;rio n&atilde;o encontrado');
			} else {
				$this->UsuarioModel->gravarAcesso($usuario['id']);
				$res['bool'] = TRUE;
				$res['usr'] = $usuario;
			}
		}
		
		echo json_encode($res);
	}
	
	private function validarLogin($dados) {
		
		$login = $dados['login'];
		$senha = $dados['senha'];
		$mensagem = ""; $bool = TRUE;
		
		if (strlen($login) < 5) {
			//$bool = FALSE;
			//$mensagem = 'Usu&aacute;rio deve ter no m&iacute;nimo 5 caracteres';
		} else {
			if (strlen($senha) < 8) {
				//$bool = FALSE;
				//$mensagem = 'Senha deve ter no m&iacute;nimo 8 caracteres';
			}
		}
		
		return array('bool' => $bool, 'msg'  => html_entity_decode($mensagem));
	}
}
