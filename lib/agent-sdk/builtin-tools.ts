import type { ToolDefinition } from "./types";

// Built-in tools available to all agents unless restricted by manifest
export const builtinTools: ToolDefinition[] = [
  {
    name: "search_knowledge",
    description: "Search the agent's knowledge base for relevant information",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
      },
      required: ["query"],
    },
    metadata: { read_only: true, destructive: false },
    async execute({ query }) {
      return `Searching knowledge base for: ${query}`;
    },
  },
  {
    name: "get_marketing_data",
    description: "Retrieve marketing metrics and campaign data",
    inputSchema: {
      type: "object",
      properties: {
        metric: {
          type: "string",
          enum: ["mqls", "spend", "cpl", "campaigns", "social", "seo"],
          description: "Metric type to retrieve",
        },
        period: {
          type: "string",
          description: "Time period (e.g., 'last_30_days', 'this_month')",
        },
      },
      required: ["metric"],
    },
    metadata: { read_only: true, destructive: false },
    async execute({ metric, period }) {
      // Returns mock data — real integrations replace this
      const mockData: Record<string, unknown> = {
        mqls: { value: 847, change: "+12%", period: period ?? "this_month" },
        spend: { value: 124500, currency: "USD", change: "-3%", period: period ?? "this_month" },
        cpl: { value: 147, currency: "USD", change: "+8%", period: period ?? "this_month" },
        campaigns: { active: 23, paused: 4, total_budget: 180000 },
        social: { reach: 2400000, engagement: "4.2%", followers_growth: "+1.2k" },
        seo: { organic_clicks: 18400, top_keywords: 23, domain_rating: 67 },
      };
      return JSON.stringify(mockData[metric as string] ?? { error: "Unknown metric" });
    },
  },
  {
    name: "create_task",
    description: "Create a task or action item",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        priority: { type: "string", enum: ["high", "medium", "low"] },
        assignee: { type: "string" },
        due_date: { type: "string" },
      },
      required: ["title"],
    },
    metadata: { read_only: false, destructive: false },
    async execute({ title, priority }) {
      return JSON.stringify({ id: Math.random().toString(36).slice(2), title, priority, status: "created" });
    },
  },
  {
    name: "send_notification",
    description: "Send a notification or alert to the team",
    inputSchema: {
      type: "object",
      properties: {
        channel: { type: "string", enum: ["slack", "email", "in-app"] },
        message: { type: "string" },
        urgency: { type: "string", enum: ["high", "normal", "low"] },
      },
      required: ["channel", "message"],
    },
    metadata: { read_only: false, destructive: false },
    async execute({ channel, message }) {
      return JSON.stringify({ sent: true, channel, message });
    },
  },
];
