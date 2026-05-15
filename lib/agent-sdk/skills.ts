import fs from "fs";
import path from "path";
import type { Skill, SkillMeta } from "./types";

const SKILLS_ROOT = path.join(process.cwd(), "skills");

function parseFrontmatter(content: string): { meta: Partial<SkillMeta>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta: Partial<SkillMeta> = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    const val = rest.join(":").trim();
    if (key === "name") meta.name = val;
    if (key === "description") meta.description = val;
    if (key === "version") meta.version = val;
    if (key === "confidence") meta.confidence = parseFloat(val);
    if (key === "usageCount") meta.usageCount = parseInt(val, 10);
  }
  return { meta, body: match[2].trim() };
}

export function loadSkill(skillName: string): Skill | null {
  const skillDir = path.join(SKILLS_ROOT, skillName);
  const skillFile = path.join(skillDir, "SKILL.md");

  if (!fs.existsSync(skillFile)) return null;

  const content = fs.readFileSync(skillFile, "utf-8");
  const { meta, body } = parseFrontmatter(content);

  return {
    meta: {
      name: meta.name ?? skillName,
      description: meta.description ?? "",
      version: meta.version ?? "1.0.0",
      confidence: meta.confidence ?? 1.0,
      usageCount: meta.usageCount ?? 0,
    },
    instructions: body,
    dir: skillDir,
  };
}

export function loadSkills(skillNames: string[]): Skill[] {
  return skillNames.flatMap((name) => {
    const skill = loadSkill(name);
    return skill ? [skill] : [];
  });
}

export function formatSkillsForPrompt(skills: Skill[]): string {
  if (!skills.length) return "";
  const lines = skills.map(
    (s) => `### Skill: ${s.meta.name}\n${s.meta.description}\n\n${s.instructions}`
  );
  return `## Available Skills\n\n${lines.join("\n\n---\n\n")}`;
}
