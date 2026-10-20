import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant"; content: string };
type Input = { system: string; messages: Msg[] };

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((input: Input) => {
    if (!input?.messages?.length) throw new Error("Please enter some text.");
    return input;
  })
  .handler(async ({ data }) => {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("AI is not configured.");
    let runId: string | undefined;
    const openai = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: async (input, init) => {
        const headers = new Headers(init?.headers);
        if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
        const res = await fetch(input, { ...init, headers });
        runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
        if (res.status === 429) throw new Error("Too many requests — please wait a moment and try again.");
        if (res.status === 402) throw new Error("AI credits are used up. Please add credits to continue.");
        if (res.status === 403) throw new Error("AI access is blocked for this workspace.");
        return res;
      },
    });
    let error: unknown;
    const result = streamText({
      model: openai.responses("openai/gpt-6-astra"),
      system: data.system,
      messages: data.messages,
      onError: ({ error: e }) => {
        error = e;
      },
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = await result.text;
    if (error && !text) throw error instanceof Error ? error : new Error("AI request failed.");
    return { text };
  });
