import fs from "fs";
import path from "path";
import type { AgentManifest, AgentIdentity, LoadedAgent } from "./types";
import { loadAgentContext, buildMemoryBlock } from "./context";
import { loadSkills, formatSkillsForPrompt } from "./skills";
import { loadWorkflows, formatWorkflowsForPrompt } from "./workflows";
import { buildTool } from "./tool-factory";
import { builtinTools } from "./builtin-tools";

const AGENTS_ROOT = path.join(process.cwd(), "agents");

function parseYaml(content: string): Record<string, unknown> {
  // Minimal YAML parser for agent manifests (key: value + nested blocks)
  const result: Record<string, unknown> = {};
  const lines = content.split("\n");
  let currentKey = "";
  let currentObj: Record<string, unknown> = result;
  const stack: [string, Record<string, unknown>][] = [];

  for (const line of lines) {
    if (line.trim().startsWith("#") || !line.trim()) continue;

    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;

    // Pop stack on dedent
    while (stack.length && stack[stack.length - 1] && indent <= (stack.length - 1) * 2) {
      stack.pop();
      currentObj = stack.length ? stack[stack.length - 1][1] : result;
    }

    const arrMatch = line.match(/^\s*-\s+(.+)$/);
    if (arrMatch) {
      const parent = currentObj[currentKey];
      if (Array.isArray(parent)) parent.push(arrMatch[1].replace(/["']/g, ""));
      continue;
    }

    const kvMatch = line.match(/^(\s*)(\w[\w_-]*):\s*(.*)$/);
    if (!kvMatch) continue;
    const key = kvMatch[2];
    const val = kvMatch[3].trim().replace(/["']/g, "");

    if (!val) {
      // Nested object
      currentObj[key] = {};
      stack.push([key, currentObj]);
      currentObj = currentObj[key] as Record<string, unknown>;
      currentKey = key;
    } else if (val === "true" || val === "false") {
      currentObj[key] = val === "true";
    } else if (!isNaN(Number(val)) && val !== "") {
      currentObj[key] = Number(val);
    } else if (val.startsWith("[")) {
      // Inline array
      currentObj[key] = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/["']/g, ""))
        .filter(Boolean);
    } else {
      currentObj[key] = val;
    }
    currentKey = key;
  }

  return result;
}

export function loadManifest(agentDir: string): AgentManifest {
  const manifestPath = path.join(agentDir, "agent.yaml");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No agent.yaml found at ${manifestPath}`);
  }
  const raw = fs.readFileSync(manifestPath, "utf-8");
  const parsed = parseYaml(raw);

  return {
    spec: (parsed.spec as string) ?? "0.1.0",
    name: (parsed.name as string) ?? "unknown",
    description: (parsed.description as string) ?? "",
    model: (parsed.model as string) ?? "anthropic:claude-sonnet-4-6",
    tools: (parsed.tools as string[]) ?? [],
    max_turns: (parsed.max_turns as number) ?? 20,
    config: (parsed.config as AgentManifest["config"]) ?? {},
    memory: (parsed.memory as AgentManifest["memory"]) ?? { auto_commit: false },
    compliance: (parsed.compliance as AgentManifest["compliance"]) ?? {
      risk_level: "low",
      audit_logging: false,
    },
    skills: (parsed.skills as string[]) ?? [],
    workflows: (parsed.workflows as string[]) ?? [],
    knowledge: (parsed.knowledge as string[]) ?? [],
  };
}

export function loadIdentity(agentDir: string): AgentIdentity {
  const read = (file: string) => {
    const p = path.join(agentDir, file);
    return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
  };
  return {
    soul: read("SOUL.md"),
    rules: read("RULES.md"),
    duties: read("DUTIES.md"),
  };
}

function loadKnowledge(knowledgeNames: string[]): string {
  const knowledgeRoot = path.join(process.cwd(), "knowledge");
  const sections: string[] = [];

  for (const name of knowledgeNames) {
    const candidates = [
      path.join(knowledgeRoot, `${name}.md`),
      path.join(knowledgeRoot, `${name}.txt`),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        sections.push(`### Knowledge: ${name}\n${fs.readFileSync(p, "utf-8")}`);
        break;
      }
    }
  }

  return sections.length ? `## Knowledge Base\n\n${sections.join("\n\n---\n\n")}` : "";
}

function buildSystemPrompt(
  identity: AgentIdentity,
  memoryBlock: string,
  skillsBlock: string,
  workflowsBlock: string,
  knowledgeBlock: string
): string {
  const sections = [
    identity.soul && `## Identity\n${identity.soul}`,
    identity.rules && `## Rules\n${identity.rules}`,
    identity.duties && `## Duties\n${identity.duties}`,
    memoryBlock,
    knowledgeBlock,
    skillsBlock,
    workflowsBlock,
  ].filter(Boolean);

  return sections.join("\n\n");
}

export function loadAgent(agentId: string, history: [] = []): LoadedAgent {
  const agentDir = path.join(AGENTS_ROOT, agentId);
  if (!fs.existsSync(agentDir)) {
    throw new Error(`Agent not found: ${agentId}`);
  }

  const manifest = loadManifest(agentDir);
  const identity = loadIdentity(agentDir);
  const context = loadAgentContext(agentDir, history);
  const skills = loadSkills(manifest.skills);
  const workflows = loadWorkflows(manifest.workflows);

  const memoryBlock = buildMemoryBlock(context);
  const skillsBlock = formatSkillsForPrompt(skills);
  const workflowsBlock = formatWorkflowsForPrompt(workflows);
  const knowledgeBlock = loadKnowledge(manifest.knowledge);

  const systemPrompt = buildSystemPrompt(
    identity,
    memoryBlock,
    skillsBlock,
    workflowsBlock,
    knowledgeBlock
  );

  // Merge builtin tools filtered by manifest allowlist
  const allowedTools = manifest.tools.length
    ? builtinTools.filter((t) => manifest.tools.includes(t.name))
    : builtinTools;

  const tools = allowedTools.map(buildTool);

  return { manifest, identity, systemPrompt, skills, workflows, tools, context };
}
