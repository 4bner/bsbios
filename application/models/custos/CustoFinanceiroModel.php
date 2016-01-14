<?php
class CustoFinanceiroModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "custo_financeiro";
		$this->order_by = "id";
	}
	
	public function getCustoHoje() {

		$hoje = date("Y-m-d");
		$sql = "SELECT * FROM custo_financeiro WHERE data_referencia = '$hoje' AND status = 1";
		return $this->db->query($sql)->row_array();
	}
}
?>
