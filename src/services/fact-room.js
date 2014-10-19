angular.module('fact-client.services')
	.service('FactRoom', ['$q', '$rootScope', '$window', '$log', 'FACT_API_WS',
		function($q, $rootScope, $window, $log, FACT_API_WS) {

			var joiningRooms = {};
			var rooms = {};

			$log.debug('primus connecting to ' + FACT_API_URL);
			var socket = new Primus(FACT_API_WS);

			socket.on('data', function(response) {
				$log.debug('receiving data from primus', response);
				if (response.room) {
					if (response.room in rooms && response.content) {
						rooms[response.room].fire(response.content);
					}
					if (response.room in joiningRooms && response.action === 'join') {
						rooms[response.room] = new Room(response.room);
						$rootScope.$apply(function() {
							joiningRooms[response.room].cb.resolve(rooms[response.room]);
						});
						delete joiningRooms[response.room];
					}
				}
			});

			function Room(_id) {
				this._id = _id;
				this.callbacks = [];
			}

			Room.prototype.on = function(callback) {
				this.callbacks.push(callback);
			};

			Room.prototype.removeListeners = function() {
				this.callbacks = [];
			};

			Room.prototype.fire = function(data) {
				_.each(this.callbacks, function(callback) {
					callback(data);
				});
			};

			var roomsManager = {};

			roomsManager.join = function(roomId) {
				//the room is already being joined
				if (roomId in joiningRooms) {
					return joiningRooms[roomId].cb.promise;
				}

				var defer = $q.defer();

				//the room is already joined
				if (roomId in rooms) {
					defer.resolve(rooms[roomId]);
					return defer.promise;
				}

				joiningRooms[roomId] = {
					time: new Date(),
					cb: defer
				};

				var message = {
					action: 'join',
					room: roomId
				};
				socket.write(message);
				return defer.promise;
			};

			roomsManager.leave = function(room) {
				var message = {
					action: 'leave',
					room: room._id
				};
				socket.write(message);
				delete this.rooms[room._id];
			};

			return roomsManager;
		}
	]);