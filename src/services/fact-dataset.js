angular.module('fact-client.services.dataset', [])
	.service('FactRDFDataset', ['$resource', 'FACT_API_URL',
		function($resource, FACT_API_URL) {

			var File = $resource(config.api + '/datasets/rdf', {}, {
				query: {
					url: config.api + '/datasets/rdf',
					method: 'GET',
					isArray: true,
					transformResponse: function(data) {
						return angular.fromJson(data).results;
					}
				}
			});

			return File;
		}
	]);