const service = require('../services/chatService');
const asyncHandler = require('../middlewares/asyncHandler');
const { generateAnswer } = require('../services/aiService');
const owner = (req) => req.user.id;
const chatController = {
  list: asyncHandler(async (req, res) => res.json({ data: await service.list(owner(req)) })),
  get: asyncHandler(async (req, res) => res.json({ data: await service.get(req.params.id, owner(req)) })),
  create: asyncHandler(async (req, res) => res.status(201).json({ data: await service.create({ title: req.body.title || 'Nova conversa' }, owner(req)) })),
  update: asyncHandler(async (req, res) => res.json({ data: await service.update(req.params.id, owner(req), req.body) })),
  remove: asyncHandler(async (req, res) => { await service.remove(req.params.id, owner(req)); res.status(204).send(); }),
  addMessage: asyncHandler(async (req, res) => res.status(201).json({ data: await service.addMessage(req.params.id, owner(req), req.body) })),
  ask: asyncHandler(async (req, res) => {
    const chat = await service.addMessage(req.params.id, owner(req), { role: 'user', content: req.body.content });
    const answer = await generateAnswer(chat.messages);
    const updated = await service.addMessage(req.params.id, owner(req), { role: 'assistant', content: answer });
    res.status(200).json({ data: updated });
  })
};
module.exports = chatController;
