var WaterwayChannel = require("./WaterwayChannel");

class WaterwayRequest extends WaterwayChannel {

  constructor(connection, pattern) {
    super(connection, pattern);
  }

  send() {

  }

  receive() {

  }
  
}

module.exports = WaterwayRequest;