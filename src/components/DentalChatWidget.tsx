import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, ImagePlus, X, Loader2 } from "lucide-react";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Msg = {
  role: "user" | "assistant";
  content: string | ContentPart[];
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dental-chat`;

function renderUserContent(content: Msg["content"]) {
  if (typeof content === "string") return content;
  return (
    <div className="space-y-2">
      {content.map((p, i) =>
        p.type === "image_url" ? (
          <img key={i} src={p.image_url.url} alt="uploaded" className="rounded-lg max-h-64 border border-border" />
        ) : (
          <div key={i} className="whitespace-pre-wrap">{p.text}</div>
        )
      )}
    </div>
  );
}

export function DentalChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome, future dentist! I'm **ToothBot**, your AI study companion.\n\nAsk me about **oral pathology, endodontics, periodontics, radiology, pharmacology** — or upload an **intraoral photo, radiograph, or histology slide** and I'll help you work through the differential diagnosis.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 8 * 1024 * 1024) {
        alert(`${file.name} is too large (max 8MB).`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setPendingImages((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  async function send() {
    const text = input.trim();
    if ((!text && pendingImages.length === 0) || loading) return;

    const parts: ContentPart[] = [];
    pendingImages.forEach((url) => parts.push({ type: "image_url", image_url: { url } }));
    if (text) parts.push({ type: "text", text });

    const userMsg: Msg = { role: "user", content: parts.length === 1 && parts[0].type === "text" ? text : parts };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setPendingImages([]);
    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const errText =
          resp.status === 429
            ? "Too many requests. Please wait a moment."
            : resp.status === 402
            ? "AI credits exhausted."
            : "Something went wrong.";
        setMessages((p) => [...p, { role: "assistant", content: errText }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let started = false;
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              acc += c;
              if (!started) {
                started = true;
                setMessages((p) => [...p, { role: "assistant", content: acc }]);
              } else {
                setMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m)));
              }
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch {
      setMessages((p) => [...p, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center gap-3 text-primary-foreground shrink-0"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
          🦷
        </div>
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-1.5 text-lg">
            ToothBot <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-xs opacity-90">AI study assistant for dental students · Upload images for case discussion</div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground rounded-bl-sm border border-border"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-1 prose-headings:font-semibold">
                    <ReactMarkdown>{typeof m.content === "string" ? m.content : ""}</ReactMarkdown>
                  </div>
                ) : (
                  renderUserContent(m.content)
                )}
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card shrink-0">
        <div className="max-w-3xl mx-auto p-3">
          {pendingImages.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {pendingImages.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="" className="h-20 w-20 object-cover rounded-lg border border-border" />
                  <button
                    onClick={() => setPendingImages((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 items-end">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { handleFiles(e.target.files); if (fileRef.current) fileRef.current.value = ""; }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="h-11 w-11 shrink-0 rounded-xl border border-input bg-background flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
              aria-label="Upload image"
              title="Upload radiograph or clinical photo"
            >
              <ImagePlus className="h-5 w-5 text-foreground" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask a clinical question or describe a case..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-40 min-h-[44px]"
            />
            <button
              onClick={send}
              disabled={loading || (!input.trim() && pendingImages.length === 0)}
              className="h-11 w-11 shrink-0 rounded-xl text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
              style={{ background: "var(--gradient-primary)" }}
              aria-label="Send"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground text-center mt-2">
            For educational use only · Final diagnosis requires in-person clinical examination by a licensed dentist.
          </div>
        </div>
      </div>
    </div>
  );
}
