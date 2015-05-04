var EventEmitter = require("events").EventEmitter;
var inherits = require("util").inherits;

var INTERVAL = 250;
var TIMEOUT = 750;

function Heartbeat() {
  this._timeoutId = null;
  this._intervalId = null;
}

inherits(Heartbeat, EventEmitter);

Heartbeat.prototype.start = function () {
  this._intervalId = setInterval(this._beat.bind(this), INTERVAL);
  this.received();
  this._beat();
};

Heartbeat.prototype.stop = function () {
  clearTimeout(this._intervalId);
  clearInterval(this._intervalId);
};

Heartbeat.prototype.received = function () {
  clearTimeout(this._timeoutId);
  this._timeoutId = setTimeout(this._handleTimeout.bind(this), TIMEOUT);
};

Heartbeat.prototype._beat = function () {
  this.emit("beat");
};

Heartbeat.prototype._handleTimeout = function () {
  this.emit("timeout");
  this.stop();
};

module.exports = Heartbeat;