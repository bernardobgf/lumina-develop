import { useEffect, useState } from "react";
import { BookOpen, Sparkles, Trash2 } from "lucide-react";
import { exerciseService } from "../services/api.js";
export default function ExercisesPage({ onError }) {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState(""),
    [difficulty, setDifficulty] = useState("medium"),
    [answers, setAnswers] = useState({});
  useEffect(() => {
    exerciseService
      .list()
      .then(setItems)
      .catch((e) => onError(e.message))
      .finally(() => setLoading(false));
  }, []);
  async function generate(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const item = await exerciseService.generate({ subject, difficulty });
      setItems((old) => [item, ...old]);
    } catch (e) {
      onError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id) {
    if (!window.confirm("Excluir este exercício?")) return;
    try {
      await exerciseService.remove(id);
      setItems((old) => old.filter((x) => x._id !== id));
    } catch (e) {
      onError(e.message);
    }
  }
  return (
    <main className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">PRÁTICA QUE VIRA CONHECIMENTO</span>
          <h1>Exercícios</h1>
          <p>Crie questões personalizadas e pratique no seu ritmo.</p>
        </div>
      </div>
      <form className="lumina-form exercise-generator" onSubmit={generate}>
        <label>
          Matéria ou assunto
          <input
            required
            minLength={2}
            maxLength={100}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex.: Funções quadráticas"
          />
        </label>
        <label>
          Dificuldade
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Intermediário</option>
            <option value="hard">Difícil</option>
          </select>
        </label>
        <button className="lumina-primary" disabled={busy}>
          <Sparkles size={17} />
          {busy ? "Gerando exercício..." : "Gerar exercício"}
        </button>
      </form>
      {loading ? (
        <p>Carregando exercícios...</p>
      ) : !items.length ? (
        <div className="empty-state">
          <BookOpen />
          <h2>Comece sua prática</h2>
          <p>Gere seu primeiro exercício acima.</p>
        </div>
      ) : (
        <div className="exercise-grid">
          {items.map((item) => (
            <article className="exercise-card" key={item._id}>
              <div className="exercise-heading">
                <span className="subject-tag">{item.subject}</span>
                <button
                  className="lumina-icon"
                  aria-label="Excluir exercício"
                  onClick={() => remove(item._id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <h3>{item.title}</h3>
              <p>{item.statement}</p>
              <div className="exercise-options">
                {(item.options || []).map((option, i) => (
                  <button
                    key={i}
                    disabled={answers[item._id] !== undefined}
                    onClick={() =>
                      setAnswers((old) => ({ ...old, [item._id]: option }))
                    }
                  >
                    {String.fromCharCode(65 + i)}. {option}
                  </button>
                ))}
                {!item.options?.length && (
                  <button
                    onClick={() =>
                      setAnswers((old) => ({ ...old, [item._id]: item.answer }))
                    }
                  >
                    Ver resposta
                  </button>
                )}
              </div>
              {answers[item._id] !== undefined && (
                <div className="exercise-feedback">
                  <strong>
                    {answers[item._id] === item.answer
                      ? "Resposta correta!"
                      : "Continue praticando!"}
                  </strong>
                  <p>Resposta: {item.answer}</p>
                  <p>{item.explanation}</p>
                  <button
                    onClick={() =>
                      setAnswers((old) => {
                        const next = { ...old };
                        delete next[item._id];
                        return next;
                      })
                    }
                  >
                    Tentar novamente
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
