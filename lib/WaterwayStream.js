var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "stream";

function WaterwayEvent(connection, key) {
  this.connection = connection;
  this.key = key;
}

WaterwayEvent.prototype.readable = function () {
};

WaterwayEvent.prototype.writeable = function () {
};

module.exports = WaterwayEvent;