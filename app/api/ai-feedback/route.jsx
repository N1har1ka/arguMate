// app/api/ai-feedback/route.js  (or your file)
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { DEBATE_FEEDBACK_PROMPT, FEEDBACK_PROMPT } from "@/services/Constants";

const MAX_PROMPT_CHARS = 100_000; // adjust down if provider needs smaller
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 1000;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    // 1) Prepare prompt safely (truncate if needed)
    let convoText = typeof conversation === "string"
      ? conversation
      : JSON.stringify(conversation);
    if (convoText.length > MAX_PROMPT_CHARS) {
      // Keep start + end to preserve context
      const keep = Math.floor(MAX_PROMPT_CHARS / 2);
      convoText = convoText.slice(0, keep) + "\n\n...TRUNCATED...\n\n" +
                  convoText.slice(-keep);
      console.warn("Conversation truncated for size");
    }
    const FINAL_PROMPT = DEBATE_FEEDBACK_PROMPT.replace("{{conversation}}", convoText);

    // 2) Create client
    const client = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // 3) Retry loop with exponential backoff
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        const completion = await client.chat.completions.create({
          model: "google/gemini-2.0-flash-exp:free", // ensure your account supports it
          messages: [{ role: "user", content: FINAL_PROMPT }],
          temperature: 0.2,
          max_tokens: 800,
        });

        const reply = completion?.choices?.[0]?.message ?? null;
        return NextResponse.json({ ok: true, reply }, { status: 200 });

      } catch (err) {
        attempt++;

        // If provider returned fetch-like error shape, inspect headers/status
        const status = err?.status ?? err?.code ?? null;
        const retryAfter = err?.headers?.get?.("retry-after") ?? err?.response?.headers?.["retry-after"];

        // log full error for debugging (avoid leaking to client)
        console.error("OpenRouter attempt error", { attempt, status, err });

        // If it's a 429 -> backoff & retry. Use Retry-After if provided.
        if (status === 429 && attempt <= MAX_RETRIES) {
          const waitSec = retryAfter ? Number(retryAfter) : Math.pow(2, attempt) * (BASE_BACKOFF_MS/1000);
          const waitMs = Math.max(1000, Math.floor(waitSec * 1000));
          console.warn(`Rate limited (429). retry-after=${retryAfter}. waiting ${waitMs}ms before retry #${attempt}`);
          await sleep(waitMs);
          continue;
        }

        // For 5xx, you may retry a couple times similarly
        if ((status >= 500 || status === 502 || status === 503) && attempt <= MAX_RETRIES) {
          const waitMs = Math.pow(2, attempt) * BASE_BACKOFF_MS;
          await sleep(waitMs);
          continue;
        }

        // Otherwise give up and return useful error to client
        const message = err?.message || String(err);
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
      }
    }

    // if loop ends
    return NextResponse.json({ ok: false, error: "Retries exhausted" }, { status: 429 });

  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
