const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function requireAuth(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return next(new AppError('Faça login para continuar.', 401));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(new AppError('Sua sessão expirou. Entre novamente.', 401));
  }
}

module.exports = requireAuth;
