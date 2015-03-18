var _ = require("lodash-node");

function ensureNoWildcards(key) {
  var hasWildcards = _.any(key, function (part) {
    return part.indexOf("*") !== -1;
  });
}

module.exports = {
  ensureNoWildcards: ensureNoWildcards
};