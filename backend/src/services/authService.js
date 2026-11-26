const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

const authService = {
  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) throw new AppError('Este e-mail já está cadastrado.', 409);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    return this.createSession(user);
  },
  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) throw new AppError('E-mail ou senha incorretos.', 401);
    return this.createSession(user);
  },
  createSession(user) {
    if (!process.env.JWT_SECRET) throw new AppError('JWT_SECRET não configurado no servidor.', 500);
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      subject: String(user._id), expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    return { token, user: publicUser(user) };
  }
};

module.exports = authService;
