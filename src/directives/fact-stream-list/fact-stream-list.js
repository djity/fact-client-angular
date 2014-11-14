angular.module('fact-client.directives.stream-list', [])
	.directive('factStreamList', function(){
		return {
			restrict: 'E',
			templateUrl: 'directives/fact-stream-list/fact-stream-list.html',
			scope: {
				streams: '=',
				currentStream: '='
			},
			link: function(scope){
				scope.activeStream = function(stream){
					// If no current stream defined then expression is unassignable
					if(scope.currentStream !== undefined) {
						scope.currentStream = stream;	
					}
				};
			}
		};
	});