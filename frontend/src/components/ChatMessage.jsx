import ReactMarkdown from "react-markdown";
import Mascot from "./Mascot.jsx";
export default function ChatMessage({ message }) {
  const assistant = message.role === "assistant";
  return (
    <article
      className={`message-row ${assistant ? "message-row--assistant" : "message-row--user"}`}
    >
      {assistant && (
        <div className="message-avatar">
          <Mascot />
        </div>
      )}
      <div className="message-content">
        <span className="message-author">{assistant ? "Lumina" : "Você"}</span>
        <div
          className={`message-bubble ${assistant ? "message-bubble--assistant" : "message-bubble--user"}`}
        >
          {assistant ? (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
      {!assistant && <div className="user-avatar">B</div>}
    </article>
  );
}
