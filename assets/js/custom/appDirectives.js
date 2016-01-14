var appDash = angular.module('appDash');

appDash.directive('validNumber', function() {
    return {
    	require: '?ngModel',
    	link: function(scope, element, attrs, ngModelCtrl) {
    		
    		if(!ngModelCtrl) return; 

    		ngModelCtrl.$parsers.push(function(val) {
    			
    			if (angular.isUndefined(val)) var val = '';
          
    			var clean = val.replace(/[^-0-9\.]/g, '');
    			var negativeCheck = clean.split('-');
    			var decimalCheck = clean.split('.');
    			
    			if(!angular.isUndefined(negativeCheck[1])) {
    				negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
    				clean =negativeCheck[0] + '-' + negativeCheck[1];
    				if(negativeCheck[0].length > 0) {
    					clean =negativeCheck[0];
    				}
    			}
            
    			if(!angular.isUndefined(decimalCheck[1])) {
    				decimalCheck[1] = decimalCheck[1].slice(0,4);
    				clean = decimalCheck[0]+'.'+decimalCheck[1];
    			}

    			if (val !== clean) {
    				ngModelCtrl.$setViewValue(clean);
    				ngModelCtrl.$render();
    			}
    			
    			return clean;
    		});

    		element.bind('keypress', function(event) {
    			if(event.keyCode === 32) {
    				event.preventDefault();
    			}
    		});
  		}
    };
});

appDash.directive('showErrors', function() {
	return {
		restrict: 'A',
		require: '^form',
		link: function (scope, el, attrs, formCtrl) {
	        var inputEl   = el[0].querySelector("[name]");
	        var inputNgEl = angular.element(inputEl);
	        var inputName = inputNgEl.attr('name');
	        
	        inputNgEl.bind('blur', function() {
	        	el.toggleClass('has-error', formCtrl[inputName].$invalid);
	        })
		}
	}
});

appDash.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
        	if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

appDash.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

appDash.directive('loading', function () {
    return {
    	restrict: 'E',
    	replace:true,
    	template: '<div class="text-center"><img class="loader" src="./assets/img/gears.gif"/></div>',
    	link: function (scope, element, attr) {
            scope.$watch('loading', function (val) {
                if (val) $(element).show();
                else $(element).hide();
            });
    	}
    }
})