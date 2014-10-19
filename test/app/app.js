var testApp = angular.module('testApp', [
	'ui.router',
	'fact-client.services',
	'fact-client.templates',
	'fact-client.directives.stream-switcher'
]);

testApp.constant('FACT_API_URL', 'http://fact-office.djity.net/fact-api/');

testApp.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider
			.state('fact-stream-switcher', {
				url: "/fact-stream-switcher",
				templateUrl: "fact-stream-switcher.html"
			});
	}
]);

testApp.controller('testAppCtrl', ['$scope', 'FactStream',
	function($scope, FactStream) {
		$scope.streams = FactStream.query();
	}
]);