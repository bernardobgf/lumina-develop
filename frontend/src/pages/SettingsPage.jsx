import { Bell, Palette, ShieldCheck } from "lucide-react";
export default function SettingsPage({ user }) {
  return (
    <main className="page-content">
      <div className="page-title">
        <div>
          <span className="eyebrow">DO SEU JEITO</span>
          <h1>Preferências</h1>
          <p>Alguns detalhes para deixar a Lumina com a sua cara.</p>
        </div>
        <span className="page-title-icon">
          <Palette size={26} />
        </span>
      </div>
      <div className="settings-list">
        <article>
          <span>
            <Palette size={19} />
          </span>
          <div>
            <strong>Aparência</strong>
            <p>Interface clara e acolhedora.</p>
          </div>
          <span className="setting-value">Claro</span>
        </article>
        <article>
          <span>
            <Bell size={19} />
          </span>
          <div>
            <strong>Notificações</strong>
            <p>Preferências de lembretes de estudo.</p>
          </div>
          <span className="setting-value">Em breve</span>
        </article>
        <article>
          <span>
            <ShieldCheck size={19} />
          </span>
          <div>
            <strong>Conta</strong>
            <p>
              {user?.name || "Estudante"} · {user?.email || "Conta conectada"}
            </p>
          </div>
          <span className="setting-value">Ativa</span>
        </article>
      </div>
    </main>
  );
}
