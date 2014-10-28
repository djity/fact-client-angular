 angular.module('fact-client.services.stream', ['ngResource', 'fact-client.services.room'])
 	.service('FactStream', ['$resource', '$rootScope', 'FactRoom', 'FACT_API_URL',
 		function($resource, $rootScope, FactRoom, FACT_API_URL) {
 			var Stream = $resource(FACT_API_URL + '/factstream/:streamId', {
 				streamId: '@_id'
 			}, {
 				query: {
 					method: 'GET',
 					isArray: true,
 					transformResponse: function(data) {
 						return angular.fromJson(data).results;
 					}
 				},
 				get: {
 					method: 'GET',
 					isArray: false,
 				},
 				update: {
 					method: 'PUT',
 					isArray: false
 				},
 				create: {
 					method: 'post'
 				}
 			});

 			Stream.prototype.$save = function(callback, errorCallback) {
 				if (!this._id) {
 					return this.$create(callback, errorCallback);
 				} else {
 					return this.$update(callback, errorCallback);
 				}
 			};

 			Stream.prototype.followVariant = function(variantKey) {
 				var that = this;
 				FactRoom.join(that._id + '_' + variantKey).then(function(room) {
 					room.on(function(data) {
 						$rootScope.$apply(function() {
 							that.variantsLastFact = that.variantsLastFact || {};
 							that.variantsLastFact[variantKey] = data;
 						});
 					});
 				});
 			};
 			return Stream;

 		}
 	]);