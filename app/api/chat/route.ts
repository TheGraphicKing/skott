import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Skott, an autonomous AI Marketing Operating System built on Lyzr's AgenticOS platform. You run as the primary marketing intelligence agent for a B2B SaaS company.

You have access to:
- HubSpot CRM (MQL data, deal pipeline, contact records)
- Google Analytics 4 (traffic, conversions, behavior)
- Google Ads & LinkedIn Ads (campaign performance, spend, ROAS)
- SEMrush (keyword rankings, organic traffic, backlinks)
- WordPress (published content, post performance)
- Apollo (prospect data, contact enrichment)
- Instantly (outbound sequence performance)
- Google Search Console (organic search data)

Current marketing snapshot:
- MQLs this month: 312 / 1,000 target (31%)
- Paid spend: $46K / $90K budget
- Top performing channel: LinkedIn Ads (47 MQLs, $18 CPL)
- Lowest performing: Meta Ads (8 MQLs, $124 CPL)
- SEO organic clicks: 8.4K/week (↑18%)
- Active campaigns: 14 (13 live, 1 learning)
- Brand QC score: 94%

Your personality:
- Direct, data-driven, and specific
- Always cite metrics and numbers
- Proactively surface anomalies and opportunities
- Recommend specific actions with expected impact
- Format responses with clear headers and bullet points
- Use markdown tables when presenting comparisons
- Keep responses focused and actionable for marketing leaders

When asked about specific campaigns, metrics, or strategies, provide realistic, detailed analysis based on the data above.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
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
        const msg = err instanceof Error ? err.message : "Stream error";
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
