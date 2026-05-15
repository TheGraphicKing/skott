import fs from "fs";
import path from "path";
import type { Workflow } from "./types";

const WORKFLOWS_ROOT = path.join(process.cwd(), "workflows");

function parseWorkflowYaml(content: string): Partial<Workflow> {
  const workflow: Partial<Workflow> = { steps: [] };

  const nameMatch = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
  if (nameMatch) workflow.name = nameMatch[1];

  const descMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (descMatch) workflow.description = descMatch[1];

  const typeMatch = content.match(/^type:\s*["']?(.+?)["']?\s*$/m);
  if (typeMatch) workflow.type = typeMatch[1] as "flow";

  // Parse steps block
  const stepsMatch = content.match(/^steps:\s*\n([\s\S]*?)(?=^\w|\s*$)/m);
  if (stepsMatch) {
    const stepBlocks = stepsMatch[1].split(/\n\s*-\s+/).filter(Boolean);
    workflow.steps = stepBlocks.map((block) => {
      const skillMatch = block.match(/skill:\s*["']?(.+?)["']?\s*$/m);
      const promptMatch = block.match(/prompt:\s*["']?([\s\S]+?)["']?\s*$/m);
      const channelMatch = block.match(/channel:\s*["']?(.+?)["']?\s*$/m);
      return {
        skill: skillMatch?.[1] ?? "",
        prompt: promptMatch?.[1] ?? "",
        channel: channelMatch?.[1],
      };
    });
  }

  return workflow;
}

export function loadWorkflow(workflowName: string): Workflow | null {
  const candidates = [
    path.join(WORKFLOWS_ROOT, `${workflowName}.yaml`),
    path.join(WORKFLOWS_ROOT, `${workflowName}.yml`),
    path.join(WORKFLOWS_ROOT, `${workflowName}.md`),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parseWorkflowYaml(content);
    if (parsed.name && parsed.steps?.length) {
      return parsed as Workflow;
    }
  }
  return null;
}

export function loadWorkflows(workflowNames: string[]): Workflow[] {
  return workflowNames.flatMap((name) => {
    const wf = loadWorkflow(name);
    return wf ? [wf] : [];
  });
}

export function formatWorkflowsForPrompt(workflows: Workflow[]): string {
  if (!workflows.length) return "";
  const lines = workflows.map((wf) => {
    const steps = wf.steps
      .map((s, i) => `  ${i + 1}. [${s.skill}] ${s.prompt}`)
      .join("\n");
    return `### Workflow: @${wf.name}\n${wf.description}\n\nSteps:\n${steps}`;
  });
  return `## Available Workflows\n\n${lines.join("\n\n---\n\n")}`;
}
