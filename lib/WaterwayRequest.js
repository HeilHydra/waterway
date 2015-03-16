var keyUtils = require("./utils/key");

var CHANNEL_TYPE = "request";

function WaterwayRequest(connection, key) {
  this.connection = connection;
  this.key = key;
}

WaterwayRequest.prototype.send = function () {
};

WaterwayRequest.prototype.receive = function () {
};

module.exports = WaterwayRequest;