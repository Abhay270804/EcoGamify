import { cn } from "@/lib/utils";
import type { SimulationTile, SimulationAction } from "./types";

const TILE_STYLES: Record<
  SimulationTile["type"],
  { color: string; label: string; icon: string }
> = {
  forest: {
    color: "from-emerald-500/80 to-emerald-400/60",
    label: "Forest",
    icon: "🌳",
  },
  wetland: {
    color: "from-teal-500/80 to-sky-400/60",
    label: "Wetland",
    icon: "🌿",
  },
  urban: {
    color: "from-slate-500/80 to-slate-400/60",
    label: "Urban",
    icon: "🏙️",
  },
  solar: {
    color: "from-amber-500/80 to-yellow-400/60",
    label: "Solar",
    icon: "🔆",
  },
  water: {
    color: "from-sky-500/80 to-blue-400/60",
    label: "River",
    icon: "💧",
  },
  polluted: {
    color: "from-stone-500/80 to-stone-400/60",
    label: "Polluted",
    icon: "⚠️",
  },
  wildflower: {
    color: "from-pink-400/80 to-orange-400/60",
    label: "Wildflower",
    icon: "🌸",
  },
  farmland: {
    color: "from-amber-400/80 to-lime-400/60",
    label: "Farm",
    icon: "🚜",
  },
};

export function TileCard({
  tile,
  selectedAction,
  onInteract,
}: {
  tile: SimulationTile;
  selectedAction: SimulationAction;
  onInteract: (tileId: string) => void;
}) {
  const style = TILE_STYLES[tile.type];
  const healthPercent = Math.round(tile.health);
  const pollutionPercent = Math.round(tile.pollution);
  const biodiversityPercent = Math.round(tile.biodiversity);
  const energyPercent = Math.round(tile.energy);

  const status = getStatusBadge(tile);
  const actionLabel = getActionLabel(tile, selectedAction);

  return (
    <button
      type="button"
      onClick={() => onInteract(tile.id)}
      className={cn(
        "flex flex-col rounded-xl border bg-gradient-to-br p-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        `hover:ring-2 hover:ring-primary/60 ${style.color}`,
      )}
    >
      <div className="flex items-center justify-between text-sm font-semibold text-white">
        <span>
          {style.icon} {style.label}
        </span>
        <span className="rounded bg-white/20 px-2 py-0.5 text-xs uppercase tracking-wide">
          {actionLabel}
        </span>
      </div>
      <div className="mt-3 space-y-2 rounded-md bg-white/85 p-3 text-xs text-foreground">
        <Metric label="Health" value={healthPercent} accent="bg-emerald-500" />
        <Metric
          label="Pollution"
          value={pollutionPercent}
          accent="bg-rose-500"
          invert
        />
        <Metric
          label="Biodiversity"
          value={biodiversityPercent}
          accent="bg-lime-500"
        />
        <Metric label="Energy" value={energyPercent} accent="bg-amber-500" />
      </div>
      {status && (
        <span
          className={cn(
            "mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium",
            status.className,
          )}
        >
          {status.icon} {status.label}
        </span>
      )}
    </button>
  );
}

function getStatusBadge(tile: SimulationTile) {
  if (tile.pollution > 60) {
    return {
      label: "High pollution",
      className: "bg-rose-100 text-rose-700",
      icon: "🚨",
    };
  }
  if (tile.health < 45) {
    return {
      label: "Drought stress",
      className: "bg-amber-100 text-amber-700",
      icon: "🌵",
    };
  }
  if (tile.type === "farmland" && tile.health >= 70) {
    return {
      label: "Harvest ready",
      className: "bg-lime-100 text-lime-700",
      icon: "🌾",
    };
  }
  if (tile.biodiversity >= 85) {
    return {
      label: "Thriving habitat",
      className: "bg-emerald-100 text-emerald-700",
      icon: "🌱",
    };
  }
  return null;
}

function getActionLabel(tile: SimulationTile, action: SimulationAction) {
  if (action === "plant") {
    if (tile.type === "forest" || tile.type === "wildflower") return "Steward";
    return tile.type === "farmland" ? "Tend" : "Plant";
  }
  if (action === "clean") return tile.pollution > 20 ? "Clean" : "Inspect";
  if (action === "solar") return tile.type === "solar" ? "Maintain" : "Solar";
  if (action === "wetland")
    return tile.type === "wetland" ? "Nurture" : "Restore";
  return "Manage";
}

function Metric({
  label,
  value,
  accent,
  invert,
}: {
  label: string;
  value: number;
  accent: string;
  invert?: boolean;
}) {
  const clamped = Math.max(0, Math.min(120, value));
  const percent = Math.max(0, Math.min(100, invert ? 100 - clamped : clamped));
  return (
    <div>
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span>
          {invert
            ? `${100 - Math.min(100, clamped)}`
            : Math.min(100, Math.round(clamped))}
          %
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
        <div
          className={cn("h-1.5 rounded-full", accent)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
