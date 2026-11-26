const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  subject: { type: String, required: true, trim: true },
  statement: { type: String, required: true, trim: true },
  options: [{ type: String, trim: true }],
  answer: { type: String, required: true, trim: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.models.Exercise || mongoose.model('Exercise', exerciseSchema);
