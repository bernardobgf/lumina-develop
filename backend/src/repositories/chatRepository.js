const Chat = require('../models/Chat');

const chatRepository = {
  findAll: (ownerId) => Chat.find({ ownerId }).sort({ updatedAt: -1 }),
  findById: (id, ownerId) => Chat.findOne({ _id: id, ownerId }),
  create: (data) => Chat.create(data),
  update: (id, ownerId, data) => Chat.findOneAndUpdate({ _id: id, ownerId }, data, { new: true, runValidators: true }),
  delete: (id, ownerId) => Chat.findOneAndDelete({ _id: id, ownerId })
};

module.exports = chatRepository;
