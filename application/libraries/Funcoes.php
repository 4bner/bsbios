<?php

class Funcoes {

	/**
	 * @tutorial Fun��o retorna o Numero de dias �teis entre duas datas, e pula os feriados
	 * @Author: Abner Lauxen
	 * @return integer
	 * @param date, date, array
	 * @since 14/12/2015
	 */
	public function calcularDiasUteis($inicial, $final, $feriados){
		
		$dataFinal = strtotime($final);
		$dataInicial = strtotime($inicial);
		
		$dias = floor(($dataFinal - $dataInicial)/86400);
		
		$semanas_cheias = floor($dias / 7);
		$dias_restantes = fmod($dias, 7);
		
		//retorna 1 se for segunda-feira... 7 se for domingo
		$dia_inicial = date("N", $dataInicial);
		$dia_final = date("N", $dataFinal);
		
		if ($dia_inicial <= $dia_final) {
		
			if ($dia_inicial <= 6 && 6 <= $dia_final) $dias_restantes--; //INTERVALO NA MESMA SEMANA
			if ($dia_inicial <= 7 && 7 <= $dia_final) $dias_restantes--; //INTERVALO ENTRE DUAS SEMANAS
		} else {
				
			if ($dia_inicial == 7) { // Dia inicial � ap�s o dia final;
		
				$dias_restantes--; // Se come�ou em um domingo, diminui 1;
				if ($dia_final == 6) $dias_restantes--; // Se termina em um s�bado, diminui outro dia;
					
			} else { // Come�ou num s�badou ou antes, e terminou em um dia da semana = subtrai o final de semana todo
				$dias_restantes -= 2;
			}
		}
		
		//Nro de dias corridos � o numero de semanas * 5;
		$diasUteis = $semanas_cheias * 5;
		if ($dias_restantes > 0 ) $diasUteis += $dias_restantes;
		
		//Desconta os feriados
		$tss = array();
		foreach($feriados as $feriado){
			$ts = strtotime($feriado['feriado']);
			if ($dataInicial <= $ts && $ts <= $dataFinal &&  date("N", $ts) != 6 && date("N", $ts) != 7) $diasUteis--;
		}
		return $diasUteis;
	}	
	
	/**
	 * @tutorial Fun��o retorna o Numero de dias corridos entre duas datas
	 * @Author: Abner Lauxen
	 * @return integer
	 * @param date, date
	 * @since 12/12/2015
	 */
	public function calcularDiasCorridos($inicial, $final) {
		
		$dataFinal = strtotime($final);
		$dataInicial = strtotime($inicial);
		return floor(($dataFinal - $dataInicial)/86400);
	}
	
	/**
	 * @tutorial Fun��o retorna o a data no formato padr�o americano, a partir da data brasileira
	 * @Author: Abner Lauxen
	 * @return dateString ('yyyy-mm-dd')
	 * @param dateString ('dd/mm/yyyy')
	 * @since 11/12/2015
	 */
	public function dateBRToPadrao($data) {
		$date = DateTime::createFromFormat('d/m/Y', $data);
		return $date->format('Y-m-d');
	}
	
	/**
	 * @tutorial Fun��o retorna o d�lar precificado no futuro, aplicando a f�rmula a partir das vari�veis recebidas como par�metro;
	 * @Author: Abner Lauxen
	 * @return float
	 * @param float, float, int, float, int
	 * @since 14/12/2015
	 */
	public function calcularDolarFuturo($dolarSpot, $taxaFRC, $diasCorridos, $taxaDI, $diasUteis) {
		
		$di = pow((1+$taxaDI), ($diasUteis/252));
		$frc = (1+$taxaFRC*($diasCorridos/360));
		$valor = round($dolarSpot, 8)*($di/$frc);
		return $valor;
	}
	
	/**
	 * @tutorial Fun��o retorna o indice do array contendo o valor mais pr�ximo do procurado;
	 * @Author: Abner Lauxen
	 * @return float
	 * @param object/float/string, array
	 * @since 18/12/2015
	 */
	public function getClosestIndex($valorProcurado, $array) {
		
		$indice = null; $closest = null;
		foreach ($array as $index=>$item) {
			if ($closest === null || abs($valorProcurado-$closest) > abs($item-$valorProcurado)) {
				$indice = $index;
				$closest = $item;
			}
		}
		return $indice;
	}
}