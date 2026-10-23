import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NAV } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting notes, planning, research and chat with AI." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting notes, planning, research and chat with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-8 text-primary-foreground shadow-lg">
        <p className="text-sm font-medium opacity-80">Welcome back, Jane</p>
        <h2 className="mt-1 text-3xl font-bold md:text-4xl">AI Workplace Productivity Assistant</h2>
        <p className="mt-2 max-w-xl opacity-90">Draft emails, summarize meetings, plan your week and research topics — in seconds.</p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {NAV.slice(1).map((n) => (
          <Link key={n.to} to={n.to} className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <n.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold">{n.label}</h3>
            <p className="text-sm text-muted-foreground">{n.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
