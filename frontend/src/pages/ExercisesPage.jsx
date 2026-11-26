import { useEffect, useState } from "react";
import { BookOpen, CircleHelp } from "lucide-react";
import { exerciseService } from "../services/api.js";
export default function ExercisesPage({ onError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    exerciseService
      .list()
      .then(setItems)
      .catch((error) => onError(error.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">PRÁTICA QUE VIRA CONHECIMENTO</span>
          <h1>Exercícios</h1>
          <p>Aprenda fazendo, no seu tempo.</p>
        </div>
        <span className="page-title-icon">
          <BookOpen size={26} />
        </span>
      </div>
      {loading ? (
        <p className="loading-line">Carregando exercícios...</p>
      ) : items.length ? (
        <div className="exercise-grid">
          {items.map((item) => (
            <article className="exercise-card" key={item._id}>
              <span className="subject-tag">{item.subject}</span>
              <h3>{item.title}</h3>
              <p>{item.statement}</p>
              <span className="difficulty">
                {item.difficulty === "easy"
                  ? "Fácil"
                  : item.difficulty === "hard"
                    ? "Desafiador"
                    : "Intermediário"}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CircleHelp size={30} />
          <h2>Seus exercícios vêm aí!</h2>
          <p>
            Quando houver exercícios cadastrados na API, eles aparecerão aqui.
          </p>
        </div>
      )}
    </main>
  );
}
