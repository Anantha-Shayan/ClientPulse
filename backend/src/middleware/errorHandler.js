const { error } = require('../utils/ApiResponse');
const logger = require('./requestLogger');

module.exports = (err, _req, res, _next) => {
  logger.error(err.stack || err.message);
  return error(res, err);
};
