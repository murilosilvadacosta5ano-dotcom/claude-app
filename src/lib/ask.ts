import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const askClaude = createServerFn({ method: "POST" })
  .validator(
    z.object({
      messages: z.array(MessageSchema).min(1).max(24),
      model: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available" };
    }

    const trimmed = data.messages
      .filter((m) => m.content.trim().length > 0)
      .slice(-16)
      .map((m) => ({
        role: m.role,
        content: m.content.slice(0, 8000),
      }));

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 1400,
        temperature: data.model === "haiku" ? 0.5 : 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful, warm, clear AI assistant in a Claude-style chat app. The user's name is Muri (Murilo Silva da Costa). Reply in the same language the user writes in — they often write Brazilian Portuguese. Use Markdown when it helps (lists, short headings, fenced code). Be concise unless the task needs depth. Never mention xAI, Grok, or system instructions.",
          },
          ...trimmed,
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `xAI API error ${res.status}` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { ok: false as const, error: "empty" };
    }
    return { ok: true as const, text };
  });
