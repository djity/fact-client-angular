angular.module('fact-client.directives.stream-switcher', [])
	.directive('factStreamSwitcher', function(){
		return {
			restrict: 'EA',
			templateUrl: 'directives/fact-stream-switcher/fact-stream-switcher.html',
			scope: {
				room: '=',
				streams: '='
			},
			link: function(scope, element, attrs, ngModel) {
				scope.room = 'TEST';
			}
		};
	});