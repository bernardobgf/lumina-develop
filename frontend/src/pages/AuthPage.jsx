import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Mascot from "../components/Mascot.jsx";

export default function AuthPage({
  initialMode = "login",
  onSubmit,
  onBack,
  onModeChange,
  error,
  loading,
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const changeMode = (next) => {
    setMode(next);
    onModeChange?.(next);
  };
  const submit = (event) => {
    event.preventDefault();
    onSubmit(
      { ...(mode === "register" ? { name } : {}), email, password },
      mode,
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-aside">
        <button className="auth-back" onClick={onBack}>
          <ArrowLeft size={16} /> Voltar ao início
        </button>
        <a
          className="auth-brand"
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          Lumina
        </a>
        <div className="auth-aside-content">
          <span className="auth-kicker">APRENDER NO SEU RITMO</span>
          <h1>Um espaço tranquilo para suas ideias crescerem.</h1>
          <p>
            Organize seus estudos, tire dúvidas e avance um pouco todos os dias.
          </p>
          <div className="auth-mascot">
            <Mascot large waving />
          </div>
          <div className="auth-aside-note">
            <BookOpen size={17} />
            <span>Seu caminho de aprendizagem começa aqui.</span>
          </div>
        </div>
        <span className="auth-copyright">
          © {new Date().getFullYear()} Lumina
        </span>
      </section>
      <section className="auth-main">
        <div className="auth-form-wrap">
          <span className="auth-mobile-brand">Lumina</span>
          <div className="auth-heading">
            <span className="auth-kicker">
              {mode === "login" ? "BEM-VINDO DE VOLTA" : "CRIE SUA CONTA"}
            </span>
            <h2>
              {mode === "login" ? "Entre na sua conta" : "Comece por aqui"}
            </h2>
            <p>
              {mode === "login"
                ? "Acesse seu espaço de estudos."
                : "É rápido. E seu espaço de estudos fica pronto para você."}
            </p>
          </div>
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Entrar
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => changeMode("register")}
            >
              Cadastrar
            </button>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {mode === "register" && (
              <label>
                Nome completo
                <div className="auth-input">
                  <UserRound size={17} />
                  <input
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Como podemos te chamar?"
                    minLength={2}
                    required
                  />
                </div>
              </label>
            )}
            <label>
              E-mail
              <div className="auth-input">
                <Mail size={17} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  required
                />
              </div>
            </label>
            <label>
              Senha
              <div className="auth-input">
                <LockKeyhole size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? "Aguarde..."
                : mode === "login"
                  ? "Entrar na Lumina"
                  : "Criar minha conta"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="auth-switch">
            {mode === "login"
              ? "Ainda não tem uma conta?"
              : "Já tem uma conta?"}{" "}
            <button
              onClick={() =>
                changeMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
          <p className="auth-terms">
            Ao continuar, você concorda em usar a plataforma de forma
            responsável.
          </p>
        </div>
      </section>
    </main>
  );
}
