angular.module('fact-client.services.feed', [])
  .service('FactFeed', ['config', '$resource', '$http', '$rootScope', '$q', 'Room',
    function(config, $resource, $http, $rootScope, $q, Room) {

      function _processFeed(feed) {
        if (feed.lastRun.error) {
          feed.state = 'error';
        } else if (feed.lastRun.running) {
          feed.state = 'running';
        } else if (!feed.lastRun.date) {
          feed.state = 'new';
        } else if (feed.lastRun.cancel) {
          feed.state = 'cancelled';
        } else {
          feed.state = 'done';
        }

        feed.readonly = _.contains(['running', 'done', 'error'], feed.state);

        return feed;
      }

      var Feed = $resource(config.api + '/feed/:feedId', {
        feedId: '@_id'
      }, {
        query: {
          method: 'GET',
          isArray: true,
          transformResponse: function(data) {
            return _.map(angular.fromJson(data).results, _processFeed);
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

      Feed.prototype.$save = function(callback, errorCallback) {
        if (!this._id) {
          return this.$create(callback, errorCallback);
        } else {
          return this.$update(callback, errorCallback);
        }
      };

      Feed.prototype.follow = function() {
        var self = this;
        Room.join(self._id).then(function(room) {
          self.room = room;
          self.room.on(function(data) {
            $rootScope.$apply(function() {
              $.extend(true, self, data);
              _processFeed(self);
            });
          });
        });
      };

      Feed.prototype.run = function() {
        $http.put(config.api + '/feed/' + this._id + '/run');
      };

      Feed.prototype.cancel = function() {
        $http.put(config.api + '/feed/' + this._id + '/cancel');
      };

      Feed.prototype.state = 'new';
      Feed.prototype.readonly = false;

      return Feed;
    }
  ]);