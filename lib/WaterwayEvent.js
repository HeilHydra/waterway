var CHANNEL_TYPE = "event";

function WaterwayEvent(connection, key) {
  this.connection = connection;
  this.key = key;
}

WaterwayEvent.prototype.emit = function (data) {
  keyUtils.ensureNoWildcards(this.key);
  this.connection.emit(CHANNEL_TYPE, this.key, data);
};

WaterwayEvent.prototype.on = function (callback) {
  this.connection.on(CHANNEL_TYPE, this.key, callback);
};

WaterwayEvent.prototype.off = function (callback) {
  this.connection.off(CHANNEL_TYPE, this.key, callback);
};

module.exports = WaterwayEvent;