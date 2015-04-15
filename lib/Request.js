var when = require("when");
var guid = require("guid");
var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "request";

function Request(connection, key) {
  this._connection = connection;
  this._key = key;
}

Request.prototype.send = function (data) {
  keyUtils.ensureNoWildcards(this._key);
  var self = this;
  var id = guid.raw();
  var dfrd = when.defer();
  this._connection.on(CHANNEL_TYPE, id, "respond", function (data) {
    self._connection.off(CHANNEL_TYPE, id, "respond");
    dfrd.resolve(data);
  });
  this._connection.emit(CHANNEL_TYPE, id, "send", this._key, data);
  return dfrd.promise;
};

Request.prototype.respond = function (callback) {
  var self = this;
  this._connection.on(CHANNEL_TYPE, ":__id", "send", this._key, function (req) {
    var id = req.params.__id;
    delete req.params.__id;
    req.key = req.key.slice(3);

    when(callback(req))
      .then(function (response) {
        self._connection.emit(CHANNEL_TYPE, id, "respond", response);
      });
  });
};

module.exports = Request;