var appDash = angular.module('appDash');

appDash.filter("obterTipoOperLogistica", function(Constantes) {
	return function(key){
		return Constantes.TipoOperLogistica[key - 1].tipo
	};
})

appDash.filter("obterNatOperLogistica", function(Constantes) {
	return function(key) {
		return Constantes.NatOperLogistica[key - 1].descricao
	}
})

appDash.filter("obterTipoSolicitacao", function(Constantes) {
	return function(key) {
		if (key) {
			return Constantes.TipoSolicitacao[key - 1].tipo
		}
	}
})

appDash.filter("obterTempoDecorrido", function() {
	return function(minutos) {
		if (minutos == 0) return " < 1 min";
		if (minutos > 59) {
			horas = (minutos/60) | 0;
			if (horas > 23) {
				dias = (horas/24) | 0;
				
				if (dias == 1) return dias+" dia";
				else return " "+dias+" dias";
			} else {
				if (horas == 1) return horas+" hr";
				else return " "+horas+" hrs";
			}
		} else {
			if (minutos == 1) return minutos+" min";
			else return " "+minutos+" mins";
		}
	}
})

appDash.filter('dateFromMySql', function() {
	return function(dateString) {
		
		if (dateString) {
			if (dateString != '0000-00-00 00:00:00') {
				t = dateString.split(/[- :]/);
				return Date.parse(new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0));  
			}
		}
		return null;
    }
});

appDash.filter('boolIcon', function($sce) {
	return function(flag) {
		return  flag == 1 ? $sce.trustAsHtml('<span class="glyphicon glyphicon-ok"></span>') 
					: $sce.trustAsHtml('<span class="glyphicon glyphicon-remove"></span>');
    }
});

appDash.filter('obterIconeStatusSolicitacao', function($sce) {
	return function(status_solicitacao) {
		
		icone = "";
		title = "";
		
		switch(status_solicitacao) {
		    case "1":
		    	icone = "aberto-sm";
				title = "Aberto";
		        break;
		    case "2":
		    	icone = "aprovado-sm";
				title = "Aprovado";
		        break;
		    case "3":
		    	icone = "rejeitado-sm";
				title = "Rejeitado";
		        break;
		    case "4":
		    	icone = "cancelado-sm";
				title = "Cancelado";
		        break;
		} 
		
		return $sce.trustAsHtml("<img src='./assets/img/status/"+icone+".png' title='"+title+" 'class='img-circle'>"); 
    }
});

appDash.filter('obterProfilePic', function() {
	return function(profile_pic) {
		return  profile_pic ? profile_pic : "male-placeholder.jpg" ;
    }
});