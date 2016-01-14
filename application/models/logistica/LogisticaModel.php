<?php
class LogisticaModel extends MY_Model {

	public function __construct() {

		parent::MY_Model();
		$this->primary_key = "id";
		$this->table_name = "logistica";
		$this->order_by = "id";
	}
	
	public function obterLogisticas() {
		$sql = "SELECT l.*, CONCAT(co.nome,'-',eo.sigla) AS origem_descricao, CONCAT(cd.nome,'-',ed.sigla) AS destino_descricao, p.descricao AS produto_descricao
				FROM logistica l JOIN itinerario i ON i.id = l.itinerario_id JOIN produto p ON p.id = l.produto_id
				JOIN cidade co ON i.origem_id = co.id JOIN estado eo ON eo.id = co.estado_id
				JOIN cidade cd ON i.destino_id = cd.id JOIN estado ed ON ed.id = cd.estado_id 
				WHERE l.ativo = 1 ORDER BY l.id DESC";
		return $this->db->query($sql)->result_array();
	}
	
	public function obterValoresLogisticaByLogistica($logistica_id) {
		
		$sql = "SELECT * FROM logistica_valores WHERE logistica_id = ".$logistica_id." ORDER BY data ASC";
		return $this->db->query($sql)->result_array();
	}
	
	public function getLogisticaByProdutoAndItinerario($produto_id, $itinerario_id) {
		
		$sql = "SELECT * FROM logistica l WHERE l.produto_id = $produto_id AND l.itinerario_id = $itinerario_id LIMIT 1";
		return $this->db->query($sql)->row_array();
	}
	
	public function inserirValores($logistica_id, $valores) {
		
		foreach ($valores as $value) {
			
			$jsDateTS = strtotime($value['data']);
			$value['data'] = date('Y-m-d', $jsDateTS);
			$value['logistica_id'] = $logistica_id;
			$value['data_cadastro'] = date('Y-m-d h:i:s');
	
			$this->db->set($value);
			$this->db->insert('logistica_valores');
		}
	}
	
	public function deleteValores($arrDelete, $usuario_id) {
		
		foreach ($arrDelete as $value) {
			
			$data = array('logistica_id' => $value['logistica_id'], 'data' => $value['data'], 'valor' => $value['valor'], 'data_historico' => date('Y-m-d h:i:s'),
						  'usuario_id' => $usuario_id, 'data_cadastro' => $value['data_cadastro'], 'observacao' => 'Removido manualmente');
			$this->db->set($data);
			$this->db->insert('logistica_valores_historico');
			
			$this->db->where('id', $value['id']);
			$this->db->delete('logistica_valores');
		}
	}
	
	public function updateValores($arrUpdate, $usuario_id) {
		
		foreach ($arrUpdate as $registro) {
			
			$value = $registro['original'];
			
			$data = array('logistica_id' => $value['logistica_id'], 'data' => $value['data'], 'valor' => $value['valor'], 'data_historico' => date('Y-m-d h:i:s'),
					'usuario_id' => $usuario_id, 'data_cadastro' => $value['data_cadastro'], 'observacao' => 'Alterado manualmente');
			$this->db->set($data);
			$this->db->insert('logistica_valores_historico');
			
			$this->db->set(array('valor' => $registro['valor']))->where('id', $value['id'])->update('logistica_valores');
		}
	}
	
	public function moveToHistorico($valoresAntigos, $usuario_id) {
		
		foreach ($valoresAntigos as $value) {
		
			$data = array('logistica_id' => $value['logistica_id'], 'data' => $value['data'], 'valor' => $value['valor'], 'data_historico' => date('Y-m-d h:i:s'),
					'usuario_id' => $usuario_id, 'data_cadastro' => $value['data_cadastro'], 'observacao' => 'Removido automaticamente');
			$this->db->set($data);
			$this->db->insert('logistica_valores_historico');
			
			$this->db->where('id', $value['id']);
			$this->db->delete('logistica_valores');
		}
	}
}
?>
