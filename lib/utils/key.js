var _ = require("lodash-node");

function ensureNoWildcards(key) {
  var hasWildcards = _.any(key, function (part) {
    part = String(part);
    return part.indexOf("*") !== -1;
  });
  if (hasWildcards) {
    throw new Error("Wildcards found in " + key);
  }
}

module.exports = {
  ensureNoWildcards: ensureNoWildcards
};