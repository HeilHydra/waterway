var WaterwayChannel = require("./WaterwayChannel");

class WaterwayStream extends WaterwayChannel {

  constructor(connection, pattern) {
    super(connection, pattern);
  }

  readable() {
    
  }

  writeable() {

  }

}

module.exports = WaterwayStream;