const clientele = require('./clientele');

const core = clientele(require('./specs/core-api'));
const accounts = clientele(require('./specs/accounts-api'));

module.exports = {
  default: core,
  core,
  accounts,
};
