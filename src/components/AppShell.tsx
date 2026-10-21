import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Mail, FileText, CalendarCheck, Search, MessageSquare, Moon, Sun, Menu, X, ShieldAlert, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Overview of your tools" },
  { to: "/email", label: "Email Generator", icon: Mail, desc: "Draft emails in any tone" },
  { to: "/notes", label: "Notes Summarizer", icon: FileText, desc: "Turn notes into decisions & actions" },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck, desc: "Prioritized daily & weekly plans" },
  { to: "/research", label: "Research Assistant", icon: Search, desc: "Insights and recommendations" },
  { to: "/chat", label: "AI Chatbot", icon: MessageSquare, desc: "Ask anything about your work" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("theme") === "dark");
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => setOpen(false), [path]);

  const current = NAV.find((n) => n.to === path);

  return (
    <div className="min-h-screen bg-background">
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-sidebar-foreground">WorkPilot AI</p>
            <p className="text-xs text-muted-foreground">Productivity Assistant</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const active = path === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="truncate text-lg font-semibold">{current?.label ?? "WorkPilot AI"}</h1>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                SS
              </div>
              <div className="hidden text-sm leading-tight sm:block">
                <p className="font-medium">SIzwe Sthole</p>
                <p className="text-xs text-muted-foreground">Product Manager</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <footer className="px-4 pb-6 md:px-8">
          <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p>
              <strong>Responsible AI Disclaimer — Notice:</strong> AI-generated content may contain errors or biases.
              Always review and verify outputs before use.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
