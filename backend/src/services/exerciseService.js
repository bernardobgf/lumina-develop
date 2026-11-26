const repository = require('../repositories/exerciseRepository');
const AppError = require('../utils/AppError');
const exerciseService = {
  list: (filters) => repository.findAll(filters),
  async get(id, ownerId) { const item = await repository.findById(id, ownerId); if (!item) throw new AppError('Exercício não encontrado.', 404); return item; },
  create: (data) => repository.create(data),
  async update(id, data, ownerId) { const item = await repository.update(id, data, ownerId); if (!item) throw new AppError('Exercício não encontrado.', 404); return item; },
  async remove(id, ownerId) { const item = await repository.delete(id, ownerId); if (!item) throw new AppError('Exercício não encontrado.', 404); return item; }
};
module.exports = exerciseService;
