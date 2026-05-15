import type { AgentTool, ToolDefinition } from "./types";

const MAX_RESULT_LENGTH = 50_000;

export function buildTool(def: ToolDefinition): AgentTool {
  return {
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema,
    metadata: {
      unsafe_concurrent: def.metadata?.unsafe_concurrent ?? false,
      read_only: def.metadata?.read_only ?? false,
      destructive: def.metadata?.destructive ?? true,
    },
    async execute(params) {
      try {
        const result = await def.execute(params);
        const str = typeof result === "string" ? result : JSON.stringify(result);
        return str.length > MAX_RESULT_LENGTH
          ? str.slice(0, MAX_RESULT_LENGTH) + "\n[truncated]"
          : str;
      } catch (err) {
        return `Tool error: ${err instanceof Error ? err.message : String(err)}`;
      }
    },
  };
}
