angular.module('fact-client.services')
	.service('FactResource', ['$resource', '$log', '$http', 'FACT_API_URL',
		function($resource, $log, $http, FACT_API_URL) {

			function _prepareFacets(facets) {
				return _.mapValues(facets, function(facet) {
					return _.object(_.map(facet.terms, function(item) {
						return [item.term, item.count];
					}));
				});
			}

			var Resource = $resource(FACT_API_URL + '/resource/:_id', {}, {
				query: {
					method: 'GET',
					isArray: false,
					params: {
						facets: {
							types: {
								terms: {
									field: 'types',
								}
							},
							dataKeys: {
								terms: {
									field: 'dataKeys',
								}
							}
						}
					},
					transformResponse: function(data) {
						var objectData = angular.fromJson(data);
						return {
							total: objectData.hits.total,
							hits: objectData.hits.hits,
							facets: _prepareFacets(objectData.facets)
						};
					}
				}
			});

			Resource.histogram = function(feedId) {
				return $http({
					method: 'GET',
					url: FACT_API_URL + '/resource/',
					params: {
						facets: {
							'0': {
								'date_histogram': {
									field: 'history.date',
									interval: '1m'
								},
								global: true,
								'facet_filter': {
									fquery: {
										query: {
											filtered: {
												query: {
													'query_string': {
														query: 'history.feed:' + feedId
													}
												},
												filter: {
													bool: {
														must: [{
															'match_all': {}
														}]
													}
												}
											}
										}
									}
								}
							}
						}
					},
					transformResponse: function(data) {
						return [{
							key: 'Serie 1',
							values: angular.fromJson(data).facets['0'].entries
						}];
					}
				});
			};


			return Resource;
		}
	]);