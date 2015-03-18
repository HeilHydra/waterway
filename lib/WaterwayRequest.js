var when = require("when");
var guid = require("guid");

var CHANNEL_TYPE = "request";

function WaterwayRequest(connection, key) {
  this._connection = connection;
  this._key = key;
}

WaterwayRequest.prototype.send = function (data) {
  keyUtils.ensureNoWildcards(this._key);
  var self = this;
  var id = guid.raw();
  var dfrd = when.defer();
  this._connection.on(CHANNEL_TYPE, id, "respond", function (data) {
    self.connection.off(CHANNEL_TYPE, id, "respond");
    dfrd.resolve(data);
  });
  this._connection.emit(CHANNEL_TYPE, id, "send", this._key, data);
  return dfrd.promise;
};

WaterwayRequest.prototype.respond = function (callback) {
  var self = this;
  this._connection.on(CHANNEL_TYPE, "*", "send", this._key, function (data, requestKey) {
    var id = requestKey[1];
    when(callback(data, requestKey.slice(3)))
      .then(function (response) {
        self.connection.emit(CHANNEL_TYPE, id, "respond", response);
      });
  });
};

module.exports = WaterwayRequest;