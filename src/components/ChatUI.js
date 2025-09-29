import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useUser } from '@clerk/clerk-react'
import Cookies from "js-cookie";

export default function ChatUI({ n8nServer, botName = "Assistant" }) {

  const { user } = useUser();

  const chatSession = localStorage.getItem("chat_session") ? localStorage.getItem("chat_session") : crypto.randomUUID()
  localStorage.setItem("chat_session", chatSession);

  const firstMessage = [
    { id: 0, role: "system", content: "I am a helpful assistant for your accounting software you can ask me anything about your business." }
  ];

  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem(chatSession)) ?? firstMessage);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const businessId = Cookies.get("business_id");
  const userId = Cookies.get("user_id");
  
  if(userId == user.id){
    console.log('fake user!');
  }
  

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem(chatSession, JSON.stringify(messages));
  }, [messages, loading]);

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  const createId = () => Math.floor(Math.random() * 1e9);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setError(null);

    const userMessage = { id: createId(), role: "user", content: text, ts: Date.now() };

    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const res = await fetch(`${n8nServer}d0a2e2ed-4936-4aad-a5a6-783d73715de8`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, business_id: businessId, chat_session: chatSession }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Server error: ${res.status} ${txt}`);
      }

      const data = await res.json();
      const replyText = data[0].output ?? "(no reply)";

      const assistantMessage = {
        id: createId(),
        role: "assistant",
        content: replyText,
        ts: Date.now(),
      };

      setMessages((m) => [...m, assistantMessage]);
      setLoading(false);
      inputRef.current?.focus();
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  }

  function handleDeleteChat(){
    setMessages(firstMessage);
    localStorage.removeItem("chat_session");
    localStorage.removeItem(chatSession);
  }

  function renderMessage(m) {
    const isUser = m.role === "user";
    const isSystem = m.role === "system";
    return (
      <div key={m.id} className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`}>
        <div className={`p-3 py-1 rounded ${isUser ? "bg-secondary text-white" : "bg-light border"}`} style={{ maxWidth: "100%" }}>
          {!isSystem && (
            <span className={`badge rounded-pill text-bg-${isUser ? 'primary' : 'info'}`}>{isUser ? "You" : botName}</span>
          )}
          <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}><ReactMarkdown>{m.content}</ReactMarkdown></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow-1">
    <div className="container m-0 p-0" style={{ maxWidth: "100%", height: "100vh", overflow: 'hidden' }}>
      <div className="card h-100 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center bg-white" style={{ position: 'sticky', top: '0', zIndex: '1' }}>
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" style={{ width: "40px", height: "40px" }}>
              {botName[0]}
            </div>
            <div>
              <div className="fw-bold">{botName}</div>
              <div className="text-muted small"><span className={`badge rounded-pill text-bg-${loading ? 'warning' : 'success'}`}>{loading ? "Thinking…" : "Ready"}</span></div>
            </div>
          </div>
          <div className="text-muted small">
            <button className="btn btn-danger btn-sm mx-1 text-center" onClick={() => { handleDeleteChat() }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
          </div>

        </div>

        <div className="card-body overflow-auto bg-light" style={{ flex: 1 }}>
          {messages.length === 0 && <div className="text-center text-muted">No messages yet — say hi 👋</div>}
          {messages.map((m) => renderMessage(m))}
          {loading && (
            <div className="d-flex mb-3">
              <div className="p-3 rounded bg-white border text-muted" style={{ maxWidth: "75%" }}>Typing…</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <div className="alert alert-danger m-0">Error: {error}</div>}

        <div className="card-footer bg-white" style={{ position: 'sticky', bottom: '0', zIndex: '1' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) sendMessage();
            }}
            className="d-flex align-items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="form-control"
              style={{ resize: "none" }}
            />
            <button type="submit" disabled={loading} className={`btn ${loading ? "btn-secondary" : "btn-success"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
            </button>
          </form>
          {/* <div className="small text-muted mt-1">Messages are sent to: <code> {n8nServer} </code></div> */}
        </div>
      </div>
    </div>
    </div>
  );
}
