import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Leaf,
  MessageSquareText,
  Target,
} from "lucide-react";
import Mascot from "../components/Mascot.jsx";

const features = [
  {
    icon: MessageSquareText,
    title: "Tire suas dúvidas",
    text: "Converse com a Lumina e receba explicações claras, com exemplos e passo a passo.",
  },
  {
    icon: BookOpen,
    title: "Pratique de verdade",
    text: "Resolva exercícios para fixar o conteúdo e entender onde precisa melhorar.",
  },
  {
    icon: Target,
    title: "Acompanhe seu ritmo",
    text: "Tenha suas conversas e atividades organizadas em um só lugar.",
  },
];

export default function LandingPage({ onStart }) {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="#inicio">
          <span>Lumina</span>
        </a>
        <nav className="landing-nav-links">
          <a href="#recursos">Recursos</a>
          <a href="#sobre">Sobre a plataforma</a>
        </nav>
        <div className="landing-nav-actions">
          <button className="landing-login" onClick={() => onStart("login")}>
            Entrar
          </button>
          <button
            className="landing-nav-cta"
            onClick={() => onStart("register")}
          >
            Criar conta <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <section className="landing-hero" id="inicio">
        <div className="hero-copy">
          <div className="">
            <span /> UMA FORMA MAIS SIMPLES DE ESTUDAR
          </div>
          <h1>
            Seu próximo passo
            <br />
            começa com <span>uma dúvida.</span>
          </h1>
          <p className="hero-description">
            A Lumina reúne conversa com inteligência artificial, exercícios e
            acompanhamento para ajudar você a estudar com mais autonomia.
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => onStart("register")}>
              Criar minha conta <ArrowRight size={18} />
            </button>
            <button className="secondary-cta" onClick={() => onStart("login")}>
              Já tenho uma conta
            </button>
          </div>
          <div className="hero-proof">
            <CheckCircle2 size={17} />
            <p>Um ambiente de estudos organizado, acessível e no seu ritmo.</p>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-art-panel">
            <div className="hero-art-top">
              <span className="hero-art-dot" />
              <span>lumina / espaço de estudos</span>
              <span className="hero-art-menu">•••</span>
            </div>
            <div className="hero-art-content">
              <div className="hero-art-greeting">
                <span className="hero-art-small">ASSISTENTE DE ESTUDOS</span>
                <h3>Oi! Em que posso ajudar?</h3>
                <p>Estou aqui para estudar com você.</p>
              </div>
              <Mascot large waving />
              <div className="hero-art-prompt">
                <span>Explique a diferença entre mitose e meiose...</span>
                <span className="hero-art-send">
                  <ArrowRight size={15} />
                </span>
              </div>
              <div className="hero-art-tags">
                <span>Biologia</span>
                <span>Explicação passo a passo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-intro" id="sobre">
        <span className="section-eyebrow">SOBRE A LUMINA</span>
        <h2>
          Estudar fica mais fácil
          <br />
          quando você tem <span>por onde começar.</span>
        </h2>
        <p>
          Uma plataforma de apoio para quem quer aprender, revisar conteúdos e
          se preparar melhor — sem complicar o processo.
        </p>
      </section>

      <section className="feature-section" id="recursos">
        <div className="feature-section-heading">
          <span className="section-eyebrow">O QUE VOCÊ ENCONTRA</span>
          <h2>Ferramentas para seguir em frente.</h2>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="feature-card" key={title}>
              <div className={`feature-icon feature-icon-${index}`}>
                <Icon size={21} />
              </div>
              <span className="feature-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <button onClick={() => onStart("register")}>
                Conhecer <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-callout">
        <div className="callout-decoration">
          <div className="callout-circle circle-one" />
          <div className="callout-circle circle-two" />
          <Mascot large waving />
        </div>
        <div className="callout-copy">
          <span className="section-eyebrow">COMECE QUANDO QUISER</span>
          <h2>
            Seu aprendizado.
            <br />
            Seu tempo. Seu caminho.
          </h2>
          <p>
            Crie sua conta e tenha um lugar para organizar dúvidas, praticar e
            acompanhar sua evolução.
          </p>
          <button className="callout-cta" onClick={() => onStart("register")}>
            Começar agora <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="#inicio">
          <span>Lumina</span>
        </a>
        <span>Aprender com mais autonomia.</span>
        <span className="footer-caption">
          © {new Date().getFullYear()} Lumina
        </span>
      </footer>
    </main>
  );
}
