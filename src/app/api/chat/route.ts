import { createAIClient, AI_MODEL, getUserApiKey } from "@/lib/claude";
import { buildChatSystemPrompt } from "@/lib/prompts";
import type { ColumnMeta, Summary } from "@/types";

export const maxDuration = 60;

interface ChatBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  columns: ColumnMeta[];
  summary: Summary;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatBody;

    if (!body.messages?.length || !body.columns?.length || !body.summary) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const client = createAIClient(getUserApiKey(request));
    const systemPrompt = buildChatSystemPrompt(body.columns, body.summary);

    const stream = await client.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...body.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const encoder = new TextEncoder();

    const sseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "text_delta", content })}\n\n`,
                ),
              );
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "done" })}\n\n`,
            ),
          );
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", message })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
