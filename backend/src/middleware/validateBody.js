const ApiError = require('../utils/ApiError');

module.exports = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next(
      new ApiError(
        400,
        'VALIDATION_ERROR',
        'Request body validation failed',
        parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
      )
    );
  }
  req.body = parsed.data;
  next();
};
