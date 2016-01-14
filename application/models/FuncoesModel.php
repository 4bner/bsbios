<?php
class FuncoesModel extends MY_Model {

	public function __construct() {
		parent::MY_Model();
	}
	
	public function obterFeriados() {
		
		$sql = 'SELECT * from feriados WHERE feriado < DATE_ADD(NOW(), INTERVAL 2 YEAR)';
		return $this->db->query($sql)->result_array();
	}
}