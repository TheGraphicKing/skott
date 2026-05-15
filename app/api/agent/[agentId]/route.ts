import { agentSDK } from "@/lib/agent-sdk";
import type { Message } from "@/lib/agent-sdk";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { agentId } = await params;
  const { prompt, history = [], stream: useStream = true } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: "prompt is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const typedHistory: Message[] = history.map(
    (m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })
  );

  if (!useStream) {
    // Collect full response for non-streaming clients
    const messages: { type: string; content?: string }[] = [];
    try {
      for await (const msg of agentSDK.query({ agentId, prompt, history: typedHistory })) {
        messages.push(msg);
      }
      const text = messages
        .filter((m) => m.type === "assistant")
        .map((m) => m.content)
        .join("");
      return new Response(JSON.stringify({ response: text, messages }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err instanceof Error ? err.message : "Agent error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Streaming response
  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const msg of agentSDK.query({ agentId, prompt, history: typedHistory })) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// List available agents
export async function GET() {
  const agents = [
    "orchestrator",
    "social-media-agent",
    "campaign-optimizer",
    "seo-intelligence",
    "content-strategist",
    "brand-qc",
    "events-manager",
    "partnership-agent",
    "chief-of-staff",
    "wiki-curator",
  ];
  return new Response(JSON.stringify({ agents }), {
    headers: { "Content-Type": "application/json" },
  });
}
