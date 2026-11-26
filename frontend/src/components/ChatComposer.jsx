import { useState } from "react";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
export default function ChatComposer({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };
  return (
    <form className="composer" onSubmit={submit}>
      <div className="composer-tools">
        <button
          type="button"
          className="icon-quiet"
          aria-label="Anexar arquivo"
          title="Anexos em breve"
        ></button>
      </div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submit(event);
          }
        }}
        placeholder="Pergunte qualquer coisa para a Lumina..."
        rows={2}
        disabled={disabled}
      />
      <div className="composer-bottom">
        <span>Enter para enviar · Shift + Enter para pular linha</span>
        <button
          type="submit"
          className="send-button"
          disabled={!value.trim() || disabled}
          aria-label="Enviar mensagem"
        >
          <ArrowUp size={19} />
        </button>
      </div>
    </form>
  );
}
