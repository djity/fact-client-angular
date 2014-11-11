var app = angular.module('demoBasicApp', [
	'ngMaterial',
	'fact-client.services',
	'fact-client.directives',
	'fact-client.templates'
]);

app.constant('FACT_API_URL', 'http://fact-office.djity.net/fact-api/');
app.constant('FACT_API_WS', 'http://fact-office.djity.net/fact-api/primus');

app.controller('demoBasicCtrl', ['$scope', 'FactStream',
	function($scope, FactStream) {
		$scope.streams = FactStream.query();
		
		$scope.$watch('streams', function(){
			$scope.currentStream = $scope.currentStream || $scope.streams[0];
			angular.forEach($scope.streams, function(stream){
				stream.followVariant('fast-low-verySmall');
			});
		}, true);

		$scope.$watch('currentStream', function(){
			if ($scope.currentStream) {
				$scope.currentStream.followVariant('veryFast-low-large');
			}
		});
		
	}
]);