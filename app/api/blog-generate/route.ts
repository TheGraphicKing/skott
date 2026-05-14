import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchPerplexityContext(keyword: string): Promise<string> {
  if (!process.env.PERPLEXITY_API_KEY) return "";
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          {
            role: "user",
            content: `Provide key facts, statistics, and recent developments about: "${keyword}" for a B2B SaaS blog post targeting marketing and operations leaders. Include recent trends and real data points.`,
          },
        ],
        max_tokens: 800,
      }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const { keyword, audience, intent } = await req.json();

  if (!keyword) {
    return Response.json({ error: "keyword required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  // Fetch real-time context from Perplexity
  const context = await fetchPerplexityContext(keyword);

  const systemPrompt = `You are Skott's Blog Writer Agent, specialized in creating high-converting, SEO-optimized blog content for B2B SaaS companies in the AI/marketing automation space.

Your blog posts:
- Target ${audience || "marketing leaders and practitioners"}
- Intent: ${intent || "inform and convert"}
- Keyword focus: "${keyword}"
- Always include: compelling intro, data-backed insights, actionable takeaways, strong CTA

${context ? `Real-time research context:\n${context}` : ""}

Format: Return a complete blog post in markdown with clear H2/H3 structure, a compelling title, meta description, and estimated reading time.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Write a comprehensive, SEO-optimized blog post targeting the keyword: "${keyword}". The post should be 800-1200 words, include specific data points, and end with a clear call-to-action about how Lyzr's AgenticOS can help.`,
            },
          ],
        });

        for await (const chunk of response) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
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
