const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true, trim: true, maxlength: 12000 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const chatSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  ownerId: { type: String, default: 'demo-user', index: true },
  messages: { type: [messageSchema], default: [] },
  pinned: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
