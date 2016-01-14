<?php
class UsuarioModuloModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "usuariomodulo";
		$this->order_by = "id";
	}
	
	public function obterPermissoesDoUsuario($usuario_id) {
	
		$sql = "SELECT m.descricao, m.statename, um.id, um.modulo_id
				FROM usuariomodulo um JOIN modulo m ON m.id = um.modulo_id
				WHERE um.usuario_id = ".$this->db->escape($usuario_id)." ORDER BY m.descricao";
		return $this->db->query($sql)->result_array();
	}
	
	public function obterModulosParaPermissoes($usuario_id) {
	
		$sql = "SELECT '' as checked,  m.descricao, m.id as modulo_id, um.id as usuariomodulo_id, um.usuario_id FROM modulo m
				LEFT JOIN usuariomodulo um ON um.modulo_id = m.id AND um.usuario_id = ".$this->db->escape($usuario_id)." ORDER BY m.descricao";
		return $this->db->query($sql)->result_array();
	}
	
	public function salvarPermissoes($removidos, $adicionados, $usuario_id) {
		
		$this->db->trans_begin();
			
			$this->delete($removidos);
			foreach ($adicionados as $registro) {
				$data = array('usuario_id' => $usuario_id, 'modulo_id' => $registro['modulo_id']);
				$this->save($data);
			}
			
		if ($this->db->trans_status() === FALSE) {
			$this->db->trans_rollback();
			return false;
		} else {
			$this->db->trans_commit();
			return true;
		}
	}
}