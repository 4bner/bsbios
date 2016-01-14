<?php 

/**
 * 
 * Model base para prover funcionalidades do CRUD. Extender novos models do MY_Model
 * @package Core
 * @subpackage Libraries 
 * @author Abner Lauxen
 */
class MY_Model extends CI_Model {
	
	
	/**
	 * Nome da tabela da database
	 * @var string
	 */
	public $table_name;
	
	/**
	 * Campo chave primária
	 * @var string
	 */
	public $primary_key = '';
	
	public function MY_Model() {
		
		parent::__construct();
		$this->load->helper('security');
	}
	
	protected function _set_default_sql() {}
	
	/**
	 * Conta o numero de registros de uma determinada tabela
	 * @return integer
	 * @author Abner Lauxen
	 */
	public function count() {
		
		$this->db->from($this->table_name);
		return $this->db->count_all_results();
	}
	
	/**
	 * Pega um ou mais registros baseado em um id, pode ser recebido um único ID, 
	 * um array de IDs ou nenhum (neste caso serão  retornados todos os registros)
	 * 
	 * Por default, esse método vai retornar um array de registros. Passando o parametro $single como TRUE, 
	 * o método retornará um array associativo com os valores de apenas um registro.
	 * 
	 * @param integer $id um ID ou um array de IDs (opcional, default = 0)
	 * @param boolean $single se será retornado um array assoc. com valores de um registro ou um array
	 * contendo mais de um registro da tabela
	 * 
	 * @return array
	 * @author Abner Lauxen
	 */
	public function get($id = 0, $single = FALSE) {
		
		$id_unico = ((int) $id > 0 && !is_array($id)) ? TRUE : FALSE;
		
		// Se for recebido um valor para $id, coloca os parametros WHERE
		if ($id != 0 || is_string($id)) {
			
			// $Id necessita ser array para iterarmos
			is_array($id) || $id = array($id);
			
			foreach ($id as $key) {
				
				$key = intval($key);
				
				if ($key == 0) return array();
				
				if ($id_unico == TRUE) $this->db->where($this->primary_key, $key);
				else $this->db->or_where($this->primary_key, $key);
			}
		}
		
		$single == FALSE || $this->db->limit(1);
		$method = $single == TRUE ? 'row_array' : 'result_array';
		return $this->db->get($this->table_name)->$method();		
	}
	
	/**
	 * Funcão para pegar registros da tabela com determinados filtros passados por parametro
	 * @param aray $conditions todos os filtros do where
	 * @param string $tablename
	 * @param number $limit
	 * @param number $offset
	 * @return $query
	 * @author Abner Lauxen
	 */
	public function searchQuery($conditions=NULL,$tablename="",$limit="",$offset=0) {
		
		if($tablename=="") $tablename = $this->table_name;
		if($conditions != NULL) $this->db->where($conditions);
		
		$query = $this->db->get($tablename,$limit,$offset=0);
		
		return $query;
	}
	
	/**
	 * Salva um registro no banco. Funcao determina se vai inserir ou alterar.
	 * Retorna o ID inserido
	 * @param $data
	 * @param $id
	 * @return integer $id
	 * @author Abner Lauxen
	 */
	public function save($data, $id = 0) {
		
		if ($id > 0) { // É UM UPDATE
			$this->db->set($data)->where($this->primary_key, $id)->update($this->table_name);
		} else { // INSERT
			
			!isset($data[$this->primary_key]) || $data[$this->primary_key] = NULL;
			$this->db->set($data);
			$this->db->insert($this->table_name);
		}
		
		return $id > 0 ? $id : $this->db->insert_id();
	}
	
	/**
	 * Deleta uma linha (ou mais no caso de um array de IDs) da tabela pelo ID.
	 * @param mixed $id_array pode ser array ou apenas um Id
	 * @return bool
	 * @author Abner Lauxen
	 */
	public function delete($id_array) {
		
		$id_array = !is_array($id_array) ? array($id_array) : $id_array;
		
		foreach ($id_array as $id) {
			
			$id = (int) $id;
			if ($id > 0) $this->db->where($this->primary_key, $id)->limit(1)->delete($this->table_name);
		}
	}
	
	/**
	 * deleta um registro da tabela pelo campo e valor
	 * @param string $key
	 * @param string $value
	 * @return bool
	 * @author Abner Lauxen
	 */
	public function delete_by($key, $val) {
		return $val != '' ? $this->db->where($key, $val)->limit(1)->delete($this->table_name) : FALSE;
	}
}