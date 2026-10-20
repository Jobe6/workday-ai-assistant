import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OutputBox, ToolPage, useAI } from "@/components/AiTool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      { name: "description", content: "Generate formal, friendly or persuasive emails with AI." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Generate formal, friendly or persuasive emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Formal");
  const [out, setOut] = useState("");
  const { run, loading } = useAI();
  return (
    <ToolPage
      title="Smart Email Generator"
      subtitle="Describe the email you need and pick a tone."
      action="Generate Email"
      loading={loading}
      onAction={async () => {
        const t = await run(
          `You write professional workplace emails. Tone: ${tone}. Output plain text only: a "Subject:" line, a blank line, then the email body with greeting and sign-off. No markdown.`,
          [{ role: "user", content: prompt }],
        );
        if (t) setOut(t);
      }}
      input={
        <>
          <div className="space-y-2">
            <Label>What should the email say?</Label>
            <Textarea rows={8} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g. Ask my manager for Friday off to attend a family event" />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Persuasive"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </>
      }
      output={<OutputBox label="Generated Email" value={out} onChange={setOut} />}
    />
  );
}
