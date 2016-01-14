<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DolarForward extends CI_Controller {
	
	
	public function __construct() {
		parent::__construct();
		$this->load->model('precificacao/PrecificacaoModel');
		$this->load->library('funcoes');
		$this->load->model('FuncoesModel');
	}
	
	public function obterFeriados() {
		echo json_encode($this->FuncoesModel->obterFeriados());	
	}
	
	private function obterDolarSpotBroadCast() {
		return 3.5397;
	}
	
	public function obterDolarSpot() {
		echo json_encode($this->obterDolarSpotBroadCast());
	}
	
	public function obterTaxasBroadCast() {
		
		echo json_encode(array(
			array('di' => 0.1438, 'frc' => 0.0249, 'vcto' => '04/01/2016'),
			array('di' => 0.1436, 'frc' => 0.0266, 'vcto' => '01/02/2016'),
			array('di' => 0.1448, 'frc' => 0.0280, 'vcto' => '01/03/2016'),
			array('di' => 0.1446, 'frc' => 0.0289, 'vcto' => '01/04/2016'),
			array('di' => 0.1448, 'frc' => 0.0302, 'vcto' => '02/05/2016'),
			array('di' => 0.1449, 'frc' => 0.0313, 'vcto' => '01/06/2016'),
			array('di' => 0.1444, 'frc' => 0.0325, 'vcto' => '01/07/2016'),
			array('di' => 0.1445, 'frc' => 0.0338, 'vcto' => '01/08/2016'),
			array('di' => 0, 	  'frc' => 0, 	   'vcto' => '01/09/2016'),
			array('di' => 0.1438, 'frc' => 0.0350, 'vcto' => '03/10/2016'),
			array('di' => 0.1423, 'frc' => 0.0353, 'vcto' => '01/11/2016'),
			array('di' => 0.1430, 'frc' => 0.0362, 'vcto' => '01/12/2016')
		));
	}
	
	private function obterPrimeiraTaxa($taxas, $posterior, $indice) {
		
		if ($posterior) $indice += 1;
		else $indice -= 1;
		
		if (!array_key_exists($indice, $taxas)) {
			return false;
		}
		
		$retorno = $taxas[$indice];
		
		if ($retorno['frc'] > 0 || $retorno['di'] > 0) return $retorno;;
		return $this->obterPrimeiraTaxa($taxas, $posterior, $indice);
	}
	
	private function interpolar($taxas, $feriados) {
		
		$retorno = array();
		foreach ($taxas as $index=>$taxa) {
			
			$dataVcto = $this->funcoes->dateBRToPadrao($taxa['vcto']);
			if ($taxa['di'] == 0 || $taxa['di'] == null || $taxa['frc'] == 0 || $taxa['frc'] == null) {
				
				$taxaAnterior = $this->obterPrimeiraTaxa($taxas, false, $index);
				$taxaPosterior = $this->obterPrimeiraTaxa($taxas, true, $index);
				
				$calcular = true;
				
				if ($taxaAnterior) {
					$dataVctoAnt = $this->funcoes->dateBRToPadrao($taxaAnterior['vcto']);
					$duAnt = $this->funcoes->calcularDiasUteis($dataVctoAnt, $dataVcto, $feriados);
					$dcAnt = $this->funcoes->calcularDiasCorridos($dataVctoAnt, $dataVcto);
				} else $calcular = false;
				
				if ($taxaPosterior) {
					$dataVctoPos = $this->funcoes->dateBRToPadrao($taxaPosterior['vcto']);
					$duPos = $this->funcoes->calcularDiasUteis($dataVcto, $dataVctoPos, $feriados);
					$dcPos = $this->funcoes->calcularDiasCorridos($dataVcto, $dataVctoPos);
				} else $calcular = false;
				
				$taxa['di'] = $calcular ? round((($duPos/($duAnt + $duPos))*$taxaAnterior['di']) + 
				   (($duAnt/($duAnt + $duPos))*$taxaPosterior['di']), 4) : 0;
				$taxa['frc']= $calcular ? round((($dcPos/($dcAnt + $dcPos))*$taxaAnterior['frc']) + 
				   (($dcAnt/($dcAnt + $dcPos))*$taxaPosterior['frc']), 4) : 0;
				
				$taxa['bmf'] = false;
			} else {
				$taxa['bmf'] = true;
			}
			
			array_push($retorno, $taxa);
		}
		
		return $retorno;
	}
	
	private function calcularDias($taxas, $feriados) {
		
		$hoje = date('Y-m-d');
		
		$retorno = array();
		
		foreach ($taxas as $taxa) {
			$dataVcto = $this->funcoes->dateBRToPadrao($taxa['vcto']);
			$taxa['DU'] = $this->funcoes->calcularDiasUteis($hoje, $dataVcto, $feriados);
			$taxa['DC'] = $this->funcoes->calcularDiasCorridos($hoje, $dataVcto);
			array_push($retorno, $taxa);
		}
		return $retorno;
	}
	
	public function simular() {
		
		$dados = $this->input->post('registro');
		$taxas = $dados['taxas'];
		$dolar = $dados['dolar'];
		$feriados = $dados['feriados'];
		$calcularDias = $dados['calcularDias'];
		
		$taxas = $this->interpolar($taxas, $feriados);
		if ($calcularDias) $taxas = $this->calcularDias($taxas, $feriados);
		
		$dolarForward = array();
		foreach ($taxas as $taxa) {
			$taxa['dolar'] = $this->funcoes->calcularDolarFuturo($dolar, $taxa['frc'], $taxa['DC'], $taxa['di'], $taxa['DU']);
			array_push($dolarForward, $taxa);
		}
		
		echo json_encode($dolarForward);
	}
	
	public function obterDolarNaData() {
	
		$arrayDatas = array();
		
		$dados = $this->input->post('registro');
		$feriados = $dados['feriados'];
		$dolar = $dados['dolar'];
		$taxas = $dados['taxas'];
		$data = $dados['data'];
		$dataProxima = date('Y-m-d', strtotime($data. ' + 11 days'));
		
		foreach ($taxas as $taxa) array_push($arrayDatas, strtotime($this->funcoes->dateBRToPadrao($taxa['vcto'])));
		$indice = $this->funcoes->getClosestIndex(strtotime($dataProxima), $arrayDatas);
		
		$taxa = $taxas[$indice];
		$dataVcto = $this->funcoes->dateBRToPadrao($taxa['vcto']);
		$taxa['DUData'] = $this->funcoes->calcularDiasUteis(date('Y-m-d'), $data, $feriados);
		$taxa['DCData'] = $this->funcoes->calcularDiasCorridos(date('Y-m-d'), $data);
		
		$taxa['DU'] = $this->funcoes->calcularDiasUteis(date('Y-m-d'), $dataVcto, $feriados);
		$taxa['DC'] = $this->funcoes->calcularDiasCorridos(date('Y-m-d'), $dataVcto);
		
		$dolarCabecaMes = $this->funcoes->calcularDolarFuturo($dolar, $taxa['frc'], $taxa['DC'], $taxa['di'], $taxa['DU']);
		$dolarData = $this->funcoes->calcularDolarFuturo($dolar, $taxa['frc'], $taxa['DCData'], $taxa['di'], $taxa['DUData']);
		
		echo json_encode(array('dataCabMes' => $dataVcto, 'dolarData' => $dolarData, 'dolarCabMes' => $dolarCabecaMes));
	}
}