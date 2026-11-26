# Lumina — plataforma de estudos

Projeto dividido em duas aplicações independentes:

- `frontend/`: React + Vite, interface web responsiva.
- `backend/`: API REST em Node.js, Express e MongoDB.

## Requisitos

- Node.js 20 ou superior
- MongoDB local ou MongoDB Atlas
- Chave de API da Groq para respostas do assistente

## Backend

```bash
cd backend
# Crie o arquivo .env a partir do .env.example e configure as variáveis
npm install
npm run dev
```

API: http://localhost:3333
Documentação Swagger: http://localhost:3333/api-docs
Health check: http://localhost:3333/health

Configure `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_ORIGIN`, `GROQ_API_KEY` e `GROQ_MODEL` no `.env`. A chave Groq fica exclusivamente no backend.

## Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

A landing page oferece as opções **Entrar** e **Criar conta**. O cadastro e o login usam a API; senhas são armazenadas com hash bcrypt e as rotas de conversas exigem token JWT. As conversas são vinculadas ao usuário autenticado.

## Testes e qualidade

No backend:

```bash
npm test -- --coverage
npm run lint
```

Confira o relatório HTML de cobertura em `backend/coverage/lcov-report/index.html`. A meta configurada é 80%; a cobertura só deve ser considerada validada depois da execução local.

## Observações

- MongoDB é usado como banco NoSQL nesta versão para atender ao escopo acadêmico.
- O frontend usa `localStorage` apenas para manter o token JWT e os dados básicos da sessão; os dados de conversas são persistidos pela API.
- O assistente utiliza a API da Groq. Sem `GROQ_API_KEY`, o chat não consegue gerar respostas.
