<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Usuario extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->model('usuario/UsuarioModel');
	}

	public function validarAcesso() {

		$dados = $this->input->post('registro');
		echo json_encode($this->UsuarioModel->validarAcesso($dados['usuario_id'], $dados['statename']));
	}
	
	public function getUsuarios() {
		echo json_encode($this->UsuarioModel->getUsuarios());
	}
	
	public function salvar() {
		
		$dados = $this->input->post('registro');
		
		if (!array_key_exists('id', $dados)) {
			$id = 0;	
			$dados['data_cadastro'] = date('Y-m-d');
			$dados['data_ultimo_login'] = date('Y-m-d');
			$dados['ativo'] = true;
		} else {
			$id = $dados['id'];
		}
		
		$dados['id'] = $this->UsuarioModel->salvar($dados, $id);
		
		echo json_encode($dados);
	}
	
	public function alterarStatusUsuario() {
		
		$usuario = $this->input->post('registro');
		echo json_encode($this->UsuarioModel->alterarStatusUsuario($usuario['id'], $usuario['ativo']));
	}
	
	private function obterNomeProfilePicture($usuario_id, $ext) {
		return 'profile_pic'.$usuario_id.".".$ext;
	}
	
	public function uploadProfilePicture() {
		
		$nome = $_FILES["file"]["name"];
		$tmp_name = $_FILES["file"]["tmp_name"];
		
		$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
		$nome = $this->obterNomeProfilePicture($this->input->post('usuario_id'), $ext);
		$upload_dir = $_SERVER['DOCUMENT_ROOT'].'/bsbios/uploads/profile/';
		$url = $upload_dir.$nome;
		
		if (is_dir($upload_dir) && is_writable($upload_dir)) {
		
			$upload = json_encode(move_uploaded_file($tmp_name, $url));
			
			$erro = null;
			if (isset($_FILES["file"]) && isset($_FILES["file"]["error"])) {
				switch ($_FILES["file"]["error"]) {
					case 1:
						$erro = "O arquivo excede o tamanho m&aacute;ximo permitido.";
						break;
					case 2:
						$erro = "O arquivo excede o tamanho m&aacute;ximo permitido";
						break;
					case 3:
						$erro = "O upload n&atilde;o foi completado";
						break;
					case 4:
						$erro = "Nenhum arquivo foi selecionado";
						break;
					case 6:
						$erro = "Est&aacute; faltando o ficheiro tempor&atilde;rio";
						break;
					case 7:
						$erro = "Falha ao escrever arquivo no HD";
						break;
					case 8:
						$erro = "Upload falhou devido a uma extens&atilde;o do PHP";
						break;
				}	
			}
			$dados = array('upload' => $upload, 'filename' => $nome, 'erro' => $erro);
		} else {
			$dados = array('upload' => false, 'filename' => $nome, 'erro' => 'Diret&oacute;rio não permite inclus&atilde;o do arquivo ou n&atilde;o existe.');
		}
		echo json_encode($dados);
	}
	
	public function alterar() {
		
		$dados = $this->input->post('registro');
		$id = $dados['id'];
		$alt = $dados['alteracao'];
		echo json_encode($this->UsuarioModel->save($alt, $id));
	}
}
