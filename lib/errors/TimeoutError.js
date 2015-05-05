var inherits = require("util").inherits;

function TimeoutError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

inherits(TimeoutError, Error);

module.exports = TimeoutError;