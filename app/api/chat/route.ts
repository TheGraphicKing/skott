import { agentSDK } from "@/lib/agent-sdk";
import type { Message } from "@/lib/agent-sdk";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages, agentId = "orchestrator" } = await req.json();

  const history: Message[] = (messages ?? []).slice(0, -1).map(
    (m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  const lastMessage = messages?.[messages.length - 1];
  const prompt: string = lastMessage?.content ?? "";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const msg of agentSDK.query({ agentId, prompt, history })) {
          if (msg.type === "delta" && msg.content) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: msg.content })}\n\n`)
            );
          } else if (msg.type === "tool") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ tool: msg.tool, input: msg.input })}\n\n`)
            );
          } else if (msg.type === "system") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ system: msg.content })}\n\n`)
            );
          } else if (msg.type === "error") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: msg.error })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
