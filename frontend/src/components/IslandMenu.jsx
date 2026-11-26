import { useEffect, useState } from "react";
import {
  BookOpen,
  ChartNoAxesColumnIncreasing,
  MessageSquare,
  Settings2,
  ChevronDown,
  X,
  LogOut,
  Leaf,
} from "lucide-react";
import Mascot from "./Mascot.jsx";

const items = [
  {
    id: "chat",
    label: "Assistente",
    description: "Tire dúvidas e estude",
    icon: MessageSquare,
  },
  {
    id: "dashboard",
    label: "Meu progresso",
    description: "Acompanhe sua rotina",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    id: "exercises",
    label: "Exercícios",
    description: "Pratique o que aprendeu",
    icon: BookOpen,
  },
  {
    id: "settings",
    label: "Configurações",
    description: "Sua conta e preferências",
    icon: Settings2,
  },
];

export default function IslandMenu({ page, user, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const active = items.find((item) => item.id === page) || items[0];
  const navigate = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      {open && (
        <button
          className="island-backdrop"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      )}
      <header className={`island-wrap ${open ? "island-wrap--open" : ""}`}>
        <div className="island-shell">
          <div className="island-topline">
            <div className="island-brand">
              <span>Lumina</span>
            </div>
            <span className="island-current-label">{active.label}</span>
            <button
              className="island-toggle"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Fechar navegação" : "Abrir navegação"}
            >
              {open ? <X size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
          <div
            className={`island-content ${open ? "island-content--visible" : ""}`}
          >
            <div className="island-expanded">
              <div className="island-user-row">
                <div className="island-user-avatar">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{user?.name || "Estudante"}</strong>
                  <small>{user?.email || "Sua conta Lumina"}</small>
                </div>
                <span className="island-online" title="Conta conectada" />
              </div>
              <div className="island-welcome">
                <div>
                  <span className="island-welcome-kicker">
                    BOM TE VER POR AQUI
                  </span>
                  <h3>Vamos estudar?</h3>
                  <p>Escolha o que você quer fazer agora.</p>
                </div>
                <Mascot large waving />
              </div>
              <nav className="island-links" aria-label="Navegação principal">
                {items.map(({ id, label, description, icon: Icon }) => (
                  <button
                    key={id}
                    className={`island-link ${page === id ? "island-link--active" : ""}`}
                    onClick={() => navigate(id)}
                  >
                    <span className="island-link-icon">
                      <Icon size={18} />
                    </span>
                    <span className="island-link-copy">
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                  </button>
                ))}
              </nav>
              <div className="island-footer">
                <span>Seu espaço de aprendizagem</span>
                <button onClick={onLogout}>
                  <LogOut size={15} /> Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
