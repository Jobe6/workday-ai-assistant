import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OutputBox, ToolPage, useAI } from "@/components/AiTool";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      { name: "description", content: "Summarize meeting notes into decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Summarize meeting notes into decisions, action items and deadlines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const { run, loading } = useAI();
  return (
    <ToolPage
      title="Meeting Notes Summarizer"
      subtitle="Paste raw notes and get a clean, structured summary."
      action="Summarize"
      loading={loading}
      onAction={async () => {
        const t = await run(
          `Summarize meeting notes. Output plain text with exactly these headings in uppercase, each followed by content:\nSUMMARY\nKEY DECISIONS\nACTION ITEMS (format: - Owner: task)\nDEADLINES (format: - Date: item)\nUse "- " bullets. Write "None mentioned" when a section is empty. No markdown symbols like # or **.`,
          [{ role: "user", content: notes }],
        );
        if (t) setOut(t);
      }}
      input={
        <div className="space-y-2">
          <Label>Meeting notes</Label>
          <Textarea rows={16} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting notes here…" />
        </div>
      }
      output={<OutputBox label="Summary" value={out} onChange={setOut} rows={20} />}
    />
  );
}
