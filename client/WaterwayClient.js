var _ = require("lodash-node");
var ServerConnection = require("./ServerConnection");
var WaterwayStream = require("./WaterwayStream");
var WaterwayEvent = require("./WaterwayEvent");
var WaterwayRequest = require("./WaterwayRequest");

class WaterwayClient {

  constructor(config) {
    this.config = _.extend(WaterwayClient.DEFAULTS, config);
    this.connection = new ServerConnection(config);
  }

  stream(pattern) {
    return new WaterwayStream(this.connection, pattern);
  }

  event(pattern) {
    return new WaterwayEvent(this.connection, pattern);
  }

  request(pattern) {
    return new WaterwayRequest(this.connection, pattern);
  }
  
}

WaterwayClient.DEFAULTS = {

};

module.exports = WaterwayClient;