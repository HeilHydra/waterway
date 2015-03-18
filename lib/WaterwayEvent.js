var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "event";

function WaterwayEvent(connection, key) {
  this._connection = connection;
  this._key = key;
}

WaterwayEvent.prototype.emit = function (data) {
  keyUtils.ensureNoWildcards(this._key);
  this._connection.emit(CHANNEL_TYPE, this._key, data);
};

WaterwayEvent.prototype.on = function (callback) {
  this._connection.on(CHANNEL_TYPE, this._key, callback);
};

WaterwayEvent.prototype.off = function (callback) {
  this._connection.off(CHANNEL_TYPE, this._key, callback);
};

module.exports = WaterwayEvent;