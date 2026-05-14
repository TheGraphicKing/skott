import { cn } from "@/lib/utils";

interface Props {
  status: "active" | "idle" | "error" | "running";
  showLabel?: boolean;
}

const config = {
  active:  { dot: "bg-[hsl(142,71%,45%)]", text: "text-[hsl(142,71%,35%)]", bg: "bg-[hsl(142,71%,45%)]/10", label: "Active" },
  idle:    { dot: "bg-[hsl(25,20%,60%)]",  text: "text-[hsl(25,20%,50%)]",  bg: "bg-[hsl(25,20%,60%)]/10",  label: "Idle" },
  error:   { dot: "bg-[hsl(0,84%,60%)]",   text: "text-[hsl(0,84%,55%)]",   bg: "bg-[hsl(0,84%,60%)]/10",   label: "Error" },
  running: { dot: "bg-[hsl(217,91%,60%)]", text: "text-[hsl(217,91%,50%)]", bg: "bg-[hsl(217,91%,60%)]/10", label: "Running" },
};

export function AgentStatusBadge({ status, showLabel = true }: Props) {
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-[500]", c.bg, c.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-dot", c.dot)} />
      {showLabel && c.label}
    </span>
  );
}
