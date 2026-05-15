export type AgentStatus = "active" | "idle" | "running" | "error";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ViewMode = "cmo" | "marketer";

export interface AgentManifest {
  spec: string;
  name: string;
  description: string;
  model: string;
  tools: string[];
  max_turns: number;
  config: {
    allow_git_operations?: boolean;
    sandbox_enabled?: boolean;
    streaming?: boolean;
  };
  memory: {
    auto_commit?: boolean;
  };
  compliance: {
    risk_level: RiskLevel;
    audit_logging: boolean;
    human_oversight?: boolean;
  };
  skills: string[];
  workflows: string[];
  knowledge: string[];
}

export interface AgentIdentity {
  soul: string;   // SOUL.md content
  rules: string;  // RULES.md content
  duties: string; // DUTIES.md content
}

export interface SkillMeta {
  name: string;
  description: string;
  version: string;
  confidence: number;
  usageCount: number;
}

export interface Skill {
  meta: SkillMeta;
  instructions: string;
  dir: string;
}

export interface WorkflowStep {
  skill: string;
  prompt: string;
  channel?: string;
}

export interface Workflow {
  name: string;
  description: string;
  type: "flow";
  steps: WorkflowStep[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<string | object>;
  metadata?: {
    unsafe_concurrent?: boolean;
    read_only?: boolean;
    destructive?: boolean;
  };
}

export interface AgentTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<string>;
  metadata: {
    unsafe_concurrent: boolean;
    read_only: boolean;
    destructive: boolean;
  };
}

export type HookEvent =
  | "on_session_start"
  | "pre_tool_use"
  | "post_tool_failure"
  | "post_response"
  | "pre_query"
  | "on_error";

export interface HookAction {
  type: "block" | "modify" | "continue";
  reason?: string;
  modified?: unknown;
}

export type HookHandler = (
  event: HookEvent,
  payload: unknown
) => Promise<HookAction>;

export interface AgentContext {
  memory: string;
  recentHistory: Message[];
  sessionId: string;
  mode: "awakening" | "growing" | "established";
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

export type SDKMessageType = "delta" | "assistant" | "tool" | "system" | "error";

export interface SDKMessage {
  type: SDKMessageType;
  content?: string;
  tool?: string;
  input?: unknown;
  result?: unknown;
  error?: string;
}

export interface QueryOptions {
  agentId: string;
  prompt: string;
  history?: Message[];
  onMessage?: (msg: SDKMessage) => void;
}

export interface LoadedAgent {
  manifest: AgentManifest;
  identity: AgentIdentity;
  systemPrompt: string;
  skills: Skill[];
  workflows: Workflow[];
  tools: AgentTool[];
  context: AgentContext;
}
