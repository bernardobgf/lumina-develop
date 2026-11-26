const app = require('./app');
const { connectDatabase } = require('./config/database');
const PORT = process.env.PORT || 3333;

connectDatabase()
  .then(() => app.listen(PORT, () => console.log(`Lumina API disponível em http://localhost:${PORT}`)))
  .catch((error) => { console.error('Não foi possível conectar ao MongoDB:', error.message); process.exit(1); });
