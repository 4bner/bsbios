<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<?php header ('Content-type: text/html; charset=UTF-8'); ?>

<!DOCTYPE HTML>
<html>

	<head>
	    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	    <meta name="viewport" content="width=device-width, initial-scale=1">
	    <meta name="author" content="Abner Lauxen">
	    
	    <title>BSBios Software</title>
	    
		<!-- JAVASCRIPT -->
		<script type="text/javascript" src="<?=JS.'jquery/jquery-2.1.4.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'jquery/jquery.noty.packaged.min.js'?>"></script>
		<script type="text/javascript" src="<?=JS.'jquery/Chart.min.js'?>"></script>
		
		<script type="text/javascript" src="<?=JS.'angular/angular.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/i18n/angular-locale_pt-br.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-ui-route.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-cookies.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-idle.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-animate.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-datepicker.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-input-masks-standalone.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-modal-service.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-chart.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'angular/angular-pagination.js'?>" ></script>

		<script type="text/javascript" src="<?=JS.'jquery/moment.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'jquery/moment-timezone-all-years.min.js'?>" ></script>
		
		<script type="text/javascript" src="<?=JS.'bootstrap/bootstrap.min.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/classie.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/app.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/appFactoriesServices.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/appDirectives.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/appFilters.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/ControllersCadastros.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/ControllersGeral.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/ControllersPrecificacao.js'?>" ></script>
		<script type="text/javascript" src="<?=JS.'custom/bootbox.min.js'?>" ></script>
		
		<script>
			angular.module('appDash').controller('cabecalhoController', function($rootScope) {
				$rootScope.csrf_hash = '<?=$csrf_hash?>';
				$rootScope.site_url = '<?=$site_url?>';
			});

			$(document).ready(function () {
		        $(document).on('show.bs.modal', '.modal', function (event) {
		            var zIndex = 1040 + (10 * $('.modal:visible').length);
		            $(this).css('z-index', zIndex);
		            setTimeout(function() {
		                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		            }, 0);
		        });
			});
		</script>
		
		<!-- CSS -->
		<link rel="stylesheet" href="<?=CSS.'bootstrap.min.css'?>" type='text/css' />
	    <link rel="stylesheet" href="<?=CSS.'full.css'?>" type='text/css' >
	    <link rel="stylesheet" href="<?=CSS.'navbar.css'?>" type='text/css' >
	    <link rel="stylesheet" href="<?=CSS.'widget.css'?>" type='text/css' >
	    <link rel="stylesheet" href="<?=CSS.'login.css'?>" type='text/css' />
	    <link rel="stylesheet" href="<?=CSS.'angular-chart.min.css'?>" type='text/css' />
	    <link rel="stylesheet" href="<?=CSS.'animate.css'?>" type='text/css' />
	    <link rel="stylesheet" href="<?=CSS.'angular-datepicker.min.css'?>" type='text/css' />
	    
	</head>
	
	<body id="app" class="cbp-spmenu-push padding-navbar" ng-app="appDash" ng-controller="cabecalhoController">
		<div ui-view="role" autoscroll="false"></div>
	</body>
</html>