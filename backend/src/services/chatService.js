const repository = require('../repositories/chatRepository');
const AppError = require('../utils/AppError');

const chatService = {
  list: (ownerId) => repository.findAll(ownerId),
  async get(id, ownerId) {
    const chat = await repository.findById(id, ownerId);
    if (!chat) throw new AppError('Conversa não encontrada.', 404);
    return chat;
  },
  create: (data, ownerId) => repository.create({ ...data, ownerId }),
  async update(id, ownerId, data) {
    const chat = await repository.update(id, ownerId, data);
    if (!chat) throw new AppError('Conversa não encontrada.', 404);
    return chat;
  },
  async remove(id, ownerId) {
    const chat = await repository.delete(id, ownerId);
    if (!chat) throw new AppError('Conversa não encontrada.', 404);
    return chat;
  },
  async addMessage(id, ownerId, message) {
    const chat = await repository.findById(id, ownerId);
    if (!chat) throw new AppError('Conversa não encontrada.', 404);
    chat.messages.push(message);
    await chat.save();
    return chat;
  }
};
module.exports = chatService;
