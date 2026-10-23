import { StrictMode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChatPage } from "@/routes/chat";

const { run } = vi.hoisted(() => ({ run: vi.fn() }));

vi.mock("@/components/AiTool", () => ({
  useAI: () => ({ run, loading: false }),
  CopyButton: () => null,
}));

afterEach(() => {
  vi.restoreAllMocks();
  run.mockReset();
});

describe("Chat effect cleanup", () => {
  it("does not treat a scroll handle as cleanup on replay, sending, or unmount", async () => {
    const scroll = vi.fn(() => ({ cancel: vi.fn() }));
    vi.stubGlobal("unused", undefined);
    const original = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
    Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scroll });
    run.mockResolvedValue("Hello, colleague.");

    try {
      const view = render(<StrictMode><ChatPage /></StrictMode>);
      const input = screen.getByPlaceholderText("Type a message… (Enter to send)");
      fireEvent.change(input, { target: { value: "Say hello to a colleague." } });
      fireEvent.keyDown(input, { key: "Enter" });

      await waitFor(() => expect(screen.getByDisplayValue("Hello, colleague.")).toBeInTheDocument());
      expect(run).toHaveBeenCalledWith(expect.any(String), [
        { role: "user", content: "Say hello to a colleague." },
      ]);
      expect(scroll.mock.calls.length).toBeGreaterThan(2);
      expect(() => view.unmount()).not.toThrow();
    } finally {
      if (original) Object.defineProperty(Element.prototype, "scrollIntoView", original);
      else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
    }
  });
});