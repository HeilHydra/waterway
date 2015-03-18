var keyUtils = require("./utils/key");
var when = require("when");
var guid = require("guid");

var CHANNEL_TYPE = "request";

function WaterwayRequest(connection, key) {
  this.connection = connection;
  this.key = key;
}

WaterwayRequest.prototype.send = function (data) {
  keyUtils.ensureNoWildcards(this.key);
  var self = this;
  var id = guid.raw();
  var dfrd = when.defer();
  var responseKey = keyUtils.getString(CHANNEL_TYPE, id, "respond");
  this.connection.on(responseKey, function (response) {
    self.connection.off(responseKey);
    dfrd.resolve(response);
  });
  this.connection.emit(keyUtils.getString(CHANNEL_TYPE, id, "send", this.key), data);
  return dfrd.promise;
};

WaterwayRequest.prototype.respond = function (callback) {
  var self = this;
  this.connection.on(keyUtils.getString(CHANNEL_TYPE, "*", "send", this.key), function (data, pattern) {
    var requestKey = keyUtils.getArray(pattern);
    var id = requestKey[1];
    when(callback(data, requestKey.slice(3)))
      .then(function (response) {
        self.connection.emit(keyUtils.getString(CHANNEL_TYPE, id, "respond"), response);
      });
  });
};

module.exports = WaterwayRequest;