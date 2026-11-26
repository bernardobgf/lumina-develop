import { BookOpen, Clock3, Flame, Target, TrendingUp } from "lucide-react";
import Mascot from "../components/Mascot.jsx";
const cards = [
  {
    label: "Conversas iniciadas",
    value: "—",
    note: "Continue explorando",
    icon: BookOpen,
  },
  {
    label: "Tempo de estudo",
    value: "—",
    note: "Seu ritmo importa",
    icon: Clock3,
  },
  {
    label: "Dias de dedicação",
    value: "—",
    note: "Um dia de cada vez",
    icon: Flame,
  },
];
export default function DashboardPage() {
  return (
    <main className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">SUA CAMINHADA</span>
          <h1>Visão geral</h1>
          <p>Pequenos passos também levam longe.</p>
        </div>
        <div className="dashboard-mascot">
          <Mascot large waving />
        </div>
      </div>
      <div className="stats-grid">
        {cards.map(({ label, value, note, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <span className="stat-icon">
              <Icon size={19} />
            </span>
            <small>{label}</small>
            <strong>{value}</strong>
            <span>{note}</span>
          </article>
        ))}
      </div>
      <section className="welcome-card">
        <div>
          <span className="eyebrow">SEU PRÓXIMO CAPÍTULO</span>
          <h2>O importante é continuar, um passo de cada vez.</h2>
          <p>
            Converse com a Lumina, pratique com exercícios e construa uma rotina
            que faça sentido para você.
          </p>
        </div>
        <div className="welcome-decoration">
          <TrendingUp size={42} />
        </div>
      </section>
      <section className="dashboard-note">
        <Target size={20} />
        <div>
          <strong>Seu progresso começa aqui</strong>
          <p>
            Os indicadores serão preenchidos conforme você utilizar a plataforma
            e registrar suas atividades.
          </p>
        </div>
      </section>
    </main>
  );
}
