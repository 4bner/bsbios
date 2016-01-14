<?php
class CustoCrushModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "custo_crush";
		$this->order_by = "id";
	}
	
	public function getCustoByData($data) {
		$conditions = array('data_referencia' => $data, 'status' => 1);
		return $this->searchQuery($conditions)->row_array();
	}
	
	public function getCustosAtivos() {
		return $this->searchQuery(array('status' => 1))->result_array();
	}
	
	public function getHistoricoByDataReferencia($data_referencia) {
		
		$s = array("u.nome as usu_nome", "u.profile_pic", "cc.*");
		$c = array('status' => 0, 'data_referencia' => $data_referencia);
		return $this->db->select($s)->from('custo_crush cc')->join('usuario u','u.id = cc.usuario_id')->where($c)->order_by('cc.data_cadastro', 'DESC')->get()->result_array();
	}
}
?>
