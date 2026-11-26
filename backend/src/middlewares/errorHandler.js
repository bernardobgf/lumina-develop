function errorHandler(error, _req, res, _next) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Dados inválidos.', details: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Identificador inválido.' });
  }
  const statusCode = error.statusCode || 500;
  const message = statusCode >= 500 ? 'Erro interno do servidor.' : error.message;
  if (statusCode >= 500) console.error(error);
  return res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
