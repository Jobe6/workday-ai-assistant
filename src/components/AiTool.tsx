import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check, Loader2, Sparkle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAI } from "@/lib/ai.functions";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!text}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      Copy to Clipboard
    </Button>
  );
}

export function OutputBox({ value, onChange, label = "Output", rows = 16 }: { value: string; onChange: (v: string) => void; label?: string; rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{label} <span className="font-normal text-muted-foreground">(editable)</span></p>
        <CopyButton text={value} />
      </div>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="font-mono text-sm leading-relaxed" placeholder="AI output will appear here…" />
    </div>
  );
}

export function useAI() {
  const call = useServerFn(runAI);
  const [loading, setLoading] = useState(false);
  const run = async (system: string, messages: { role: "user" | "assistant"; content: string }[]) => {
    setLoading(true);
    try {
      const r = await call({ data: { system, messages } });
      return r.text;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { run, loading };
}

export function ToolPage({ title, subtitle, input, output, action, onAction, loading }: {
  title: string; subtitle: string; input: ReactNode; output: ReactNode; action: string; onAction: () => void; loading: boolean;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          {input}
          <Button className="w-full" onClick={onAction} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkle className="h-4 w-4" />}
            {loading ? "Working…" : action}
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">{output}</div>
      </div>
    </div>
  );
}
