var Waterway = require("./lib/Waterway");

var waterway1 = new Waterway();
waterway1.event("*", "bar").on(function (data) {
  console.log("RECEIVED");
});

var waterway2 = new Waterway();
waterway2.event("foo", "bar").emit({ yolo: "swaghetti" });