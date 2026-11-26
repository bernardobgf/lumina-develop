import { MessageSquarePlus, Search, Trash2, Pencil } from "lucide-react";
export default function SidebarChats({
  chats,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
}) {
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-heading">
        <span>SUAS CONVERSAS</span>
        <button onClick={onCreate} aria-label="Nova conversa">
          <MessageSquarePlus size={17} />
        </button>
      </div>
      <div className="sidebar-search">
        <Search size={15} />
        <span>Buscar conversas</span>
      </div>
      <div className="chat-list">
        {chats.length ? (
          chats.map((chat) => (
            <div
              className={`chat-list-item ${activeId === chat._id ? "chat-list-item--active" : ""}`}
              key={chat._id}
            >
              <button
                className="chat-select"
                onClick={() => onSelect(chat._id)}
              >
                <span className="chat-list-dot" />
                <span>{chat.title}</span>
              </button>
              <button
                className="chat-delete"
                onClick={() => onRename(chat._id)}
                aria-label={`Renomear ${chat.title}`}
              >
                <Pencil size={13} />
              </button>
              <button
                className="chat-delete"
                onClick={() => onDelete(chat._id)}
                aria-label={`Excluir ${chat.title}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="empty-small">Suas novas conversas aparecem aqui.</p>
        )}
      </div>
      <div className="sidebar-bottom">
        <div className="profile-mini">
          <div className="profile-avatar">B</div>
          <div>
            <strong>Estudante</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}
