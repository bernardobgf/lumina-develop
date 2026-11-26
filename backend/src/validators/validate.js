const AppError = require('../utils/AppError');
function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(new AppError(result.error.issues.map((issue) => issue.message).join('; '), 400));
    req[source] = result.data;
    return next();
  };
}
module.exports = validate;
