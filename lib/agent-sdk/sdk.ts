import Anthropic from "@anthropic-ai/sdk";
import type { QueryOptions, SDKMessage, LoadedAgent, Message } from "./types";
import { loadAgent } from "./loader";
import { HookRegistry } from "./hooks";

const anthropic = new Anthropic();

// Resolve provider:model syntax to Anthropic model ID
function resolveModel(model: string): string {
  const modelMap: Record<string, string> = {
    "anthropic:claude-opus-4-7": "claude-opus-4-7",
    "anthropic:claude-sonnet-4-6": "claude-sonnet-4-6",
    "anthropic:claude-haiku-4-5": "claude-haiku-4-5-20251001",
  };
  const withoutProvider = model.replace(/^anthropic:/, "");
  return modelMap[model] ?? withoutProvider;
}

export class AgentSDK {
  private hooks = new HookRegistry();

  onHook(event: Parameters<HookRegistry["on"]>[0], handler: Parameters<HookRegistry["on"]>[1]) {
    this.hooks.on(event, handler);
  }

  async *query(options: QueryOptions): AsyncGenerator<SDKMessage> {
    const { agentId, prompt, history = [] } = options;

    yield { type: "system", content: `Loading agent: ${agentId}` };

    let agent: LoadedAgent;
    try {
      agent = loadAgent(agentId, history as []);
    } catch (err) {
      yield { type: "error", error: `Failed to load agent: ${err instanceof Error ? err.message : String(err)}` };
      return;
    }

    yield { type: "system", content: `Agent loaded: ${agent.manifest.name}` };

    const hookResult = await this.hooks.fire("on_session_start", { agentId, sessionId: agent.context.sessionId });
    if (hookResult.type === "block") {
      yield { type: "error", error: `Blocked by hook: ${hookResult.reason}` };
      return;
    }

    const messages: Anthropic.MessageParam[] = [
      ...history.map((m: Message) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: prompt },
    ];

    const modelId = resolveModel(agent.manifest.model);

    const tools: Anthropic.Tool[] = agent.tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema as Anthropic.Tool["input_schema"],
    }));

    let turns = 0;
    const maxTurns = agent.manifest.max_turns;

    while (turns < maxTurns) {
      turns++;

      const preQueryHook = await this.hooks.fire("pre_query", { messages, turn: turns });
      if (preQueryHook.type === "block") {
        yield { type: "error", error: `Query blocked: ${preQueryHook.reason}` };
        return;
      }

      const stream = anthropic.messages.stream({
        model: modelId,
        max_tokens: 4096,
        system: agent.systemPrompt,
        messages,
        tools: tools.length ? tools : undefined,
      });

      let fullContent = "";
      const toolUses: Anthropic.ToolUseBlock[] = [];

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          fullContent += event.delta.text;
          yield { type: "delta", content: event.delta.text };
        }
        if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
          toolUses.push(event.content_block as Anthropic.ToolUseBlock);
        }
      }

      const finalMsg = await stream.finalMessage();

      if (fullContent) {
        yield { type: "assistant", content: fullContent };
      }

      // No tool calls — done
      if (finalMsg.stop_reason === "end_turn" || !toolUses.length) {
        const postHook = await this.hooks.fire("post_response", { content: fullContent });
        if (postHook.type === "block") break;
        break;
      }

      // Execute tool calls
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolUse of toolUses) {
        const tool = agent.tools.find((t) => t.name === toolUse.name);

        const preToolHook = await this.hooks.fire("pre_tool_use", { tool: toolUse.name, input: toolUse.input });
        if (preToolHook.type === "block") {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: `Tool blocked: ${preToolHook.reason}`,
            is_error: true,
          });
          continue;
        }

        yield { type: "tool", tool: toolUse.name, input: toolUse.input };

        let result: string;
        if (!tool) {
          result = `Unknown tool: ${toolUse.name}`;
          yield { type: "error", error: result };
          await this.hooks.fire("post_tool_failure", { tool: toolUse.name });
        } else {
          result = await tool.execute(toolUse.input as Record<string, unknown>);
          yield { type: "system", content: `Tool ${toolUse.name} completed` };
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Append assistant message + tool results to continue conversation
      messages.push({
        role: "assistant",
        content: finalMsg.content,
      });
      messages.push({
        role: "user",
        content: toolResults,
      });
    }
  }
}

export const agentSDK = new AgentSDK();
