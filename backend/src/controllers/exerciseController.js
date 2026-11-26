const service = require('../services/exerciseService');
const asyncHandler = require('../middlewares/asyncHandler');
const controller = {
  list: asyncHandler(async (req, res) => res.json({ data: await service.list(req.query.subject ? { subject: req.query.subject } : {}) })),
  get: asyncHandler(async (req, res) => res.json({ data: await service.get(req.params.id) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ data: await service.create(req.body) })),
  update: asyncHandler(async (req, res) => res.json({ data: await service.update(req.params.id, req.body) })),
  remove: asyncHandler(async (req, res) => { await service.remove(req.params.id); res.status(204).send(); })
};
module.exports = controller;
