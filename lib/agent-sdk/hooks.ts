import type { HookAction, HookEvent, HookHandler } from "./types";

const HOOK_TIMEOUT_MS = 10_000;

export class HookRegistry {
  private handlers: Map<HookEvent, HookHandler[]> = new Map();

  on(event: HookEvent, handler: HookHandler) {
    const existing = this.handlers.get(event) ?? [];
    this.handlers.set(event, [...existing, handler]);
  }

  async fire(event: HookEvent, payload: unknown): Promise<HookAction> {
    const handlers = this.handlers.get(event) ?? [];
    for (const handler of handlers) {
      let action: HookAction;
      try {
        action = await Promise.race([
          handler(event, payload),
          new Promise<HookAction>((_, reject) =>
            setTimeout(() => reject(new Error("Hook timeout")), HOOK_TIMEOUT_MS)
          ),
        ]);
      } catch {
        // Isolate hook failures — never halt agent
        continue;
      }
      if (action.type === "block" || action.type === "modify") return action;
    }
    return { type: "continue" };
  }
}
