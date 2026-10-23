import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OutputBox, ToolPage, useAI } from "@/components/AiTool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      { name: "description", content: "Get a summary, key insights and recommendations on any topic." },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Get a summary, key insights and recommendations on any topic." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState("");
  const { run, loading } = useAI();
  return (
    <ToolPage
      title="AI Research Assistant"
      subtitle="Enter a topic to get a concise briefing."
      action="Research Topic"
      loading={loading}
      onAction={async () => {
        const t = await run(
          `You are a business research analyst. For the given topic, output plain text with these uppercase headings: SUMMARY (one paragraph), KEY INSIGHTS (5 "- " bullets), RECOMMENDATIONS (3-5 "- " actionable bullets). No markdown symbols like # or **.`,
          [{ role: "user", content: topic }],
        );
        if (t) setOut(t);
      }}
      input={
        <div className="space-y-2">
          <Label>Research topic</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Benefits of a 4-day work week" />
        </div>
      }
      output={<OutputBox label="Research Briefing" value={out} onChange={setOut} rows={20} />}
    />
  );
}
