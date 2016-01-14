<?php
class ItinerarioModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "itinerario.id";
		$this->table_name = "itinerario";
		$this->order_by = "itinerario.id";
	}
	
	public function getItinerarios() {
		$sql = "SELECT i.*, CONCAT(lo.nome,'-',eo.sigla) AS origem_descricao, CONCAT(ld.nome,'-',ed.sigla) AS destino_descricao 
				FROM itinerario i 
				JOIN cidade lo ON lo.id = i.origem_id  JOIN estado eo ON eo.id = lo.estado_id
				JOIN cidade ld ON ld.id = i.destino_id JOIN estado ed ON ed.id = ld.estado_id
				ORDER BY i.id ASC";
		return $this->db->query($sql)->result_array();
	}
	
	public function getDescricaoItinerarioById($id) {
	
		$this->db->join('cidade co', 'co.id = itinerario.origem_id');
		$this->db->join('estado eo', 'eo.id = co.estado_id');
		$this->db->join('cidade cd', 'cd.id = itinerario.destino_id');
		$this->db->join('estado ed', 'ed.id = cd.estado_id');
		$this->db->select("CONCAT(co.nome,'-',eo.sigla) AS origem, CONCAT(cd.nome,'-',ed.sigla) AS destino");
		$query = $this->get($id, TRUE);
		if ($query) return $query['origem']." X ".$query['destino'];
		else return FALSE;
	}
}
?>