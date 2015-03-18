var Waterway = require("./lib/Waterway");


var waterway1 = new Waterway();
waterway1.stream("bar")
  .on("data", function (data) {
    console.log("RECEIVED", data);
  });

var waterway2 = new Waterway();
waterway2.stream("bar")
  .write({ sup: "hello" });