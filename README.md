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

## Atualização: exercícios e perfil

- Exercícios gerados pela Groq por assunto e dificuldade, com quatro alternativas, correção local e explicação. A resposta do modelo é validada antes de persistir. A correção é prática individual, não uma avaliação antifraude; respostas não são persistidas.
- Exercícios pertencem à conta autenticada. Registros antigos sem `ownerId` não aparecem; não atribua registros antigos sem conhecer o proprietário.
- Perfil permite alterar nome e foto (PNG/JPEG/WebP até 250 KB). Foto armazenada no MongoDB como data URL para simplificar o MVP.
- Exclusão de conta exige senha e remove conversas e exercícios associados. Operações de exclusão não são transacionais; para produção, use transação MongoDB e controle de concorrência.
- Ilha animada com olhos e mascote de estrela.

### Executar localmente (PowerShell)

No backend: `Copy-Item .env.example .env`, preencha MONGODB_URI, JWT_SECRET, GROQ_API_KEY e GROQ_MODEL. Execute `npm ci` e `npm run dev`.

Em outro terminal, no frontend: `Copy-Item .env.example .env`, execute `npm ci` e `npm run dev`. Acesse http://localhost:5173.

Swagger: http://localhost:3333/api-docs/. Testes: `npm test -- --runInBand` no backend. Build: `npm run build` no frontend.

### Histórico e validação

Esta versão foi preparada com assistência de IA sobre o projeto fornecido, com commits correspondentes às alterações reais. A instalação offline das dependências não pôde ser concluída no ambiente de preparação; execute os testes e build localmente antes da banca. Não há garantia de funcionamento da API externa sem credenciais e modelo válidos. Não publique arquivos `.env`.
