<?php
class ProdutoModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "produto";
		$this->order_by = "id";
	}
	
	public function getProdutos() {
		return $this->searchQuery()->result_array();
	}
	
	public function getProdutoById($produto_id) {
		
		$query = $this->get($produto_id, TRUE);
		
		if ($query) return $query['descricao'];
		else return FALSE;
	}
}
?>
