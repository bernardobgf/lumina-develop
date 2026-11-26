const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-tests";

const app = require("../src/app");

jest.setTimeout(60000);

let mongo;
let token;

const register = async (overrides = {}) =>
  request(app)
    .post("/api/v1/auth/register")
    .send({
      name: "Pessoa Teste",
      email: "teste@lumina.dev",
      password: "senha-segura-123",
      ...overrides,
    });

const auth = () => ({
  Authorization: `Bearer ${token}`,
});

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongo) {
    await mongo.stop();
  }
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

beforeEach(async () => {
  const response = await register();

  if (response.status !== 201 || !response.body.data?.token) {
    throw new Error(
      `Falha ao cadastrar usuário de teste: ${response.status} ${JSON.stringify(response.body)}`,
    );
  }

  token = response.body.data.token;
});

describe("API Lumina", () => {
  test("health check retorna status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("bloqueia conversas sem autenticação", async () => {
    await request(app).get("/api/v1/chats").expect(401);
  });

  test("cadastra usuário, armazena senha com hash e impede e-mail duplicado", async () => {
    const User = require("../src/models/User");

    const user = await User.findOne({
      email: "teste@lumina.dev",
    }).select("+password");

    expect(user).toBeTruthy();
    expect(user.password).not.toBe("senha-segura-123");

    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Teste",
        email: "teste@lumina.dev",
        password: "senha-segura-123",
      })
      .expect(409);
  });

  test("faz login com credenciais válidas", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "teste@lumina.dev",
        password: "senha-segura-123",
      })
      .expect(200);

    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe("teste@lumina.dev");
  });

  test("rejeita login com senha incorreta", async () => {
    await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "teste@lumina.dev",
        password: "senha-errada",
      })
      .expect(401);
  });

  test("executa CRUD de conversas e adiciona mensagem", async () => {
    const created = await request(app)
      .post("/api/v1/chats")
      .set(auth())
      .send({ title: "Matemática" })
      .expect(201);

    const id = created.body.data._id;

    await request(app).get(`/api/v1/chats/${id}`).set(auth()).expect(200);

    await request(app)
      .post(`/api/v1/chats/${id}/messages`)
      .set(auth())
      .send({
        role: "user",
        content: "Explique função.",
      })
      .expect(201);

    await request(app)
      .put(`/api/v1/chats/${id}`)
      .set(auth())
      .send({ title: "Funções" })
      .expect(200);

    await request(app).get("/api/v1/chats").set(auth()).expect(200);

    await request(app).delete(`/api/v1/chats/${id}`).set(auth()).expect(204);

    await request(app).get(`/api/v1/chats/${id}`).set(auth()).expect(404);
  });

  test("isola conversas entre usuários", async () => {
    const created = await request(app)
      .post("/api/v1/chats")
      .set(auth())
      .send({ title: "Privada" })
      .expect(201);

    const other = await register({
      email: "outra@lumina.dev",
    });

    expect(other.status).toBe(201);

    await request(app)
      .get(`/api/v1/chats/${created.body.data._id}`)
      .set("Authorization", `Bearer ${other.body.data.token}`)
      .expect(404);
  });

  test("valida payload de mensagem", async () => {
    const created = await request(app)
      .post("/api/v1/chats")
      .set(auth())
      .send({})
      .expect(201);

    await request(app)
      .post(`/api/v1/chats/${created.body.data._id}/messages`)
      .set(auth())
      .send({
        role: "hacker",
        content: "",
      })
      .expect(400);
  });

  test("executa CRUD de exercícios", async () => {
    const payload = {
      title: "Equação do 2º grau",
      subject: "Matemática",
      statement: "Resolva x² - 5x + 6 = 0",
      answer: "x = 2 ou x = 3",
    };

    const created = await request(app)
      .post("/api/v1/exercises")
      .set(auth())
      .send(payload)
      .expect(201);

    const id = created.body.data._id;

    await request(app).get("/api/v1/exercises").set(auth()).expect(200);

    await request(app)
      .get("/api/v1/exercises?subject=Matemática")
      .set(auth())
      .expect(200);

    await request(app).get(`/api/v1/exercises/${id}`).set(auth()).expect(200);

    await request(app)
      .put(`/api/v1/exercises/${id}`)
      .set(auth())
      .send({ title: "Equação revisada" })
      .expect(200);

    await request(app)
      .delete(`/api/v1/exercises/${id}`)
      .set(auth())
      .expect(204);
  });

  test("trata identificador inválido e registro inexistente", async () => {
    await request(app).get("/api/v1/chats/id-invalido").set(auth()).expect(400);

    await request(app)
      .get("/api/v1/exercises/507f1f77bcf86cd799439011")
      .set(auth())
      .expect(404);
  });

  test("rejeita payloads inválidos e token adulterado", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "A",
        email: "invalido",
        password: "123",
      })
      .expect(400);

    await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "invalido",
        password: "123",
      })
      .expect(400);

    await request(app)
      .get("/api/v1/chats")
      .set("Authorization", "Bearer invalido")
      .expect(401);

    await request(app)
      .post("/api/v1/chats")
      .set(auth())
      .send({ title: "" })
      .expect(400);
  });

  test("trata atualizações e exclusões de registros inexistentes", async () => {
    const missing = "507f1f77bcf86cd799439011";

    await request(app)
      .put(`/api/v1/chats/${missing}`)
      .set(auth())
      .send({ title: "Teste" })
      .expect(404);

    await request(app)
      .delete(`/api/v1/chats/${missing}`)
      .set(auth())
      .expect(404);

    await request(app)
      .post(`/api/v1/chats/${missing}/messages`)
      .set(auth())
      .send({
        role: "user",
        content: "Oi",
      })
      .expect(404);

    await request(app)
      .put(`/api/v1/exercises/${missing}`)
      .set(auth())
      .send({ title: "Teste" })
      .expect(404);

    await request(app)
      .delete(`/api/v1/exercises/${missing}`)
      .set(auth())
      .expect(404);

    await request(app)
      .post("/api/v1/exercises")
      .set(auth())
      .send({ title: "Sem campos" })
      .expect(400);
  });

  test("confirma persistência de atualização e remoção de exercícios", async () => {
    const Exercise = require("../src/models/Exercise");

    const created = await request(app)
      .post("/api/v1/exercises")
      .set(auth())
      .send({
        title: "Original",
        subject: "Física",
        statement: "Questão",
        answer: "Resposta",
      })
      .expect(201);

    const id = created.body.data._id;

    await request(app)
      .put(`/api/v1/exercises/${id}`)
      .set(auth())
      .send({ title: "Atualizado" })
      .expect(200);

    const updated = await Exercise.findById(id);

    expect(updated.title).toBe("Atualizado");

    await request(app)
      .delete(`/api/v1/exercises/${id}`)
      .set(auth())
      .expect(204);

    expect(await Exercise.findById(id)).toBeNull();
  });

  test("documentação Swagger está disponível", async () => {
    await request(app).get("/api-docs/").expect(200);
  });

  test("retorna 404 para rota inexistente", async () => {
    await request(app).get("/rota-que-nao-existe").expect(404);
  });
});
