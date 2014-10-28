angular.module('fact-client.directives.simple-slideshow', ['ngAnimate'])
	.directive('factSimpleSlideshow', ['$timeout', 'FACT_API_URL',
		function($timeout, FACT_API_URL) {
			return {
				restrict: 'EA',
				templateUrl: 'directives/fact-simple-slideshow/fact-simple-slideshow.html',
				scope: {
					fact: '=',
					preloadDelay: '=preloadDelay',
					slide: '=',
					rotate: '=',
					fade: '='
				},
				link: function(scope) {
					scope.baseUrl = FACT_API_URL;
					// preload delay is 0 by default
					var preloadDelay = scope.preloadDelay === undefined ? 0 : scope.preloadDelay;

					scope.iter = 0;
					scope.$watch('fact', function(newVal, oldVal) {
						// Set nextFact to allow browser caching of depiction
						scope.nextFact = newVal;
						$timeout(function() {
							scope.previousFact = oldVal;
							scope.currentFact = newVal;
							scope.iter += 1;
						}, preloadDelay);
					});
				}
			};
		}
	]);