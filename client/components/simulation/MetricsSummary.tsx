import type { ResourceState } from "./types";

export function MetricsSummary({
  ecoHealth,
  pollutionIndex,
  biodiversity,
  energyOutput,
  resources,
}: {
  ecoHealth: number;
  pollutionIndex: number;
  biodiversity: number;
  energyOutput: number;
  resources: ResourceState;
}) {
  const rounded = {
    forest: Math.round(resources.forest),
    water: Math.round(resources.water),
    energy: Math.round(resources.energy),
    airQuality: Math.round(resources.airQuality),
    economy: Math.round(resources.economy),
    happiness: Math.round(resources.happiness),
    wildlife: Math.round(resources.wildlife),
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Eco Health"
        value={`${Math.round(ecoHealth)}%`}
        caption="Overall vitality of your region"
        accent="bg-emerald-500/20 text-emerald-700"
      />
      <MetricCard
        title="Pollution Index"
        value={`${Math.max(0, Math.round(pollutionIndex))}`}
        caption="Lower is cleaner"
        accent="bg-rose-500/20 text-rose-700"
      />
      <MetricCard
        title="Biodiversity"
        value={`${Math.round(biodiversity)}%`}
        caption="Habitats supported"
        accent="bg-lime-500/20 text-lime-700"
      />
      <MetricCard
        title="Water Security"
        value={`${rounded.water}%`}
        caption="Reservoirs, rainfall and aquifers"
        accent="bg-sky-500/20 text-sky-700"
      />
      <MetricCard
        title="Clean Energy"
        value={`${rounded.energy}%`}
        caption={`≈ ${Math.round(energyOutput)} MW of reliable power`}
        accent="bg-amber-500/20 text-amber-700"
      />
      <MetricCard
        title="Air Quality"
        value={`${rounded.airQuality}%`}
        caption="Smog control and breathable air"
        accent="bg-cyan-500/20 text-cyan-700"
      />
      <MetricCard
        title="Forest Health"
        value={`${rounded.forest}%`}
        caption="Canopy cover and carbon sinks"
        accent="bg-emerald-500/20 text-emerald-700"
      />
      <MetricCard
        title="Green Economy"
        value={`${rounded.economy}%`}
        caption="Circular industries and prosperity"
        accent="bg-lime-500/20 text-lime-700"
      />
      <MetricCard
        title="Citizen Happiness"
        value={`${rounded.happiness}%`}
        caption="Public trust and wellbeing"
        accent="bg-pink-500/20 text-pink-700"
      />
      <MetricCard
        title="Wildlife"
        value={`${rounded.wildlife}%`}
        caption="Keystone species and biodiversity"
        accent="bg-purple-500/20 text-purple-700"
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  caption,
  accent,
}: {
  title: string;
  value: string;
  caption: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border bg-white/80 p-4 shadow-sm">
      <div
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${accent}`}
      >
        {title}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      <p className="mt-1 text-xs text-foreground/70">{caption}</p>
    </div>
  );
}
