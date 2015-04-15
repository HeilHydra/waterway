var when = require("when");
var guid = require("guid");
var ReadableStream = require("./ReadableStream");
var WritableStream = require("./WritableStream");
var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "stream";

function Stream(connection, key) {
  keyUtils.ensureNoWildcards(key);
  this._connection = connection;
  this._key = key;
}

Stream.prototype.readable = function (data) {
  var id = guid.raw();
  var dfrd = when.defer();

  this._connection.on(CHANNEL_TYPE, id, "init", function () {
    var readable = new ReadableStream(this._connection, id, data);
    dfrd.resolve(readable);
  }.bind(this));

  this._connection.on(CHANNEL_TYPE, id, "initerror", function (err) {
    dfrd.reject(err);
  });

  this._connection.emit(CHANNEL_TYPE, id, this._key, "send", this._key, data);

  return dfrd.promise;
};

Stream.prototype.writable = function (callback) {
  var self = this;
  this._connection.on(CHANNEL_TYPE, ":__id", "send", this._key, function (data, params, requestKey) {
    var id = params.__id;
    delete params.__id;
    var writeable = new WritableStream(self._connection, id);
    
    when.try(callback, writeable, data, params, requestKey.slice(3))
      .then(function () {
        self._connection.emit(CHANNEL_TYPE, id, "init", null);
      })
      .catch(function (err) {
        self._connection.emit(CHANNEL_TYPE, id, "initerror", err);
      });
  });
};

module.exports = Stream;