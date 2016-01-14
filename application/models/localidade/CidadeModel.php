<?php
class CidadeModel extends MY_Model {

	public function __construct() {
	
		parent::MY_Model();
		$this->primary_key = "cidade.id";
		$this->table_name = "cidade";
		$this->order_by = "id";
	}
	
	public function getCidades() {
		
		$sql = "SELECT c.*, e.sigla FROM cidade c JOIN estado e ON c.estado_id = e.id ORDER BY c.nome ASC, e.nome ASC";
		return $this->db->query($sql)->result_array();
	}
	
	public function getDescricaoCidadeById($id) {
		
		$this->db->join('estado', 'estado.id = cidade.estado_id');
		$this->db->select('cidade.nome, sigla');
		$query = $this->get($id, TRUE);
		if ($query) return $query['nome']." - ".$query['sigla'];
		else return FALSE;
	}
}
?>