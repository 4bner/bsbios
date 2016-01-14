<?php
class SolicitacaoModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "solicitacao";
		$this->order_by = "id";
	}
	
	public function getSolicitacaoValidaByTipoAndStatus($tipo_solicitacao, $status_solicitacao) {
		
		$conditions = array('finalizado' => 0, 'tipo_solicitacao' => $tipo_solicitacao, 'data_validade >=' => date('Y-m-d'));
		$this->db->where($conditions);
		$this->db->where_in('status_solicitacao', $status_solicitacao);
		
		return $this->db->get($this->table_name)->row_array();
	}
	
	public function efetuarSolicitacao($dados) {
		return $this->save($dados);
	}
	
	public function getCountSolicitacaoAberto() {
		
		$conditions = array('finalizado' => 0, 'data_validade >=' =>  date('Y-m-d'), 'status_solicitacao' => 1);
		$this->db->from($this->table_name);
		$this->db->where($conditions);
		return $this->db->count_all_results();
	}		
	
	public function getAllSolicitacaoAberto() {
		$tsn = date('Y-m-d h:i:s');
		$s = array("u.nome as usu_nome", "u.profile_pic", "s.*", "TIMESTAMPDIFF(MINUTE, s.data_solicitacao, '$tsn') as tempo");
		$c = array('finalizado' => 0, 'data_validade >=' => date('Y-m-d'), 'status_solicitacao' => 1);
		return $this->db->select($s)->from('solicitacao s')->join('usuario u','u.id = s.usuario_solicitante_id')->where($c)->order_by('tempo', 'ASC')->get()->result_array();
	}
	
	public function getAllSolicitacoes() {
		
		$s = array("u.nome as usr_nome", "u.profile_pic", "s.*", "ud.nome as usr_def_nome", "ud.profile_pic as profile_pic_deferimento");
		
		return $this->db->select($s)->from('solicitacao s')
				->join('usuario u','u.id = s.usuario_solicitante_id')
				->join('usuario ud', 'ud.id = s.usuario_deferimento_id', 'left')
				->order_by('s.data_solicitacao', 'DESC')->get()->result_array();
	}
}
?>


