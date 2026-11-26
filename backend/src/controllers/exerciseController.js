const service = require('../services/exerciseService');
const asyncHandler = require('../middlewares/asyncHandler');
const { generateExercise } = require('../services/aiService');
module.exports = {
  list: asyncHandler(async (req, res) => res.json({ data: await service.list({ ownerId: req.user.id, ...(typeof req.query.subject === 'string' ? {subject:req.query.subject} : {}) }) })),
  get: asyncHandler(async (req, res) => res.json({ data: await service.get(req.params.id, req.user.id) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ data: await service.create({ ...req.body, ownerId: req.user.id }) })),
  generate: asyncHandler(async (req, res) => res.status(201).json({ data: await service.create({ ...await generateExercise(req.body), ...req.body, ownerId: req.user.id }) })),
  update: asyncHandler(async (req, res) => res.json({ data: await service.update(req.params.id, req.body, req.user.id) })),
  remove: asyncHandler(async (req, res) => { await service.remove(req.params.id, req.user.id); res.status(204).send(); })
};
