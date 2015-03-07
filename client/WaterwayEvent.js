var WaterwayChannel = require("./WaterwayChannel");

var CHANNEL_TYPE = "event";

class WaterwayEvent extends WaterwayChannel {

  constructor(connection, pattern) {
    super(connection, pattern);
  }

  send(data) {
    this.connection.send(CHANNEL_TYPE, this.pattern, data);
  }

  receive(callback) {
    this.connection.subscribe(CHANNEL_TYPE, this.pattern, callback);
  }
  
}

module.exports = WaterwayEvent;