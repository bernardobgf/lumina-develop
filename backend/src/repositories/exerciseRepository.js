const Exercise = require('../models/Exercise');

const exerciseRepository = {
  findAll: (filters = {}) => Exercise.find(filters).sort({ createdAt: -1 }),
  findById: (id) => Exercise.findById(id),
  create: (data) => Exercise.create(data),
  update: (id, data) => Exercise.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  delete: (id) => Exercise.findByIdAndDelete(id)
};

module.exports = exerciseRepository;
