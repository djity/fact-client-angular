var testApp = angular.module('testApp', [
	'ngMaterial',
	'ui.router',
	'test.data',
	'fact-client.templates',
	'fact-client.directives'
]);


testApp.constant('FACT_API_URL', '');
testApp.constant('FACT_API_WS', '');

testApp.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
			.state('fact-simple-slideshow', {
				url: '/fact-simple-slideshow',
				templateUrl: 'fact-simple-slideshow.html'
			})
			.state('fact-stream-list', {
				url: '/fact-stream-list',
				templateUrl: 'fact-stream-list.html'
			})
			.state('fact-world-map', {
				url: '/fact-world-map',
				templateUrl: 'fact-world-map.html'
			});
	}
]);

testApp.controller('testAppCtrl', ['$scope', '$interval', 'STREAMS', 'FACTS',
	function($scope, $interval, STREAMS, FACTS) {
		$scope.streams = STREAMS;
		$scope.currentStream = null;

		var factIndex = 0;
		$interval(function(){
			$scope.fact = FACTS[factIndex];
			if ($scope.streams[0]) {
				$scope.streams[0].variantsLastFact = $scope.streams[0].variantsLastFact || {};
				$scope.streams[0].variantsLastFact['fast-low-verySmall'] = $scope.fact;	
			}
			
			factIndex += 1;
			factIndex = factIndex %FACTS.length;
		}, 3000);
	}
]);