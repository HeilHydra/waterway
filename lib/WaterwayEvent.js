var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "event";

function WaterwayEvent(connection, key) {
  this.connection = connection;
  this.key = key;
}

WaterwayEvent.prototype.emit = function (data) {
  keyUtils.ensureNoWildcards(this.key);
  this.connection.emit(keyUtils.getString(CHANNEL_TYPE, this.key), data);
};

WaterwayEvent.prototype.on = function (callback) {
  this.connection.on(keyUtils.getString(CHANNEL_TYPE, this.key), callback);
};

WaterwayEvent.prototype.off = function () {
  this.connection.off(keyUtils.getStringKey(CHANNEL_TYPE, this.key));
};

module.exports = WaterwayEvent;