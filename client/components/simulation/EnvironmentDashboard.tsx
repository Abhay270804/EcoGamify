import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ResourceState, ScoreboardState } from "./types";

const RESOURCE_CONFIG: Array<{
  id: keyof ResourceState;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "forest",
    label: "Forest Health",
    icon: "🌳",
    description: "Old-growth canopy, mangroves, and carbon sinks.",
  },
  {
    id: "water",
    label: "Water Security",
    icon: "💧",
    description: "Reservoir levels, rainfall stability, and aquifers.",
  },
  {
    id: "energy",
    label: "Energy Grid",
    icon: "⚡",
    description: "Clean generation capacity and redundancy across grids.",
  },
  {
    id: "happiness",
    label: "Citizen Happiness",
    icon: "😊",
    description: "Public trust, wellbeing, and quality of life.",
  },
  {
    id: "airQuality",
    label: "Air Quality",
    icon: "🌬️",
    description: "Particulate matter, smog, and breathable air levels.",
  },
  {
    id: "economy",
    label: "Green Economy",
    icon: "💰",
    description: "Circular industries, jobs, and equitable prosperity.",
  },
  {
    id: "wildlife",
    label: "Wildlife",
    icon: "🦋",
    description: "Biodiversity corridors and keystone species health.",
  },
];

const RESOURCE_BADGE_STYLES: Record<keyof ResourceState, string> = {
  forest: "bg-emerald-100 text-emerald-700",
  water: "bg-sky-100 text-sky-700",
  energy: "bg-amber-100 text-amber-700",
  happiness: "bg-pink-100 text-pink-700",
  airQuality: "bg-cyan-100 text-cyan-700",
  economy: "bg-lime-100 text-lime-700",
  wildlife: "bg-purple-100 text-purple-700",
};

const SCOREBOARD_CONFIG: Array<{
  id: keyof ScoreboardState;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "sustainability",
    label: "Sustainability Index",
    icon: "🌍",
    description: "Ecological balance, emissions, and regenerative systems.",
  },
  {
    id: "happiness",
    label: "Happiness Index",
    icon: "🌈",
    description: "Citizen wellbeing, trust, and cultural vitality.",
  },
  {
    id: "resilience",
    label: "Resilience Index",
    icon: "🛡️",
    description: "Infrastructure durability and disaster preparedness.",
  },
];

const CO2_THRESHOLDS = [
  { max: 450, label: "Stable", className: "bg-emerald-100 text-emerald-700" },
  { max: 500, label: "Elevated", className: "bg-amber-100 text-amber-700" },
  { max: Number.POSITIVE_INFINITY, label: "Critical", className: "bg-rose-100 text-rose-700" },
];

export function EnvironmentDashboard({
  resources,
  co2ppm,
}: {
  resources: ResourceState;
  co2ppm: number;
}) {
  const co2Status = getCo2Status(co2ppm);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span>CO₂ Concentration</span>
          </CardTitle>
          <CardDescription>
            Atmospheric carbon drives disaster frequency and climate tipping points.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold tracking-tight">
              {Math.round(co2ppm)} ppm
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                co2Status.className,
              )}
            >
              {co2Status.label}
            </span>
          </div>
          <Progress value={normalizeCo2(co2ppm)} className="h-2" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Keeping CO₂ under 450 ppm prevents irreversible warming. Each sustainable action sequesters carbon; fossil-heavy choices push the planet toward collapse.
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {RESOURCE_CONFIG.map((metric) => {
          const value = clampPercent(resources[metric.id]);
          return (
            <Card key={metric.id} className="bg-white/90">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <span>{metric.icon}</span>
                    <span>{metric.label}</span>
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                      RESOURCE_BADGE_STYLES[metric.id],
                    )}
                  >
                    {value}%
                  </span>
                </div>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={value} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ScoreboardPanel({
  scoreboard,
}: {
  scoreboard: ScoreboardState;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <span>Global Outcome Indices</span>
        </CardTitle>
        <CardDescription>
          Sustain these three indices through 2100 to achieve a green future.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {SCOREBOARD_CONFIG.map((metric) => {
          const value = clampPercent(scoreboard[metric.id]);
          const mood = getScoreMood(value);
          return (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{metric.icon}</span>
                  <span>{metric.label}</span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                    mood.className,
                  )}
                >
                  {mood.label}
                </span>
              </div>
              <Progress value={value} className="h-2" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function normalizeCo2(ppm: number) {
  return clampPercent(((ppm - 360) / (520 - 360)) * 100);
}

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getCo2Status(co2ppm: number) {
  for (const threshold of CO2_THRESHOLDS) {
    if (co2ppm <= threshold.max) {
      return threshold;
    }
  }
  return CO2_THRESHOLDS[CO2_THRESHOLDS.length - 1];
}

function getScoreMood(value: number) {
  if (value >= 70) {
    return { label: "Stable", className: "bg-emerald-100 text-emerald-700" };
  }
  if (value >= 45) {
    return { label: "Watch", className: "bg-amber-100 text-amber-700" };
  }
  return { label: "Critical", className: "bg-rose-100 text-rose-700" };
}
