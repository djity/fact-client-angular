 angular.module('fact-client.services')
 	.service('FactStream', ['$resource', 'FACT_API_URL',
 		function($resource, FACT_API_URL) {
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
 			return Stream;

 		}
 	]);