<?php
class UsuarioModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "usuario";
		$this->order_by = "id";
	}

	public function buscarUsuario($dados) {

// 		$conditions = array('login' => $dados['login'], 'senha' => $dados['senha']);
		$conditions = array('id' => 1);
		return $this->searchQuery($conditions, "", 1)->row_array();
	}
	
	public function validarAcesso($usuario_id, $statename) {
		
		$sql = "SELECT usuario_id FROM usuariomodulo um JOIN modulo m ON m.id = um.modulo_id 
				WHERE um.usuario_id = ".$this->db->escape($usuario_id)." 
				AND m.statename = ".$this->db->escape($statename)." LIMIT 1";
		return $this->db->query($sql)->row_array();
	}
	
	public function getUsuarios() {
		
		return $this->searchQuery()->result_array();
	}
	
	public function alterarStatusUsuario($id, $statusAtual) {
		return $this->save(array('ativo' => !$statusAtual), $id);
	}
	
	public function gravarAcesso($id) {
		return $this->save(array('data_ultimo_login' => Date('Y-m-d H:i:s')), $id);
	}
	
	public function salvar($dados, $id) {
		
		$countLogin = $this->verificarDuplicidadeLogin($dados['login'], $id);
		if ($countLogin > 0) return -2;
		
		return parent::save($dados, $id);
	}
	
	private function verificarDuplicidadeLogin($login, $id) {
		
		$this->db->where('login', $login);
		$this->db->where('id !=', $id);
		
		$num_rows = $this->db->count_all_results($this->table_name);
		return $num_rows;	
	}
}
?>