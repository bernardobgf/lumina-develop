const AppError = require("../src/utils/AppError");
const errorHandler = require("../src/middlewares/errorHandler");
const requireAuth = require("../src/middlewares/requireAuth");
const validate = require("../src/validators/validate");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

jest.mock("groq-sdk", () => jest.fn());
const Groq = require("groq-sdk");
const { generateAnswer } = require("../src/services/aiService");

describe("Tratamento de erros e validação", () => {
  const respond = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  });
  test.each([
    [{ name: "ValidationError", message: "Campo obrigatório" }, 400],
    [{ code: 11000 }, 409],
    [{ name: "CastError" }, 400],
    [new AppError("Não encontrado", 404), 404],
    [new Error("detalhe privado"), 500],
  ])("converte erros em respostas HTTP seguras", (error, expected) => {
    const res = respond();
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    errorHandler(error, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(expected);
    expect(res.json).toHaveBeenCalled();
    if (expected === 500)
      expect(res.json.mock.calls[0][0].error).not.toContain("detalhe privado");
    spy.mockRestore();
  });
  test("AppError usa status padrão quando omitido", () => {
    expect(new AppError("falha").statusCode).toBe(500);
  });
  test("valida e normaliza entrada, rejeitando payload inválido", () => {
    const schema = z.object({ title: z.string().trim().min(2) });
    const next = jest.fn();
    const req = { body: { title: "  OK  " } };
    validate(schema)(req, {}, next);
    expect(req.body.title).toBe("OK");
    expect(next).toHaveBeenCalledWith();
    const nextInvalid = jest.fn();
    validate(schema)({ body: { title: "" } }, {}, nextInvalid);
    expect(nextInvalid.mock.calls[0][0]).toBeInstanceOf(AppError);
  });
  test("valida fonte alternativa", () => {
    const next = jest.fn();
    const req = { query: { page: "1" } };
    validate(z.object({ page: z.string() }), "query")(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
});

describe("Autenticação JWT", () => {
  const secret = "test-secret-that-is-long-enough-for-tests";
  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });
  test("rejeita ausência e formato incorreto", () => {
    for (const authorization of [undefined, "Basic abc", "Bearer"]) {
      const next = jest.fn();
      requireAuth({ headers: { authorization } }, {}, next);
      expect(next.mock.calls[0][0].statusCode).toBe(401);
    }
  });
  test("aceita token válido e adiciona usuário", () => {
    const token = jwt.sign({ email: "teste@lumina.dev" }, secret, {
      subject: "user-1",
    });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    requireAuth(req, {}, next);
    expect(req.user).toEqual({ id: "user-1", email: "teste@lumina.dev" });
    expect(next).toHaveBeenCalledWith();
  });
  test("rejeita token inválido", () => {
    const next = jest.fn();
    requireAuth(
      { headers: { authorization: "Bearer token-invalido" } },
      {},
      next,
    );
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });
});

describe("Serviço Groq sem acesso à rede", () => {
  const create = jest.fn();
  beforeAll(() => {
    process.env.GROQ_API_KEY = "chave-falsa-exclusiva-para-teste";
    Groq.mockImplementation(() => ({ chat: { completions: { create } } }));
  });
  afterEach(() => {
    create.mockReset();
    jest.restoreAllMocks();
  });
  test("rejeita ausência de chave", async () => {
    const key = process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY;
    await expect(generateAnswer([])).rejects.toMatchObject({ statusCode: 503 });
    process.env.GROQ_API_KEY = key;
  });
  test("retorna resposta e envia histórico limitado", async () => {
    create.mockResolvedValue({
      choices: [{ message: { content: "  Resposta correta  " } }],
    });
    const messages = Array.from({ length: 24 }, (_, i) => ({
      role: i % 2 ? "assistant" : "user",
      content: `msg ${i}`,
    }));
    await expect(generateAnswer(messages)).resolves.toBe("Resposta correta");
    expect(create.mock.calls[0][0].messages).toHaveLength(21);
    expect(create.mock.calls[0][0].messages[1]).toEqual({
      role: "user",
      content: "msg 4",
    });
  });
  test("usa modelo configurado", async () => {
    process.env.GROQ_MODEL = "modelo-de-teste";
    create.mockResolvedValue({ choices: [{ message: { content: "ok" } }] });
    await generateAnswer([]);
    expect(create.mock.calls[0][0].model).toBe("modelo-de-teste");
    delete process.env.GROQ_MODEL;
  });
  test("trata resposta vazia", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    create.mockResolvedValue({ choices: [] });
    await expect(generateAnswer([])).rejects.toMatchObject({ statusCode: 502 });
  });
  test("trata falha do provedor sem expor mensagem técnica", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    create.mockRejectedValue(
      Object.assign(new Error("segredo do provedor"), { status: 429 }),
    );
    await expect(generateAnswer([])).rejects.toMatchObject({ statusCode: 502 });
  });
});
