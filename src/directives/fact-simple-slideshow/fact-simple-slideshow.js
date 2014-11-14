angular.module('fact-client.directives.simple-slideshow', ['ngAnimate'])
	.directive('factSimpleSlideshow', ['$timeout', '$log', 'FACT_API_URL',
		function($timeout, $log, FACT_API_URL) {
			return {
				restrict: 'E',
				templateUrl: 'directives/fact-simple-slideshow/fact-simple-slideshow.html',
				scope: {
					fact: '=',
					preloadDelay: '=preloadDelay',
					slide: '=',
					rotate: '=',
					fade: '=',
					truncate: '='
				},
				link: function(scope, element) {
					scope.baseUrl = FACT_API_URL;
					// preload delay is 0 by default
					var preloadDelay = scope.preloadDelay === undefined ? 0 : scope.preloadDelay;

					scope.iter = 0;
					scope.imgStyles = [{}, {}];
					
					scope.$watch('fact', function(newVal, oldVal) {
						// Set nextFact to allow browser caching of depiction
						scope.nextFact = newVal;
						$timeout(function() {
							scope.previousFact = oldVal;
							scope.currentFact = newVal;
							scope.iter += 1;

							if (scope.currentFact) {

								// process image dimension base on multiples criterias

								// first the size of the image that will be loaded
								// weird, it seems that width and height are mixed up by the API ?
								var originalWidth = scope.currentFact.depiction.width;
								var originalHeight = scope.currentFact.depiction.height;
								// also the size of the container element
								var container = element.parent()[0];
								var containerWidth = container.offsetWidth;
								var containerHeight = container.offsetHeight;
								// then a horizontal/vertival ratio that indicates if the image
								// has a more horizontal shape than the container (<1) or more vertical (>1)
								var hvRatio = (containerWidth / containerHeight) / (originalWidth / originalHeight);

								var currentStyle = scope.imgStyles[scope.iter % 2] = {};
								if ((hvRatio > 1 && scope.truncate) || (hvRatio < 1 && !scope.truncate)) {
									currentStyle.width = containerWidth + 'px';
									var height = originalHeight * (containerWidth / originalWidth);
									currentStyle.height = height + 'px';
									currentStyle['margin-top'] = ((containerHeight - height) / 2) + 'px';
								} else {
									currentStyle.height = containerHeight + 'px';
									var width = originalWidth * (containerHeight / originalHeight);
									currentStyle.width = width + 'px';
									currentStyle['margin-left'] = ((containerWidth - width) / 2) + 'px';
								}
							}
						}, preloadDelay);
					});
				}
			};
		}
	]);