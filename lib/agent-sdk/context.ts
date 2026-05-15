import fs from "fs";
import path from "path";
import type { AgentContext, Message } from "./types";

const TOKEN_BUDGET = 2000;
const CHARS_PER_TOKEN = 4;
const MAX_CHARS = TOKEN_BUDGET * CHARS_PER_TOKEN;
const MAX_HISTORY = 30;

export function loadAgentContext(agentDir: string, history: Message[] = []): AgentContext {
  const memoryPath = path.join(agentDir, "memory", "MEMORY.md");
  let memory = "";

  if (fs.existsSync(memoryPath)) {
    const raw = fs.readFileSync(memoryPath, "utf-8");
    memory = raw.length > MAX_CHARS ? raw.slice(0, MAX_CHARS) + "\n[truncated]" : raw;
  }

  const recentHistory = history.slice(-MAX_HISTORY);

  let mode: AgentContext["mode"] = "awakening";
  if (memory.length > 500) mode = "established";
  else if (memory.length > 0) mode = "growing";

  const sessionId = Math.random().toString(36).slice(2, 10);

  return { memory, recentHistory, sessionId, mode };
}

export function buildMemoryBlock(context: AgentContext): string {
  if (!context.memory) {
    if (context.mode === "awakening") {
      return "## Memory\nThis is your first interaction. No persistent memory yet.";
    }
    return "";
  }
  return `## Memory\n${context.memory}`;
}
