import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutputBox, ToolPage, useAI } from "@/components/AiTool";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      { name: "description", content: "Turn tasks and goals into a prioritized daily or weekly schedule." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Turn tasks and goals into a prioritized daily or weekly schedule." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [mode, setMode] = useState("daily");
  const [out, setOut] = useState("");
  const { run, loading } = useAI();
  return (
    <ToolPage
      title="AI Task Planner"
      subtitle="List your tasks and goals; get a schedule that tackles urgent work first."
      action="Create Schedule"
      loading={loading}
      onAction={async () => {
        const t = await run(
          `You are a productivity planner. Build a ${mode === "daily" ? "daily schedule (time blocks from 08:00 to 17:00)" : "weekly schedule (Monday to Friday)"} from the user's tasks. Prioritize urgent and important tasks first (Eisenhower method), include short breaks. Start with a "PRIORITIES" list tagging each task [URGENT], [HIGH], [MEDIUM] or [LOW], then a "SCHEDULE" section, then "TIPS" with 2-3 bullets. Plain text, no markdown symbols like # or **.`,
          [{ role: "user", content: tasks }],
        );
        if (t) setOut(t);
      }}
      input={
        <>
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="w-full">
              <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-2">
            <Label>Tasks & goals</Label>
            <Textarea rows={12} value={tasks} onChange={(e) => setTasks(e.target.value)} placeholder={"- Finish Q3 report (due tomorrow)\n- Prepare client demo\n- Reply to emails\n- Gym"} />
          </div>
        </>
      }
      output={<OutputBox label="Your Schedule" value={out} onChange={setOut} rows={20} />}
    />
  );
}
