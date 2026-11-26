const Groq = require("groq-sdk");
const AppError = require("../utils/AppError");

let client;
function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new AppError(
      "A integração com IA ainda não foi configurada. Defina GROQ_API_KEY no backend.",
      503,
    );
  }
  if (!client)
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 25000,
      maxRetries: 1,
    });
  return client;
}

async function generateAnswer(messages) {
  const groq = getClient();
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const conversation = messages.slice(-20).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  }));
  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 1400,
      messages: [
        {
          role: "system",
          content:
            "Você é a Lumina, uma tutora educacional acolhedora, clara e paciente. Responda em português brasileiro. Explique conceitos passo a passo, use exemplos adequados ao nível do estudante, incentive o pensamento crítico e nunca faça o exercício inteiro sem explicar o raciocínio. Organize respostas longas com títulos e listas em Markdown.",
        },
        ...conversation,
      ],
    });
    const answer = completion.choices?.[0]?.message?.content?.trim();
    if (!answer)
      throw new AppError(
        "A IA retornou uma resposta vazia. Tente novamente.",
        502,
      );
    return answer;
  } catch (error) {
    console.error("ERRO ORIGINAL DA GROQ:", {
      name: error.name,
      status: error.status,
      message: error.message,
      code: error.code,
      error: error.error,
    });

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      `Erro na Groq (${error.status || "sem status"}): ${error.message}`,
      502,
    );
  }
}

module.exports = { generateAnswer };
