import { useEffect, useRef, useState } from "react";
import { ArrowDown, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import Mascot from "../components/Mascot.jsx";
import ChatMessage from "../components/ChatMessage.jsx";
import ChatComposer from "../components/ChatComposer.jsx";
import SidebarChats from "../components/SidebarChats.jsx";
import { chatService } from "../services/api.js";

const suggestions = [
  {
    icon: Lightbulb,
    title: "Me explique um assunto",
    text: "Explique a Revolução Francesa de um jeito fácil",
  },
  {
    icon: BookOpen,
    title: "Quero praticar",
    text: "Crie 5 questões de matemática sobre funções",
  },
  {
    icon: Sparkles,
    title: "Organize meus estudos",
    text: "Monte um plano de estudos para esta semana",
  },
];
export default function ChatPage({ onError, onSuccess }) {
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);
  useEffect(() => {
    let alive = true;
    chatService
      .list()
      .then((data) => {
        if (alive) {
          setChats(data);
          if (data[0]) setActiveId(data[0]._id);
        }
      })
      .catch((error) => onError(error.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let alive = true;
    chatService
      .get(activeId)
      .then((chat) => alive && setMessages(chat.messages || []))
      .catch((error) => onError(error.message));
    return () => {
      alive = false;
    };
  }, [activeId]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);
  const createChat = async () => {
    try {
      const chat = await chatService.create();
      setChats((current) => [chat, ...current]);
      setActiveId(chat._id);
      setMessages([]);
      onSuccess("Nova conversa criada.");
    } catch (error) {
      onError(error.message);
    }
  };
  const renameChat = async (id) => {
    const current = chats.find((chat) => chat._id === id);
    const title = window.prompt(
      "Novo título da conversa:",
      current?.title || "",
    );
    if (!title?.trim()) return;
    try {
      const updated = await chatService.rename(id, title.trim());
      setChats((items) =>
        items.map((chat) => (chat._id === id ? updated : chat)),
      );
      onSuccess("Conversa renomeada.");
    } catch (error) {
      onError(error.message);
    }
  };
  const deleteChat = async (id) => {
    try {
      await chatService.remove(id);
      const remaining = chats.filter((chat) => chat._id !== id);
      setChats(remaining);
      if (activeId === id) setActiveId(remaining[0]?._id || null);
      onSuccess("Conversa excluída.");
    } catch (error) {
      onError(error.message);
    }
  };
  const sendMessage = async (content) => {
    let chatId = activeId;
    try {
      if (!chatId) {
        const chat = await chatService.create(content.slice(0, 42));
        chatId = chat._id;
        setChats((current) => [chat, ...current]);
        setActiveId(chatId);
      }
      setSending(true);
      const withAnswer = await chatService.ask(chatId, content);
      setMessages(withAnswer.messages);
      setChats((current) =>
        current.map((chat) => (chat._id === chatId ? withAnswer : chat)),
      );
    } catch (error) {
      if (chatId) {
        try {
          const saved = await chatService.get(chatId);
          setMessages(saved.messages || []);
        } catch {
          /* mantém a mensagem de erro original */
        }
      }
      onError(error.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="chat-layout">
      <SidebarChats
        chats={chats}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={createChat}
        onDelete={deleteChat}
        onRename={renameChat}
      />
      <main className="chat-main">
        <div className="chat-heading">
          <div>
            <span className="eyebrow">UM PASSO DE CADA VEZ</span>
            <h1>
              {activeId
                ? chats.find((chat) => chat._id === activeId)?.title ||
                  "Sua conversa"
                : "Vamos aprender juntos?"}
            </h1>
            <p>Seu espaço para perguntar, descobrir e evoluir.</p>
          </div>
          <div className="chat-status">
            <span className="online-dot" /> Lumina{" "}
            {loading ? "conectando" : "conectada"}
          </div>
        </div>
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="empty-mascot">
                <Mascot large waving />
              </div>
              <h2>
                O que vamos <em>descobrir</em> hoje?
              </h2>
              <p>
                Não existe pergunta boba por aqui. Pode perguntar do seu jeito!
              </p>
              <div className="suggestion-grid">
                {suggestions.map(({ icon: Icon, title, text }) => (
                  <button
                    key={title}
                    className="suggestion-card"
                    onClick={() => sendMessage(text)}
                  >
                    <span>
                      <Icon size={17} />
                    </span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-stack">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message._id || `${message.role}-${index}`}
                  message={message}
                />
              ))}
              {sending && (
                <div className="typing">
                  <Mascot />
                  <span>
                    A Lumina está pensando
                    <span className="typing-dots">...</span>
                  </span>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
        <div className="composer-wrap">
          <ChatComposer onSend={sendMessage} disabled={sending} />
          <p className="disclaimer">
            A Lumina pode cometer erros. Confira informações importantes.
          </p>
        </div>
      </main>
    </div>
  );
}
