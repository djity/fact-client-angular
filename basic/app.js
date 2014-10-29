var app = angular.module('demoBasicApp', [
	'ngMaterial',
	'fact-client.services',
	'fact-client.templates',
	'fact-client.directives'
]);

app.constant('FACT_API_URL', 'http://fact-office.djity.net/fact-api/');
app.constant('FACT_API_WS', 'http://fact-office.djity.net/fact-api/primus');

app.controller('demoBasicCtrl', ['$scope', 'FactStream',
	function($scope, FactStream) {
		$scope.streams = FactStream.query();
		
		$scope.$watch('streams', function(){
			angular.forEach($scope.streams, function(stream){
				stream.followVariant('fast-low-verySmall');
			});
		}, true);
		
	}
]);