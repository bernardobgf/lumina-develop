const Exercise = require('../models/Exercise');
module.exports = {
  findAll: (filters) => Exercise.find(filters).sort({ createdAt: -1 }),
  findById: (id, ownerId) => Exercise.findOne({ _id: id, ownerId }),
  create: (data) => Exercise.create(data),
  update: (id, data, ownerId) => Exercise.findOneAndUpdate({ _id: id, ownerId }, data, { new: true, runValidators: true }),
  delete: (id, ownerId) => Exercise.findOneAndDelete({ _id: id, ownerId })
};
