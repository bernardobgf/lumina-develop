const asyncHandler = require('../middlewares/asyncHandler');
const authService = require('../services/authService');

module.exports = {
  register: asyncHandler(async (req, res) => res.status(201).json({ data: await authService.register(req.body) })),
  login: asyncHandler(async (req, res) => res.json({ data: await authService.login(req.body) }))
};
