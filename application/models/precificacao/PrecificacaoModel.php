<?php
class PrecificacaoModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->order_by = "id";
	}
}