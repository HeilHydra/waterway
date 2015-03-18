/*jshint nonew: false */

var expect = require("chai").expect;
var sinon = require("sinon");
var WaterwayStream = require("../lib/WaterwayStream");

describe("WaterwayStream", function () {
  var stream, sandbox, connection;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    connection = {
      emit: sandbox.spy(),
      on: sandbox.spy()
    };
    stream = new WaterwayStream(connection, ["foo", "bar"]);
  });
  afterEach(function () {
    sandbox.reset();
  });

  it("should throw an error if key has wildcards", function () {
    var fn = function () {
      new WaterwayStream(null, ["test", "*"]);
    };
    expect(fn).to.throw(/Wildcards found in/);
  });

  it("should register a callback listener for incoming data", function () {
    expect(connection.on).to.have.been.calledWithExactly("stream", ["foo", "bar"], sinon.match.func);
  });

  describe("#_write()", function () {
    it("should emit with correct key and data", function () {
      stream._write("test");
      expect(connection.emit).to.have.been.calledWithExactly("stream", ["foo", "bar"], "test");
    });
  });

  describe("#_read()", function () {
    it("should set stream to be readable", function () {
      stream._read();
      expect(stream._reading).to.be.true;
    });

    it("should flush the readBuffer", function () {
      var buffer = ["baz", "boop"];
      stream._readBuffer = buffer;
      sinon.stub(stream, "_handleIncomingData");
      stream._read();
      expect(stream._handleIncomingData).to.have.been.calledWith("baz");
      expect(stream._handleIncomingData).to.have.been.calledWith("boop");
    });
  });

  describe("#_handleIncomingData()", function () {
    it("should push data if stream is readable", function () {
      sinon.stub(stream, "push", function () {
        return true;
      });
      stream._reading = true;
      stream._handleIncomingData("baz");
      expect(stream.push).to.have.been.calledWithExactly("baz");
    });

    it("should set stream to be not readable if push returns false", function () {
      sinon.stub(stream, "push", function () {
        return false;
      });
      stream._reading = true;
      stream._handleIncomingData("baz");
      expect(stream._reading).to.be.false;
    });

    it("should push data into buffer if not readable", function () {
      stream._reading = false;
      stream._handleIncomingData("baz");
      expect(stream._readBuffer[0]).to.equal("baz");
    });
  });

});