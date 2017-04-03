const wrapper = require('./wrapper');

const core = wrapper(require('./specs/core-api'));
const accounts = wrapper(require('./specs/accounts-api'));

module.exports = {
  default: core,
  core,
  accounts,
};
