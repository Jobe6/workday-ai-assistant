import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton, useAI } from "@/components/AiTool";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace Assistant" },
      { name: "description", content: "Chat with an AI assistant about your work." },
      { property: "og:title", content: "AI Chatbot" },
      { property: "og:description", content: "Chat with an AI assistant about your work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

export function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const { run, loading } = useAI();
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Browser scroll helpers may return a handle; it is not React cleanup.
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async () => {
    if (!text.trim() || loading) return;
    const next = [...msgs, { role: "user" as const, content: text.trim() }];
    setMsgs(next);
    setText("");
    const r = await run("You are a helpful, concise workplace productivity assistant. Reply in plain text.", next);
    if (r) setMsgs([...next, { role: "assistant", content: r }]);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-14rem)] min-h-[28rem] max-w-4xl flex-col rounded-xl border bg-card shadow-sm">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
        {msgs.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <Bot className="mb-3 h-10 w-10 text-primary" />
            <p className="font-medium text-foreground">How can I help you today?</p>
            <p className="text-sm">Ask about writing, planning, meetings, or anything work-related.</p>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            {m.role === "user" ? (
              <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground">{m.content}</div>
            ) : (
              <div className="w-full max-w-[85%] space-y-2">
                <Textarea
                  value={m.content}
                  rows={Math.min(14, m.content.split("\n").length + 2)}
                  onChange={(e) => setMsgs((p) => p.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))}
                  className="text-sm"
                />
                <CopyButton text={m.content} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="flex gap-2 border-t p-3">
        <Textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
          }}
          placeholder="Type a message… (Enter to send)"
          className="resize-none"
        />
        <Button onClick={send} disabled={loading || !text.trim()} size="icon" className="h-auto w-12" aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
