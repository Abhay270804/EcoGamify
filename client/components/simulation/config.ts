import {
  type SimulationAction,
  type WeatherCondition,
  type Season,
  type SimulationTile,
  type GameMode,
  type RegionDefinition,
  type GameModeId,
  type RegionId,
  type ResourceState,
  type DisasterDefinition,
  type DisasterContext,
  type SimulationChallenge,
} from "./types";

export const BASE_RESOURCE_TEMPLATE: ResourceState = {
  forest: 68,
  water: 72,
  energy: 58,
  airQuality: 64,
  economy: 60,
  happiness: 66,
  wildlife: 62,
};

export const ACTIONS: Array<{
  id: SimulationAction;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "plant",
    label: "Reforest",
    icon: "🌱",
    description:
      "Convert degraded tiles into thriving forests to raise air quality and stabilize rainfall.",
  },
  {
    id: "clean",
    label: "Decontaminate",
    icon: "🧹",
    description:
      "Remove industrial waste and smog, restoring soil health and community trust.",
  },
  {
    id: "solar",
    label: "Deploy Solar",
    icon: "🔋",
    description:
      "Install renewable microgrids to power homes and bolster economic resilience.",
  },
  {
    id: "wetland",
    label: "Restore Wetlands",
    icon: "🪴",
    description:
      "Rebuild natural flood barriers that recharge groundwater and shelter wildlife.",
  },
];

export const WEATHER_OPTIONS: WeatherCondition[] = [
  {
    id: "sunny",
    label: "Sunny",
    description: "Solar generation rises while soils dry slightly.",
    icon: "☀️",
  },
  {
    id: "rainy",
    label: "Rainy",
    description: "Reservoirs swell and pollution is diluted.",
    icon: "🌧️",
  },
  {
    id: "storm",
    label: "Storm",
    description: "Urban centers take damage; wetlands act as buffers.",
    icon: "⛈️",
  },
  {
    id: "drought",
    label: "Drought",
    description: "Water tables fall and crops wither if unchecked.",
    icon: "🌵",
  },
  {
    id: "breezy",
    label: "Windy",
    description: "Pollutants disperse while turbines hum to life.",
    icon: "🌬️",
  },
  {
    id: "heatwave",
    label: "Heatwave",
    description: "Energy demand spikes and ecosystems face stress.",
    icon: "🔥",
  },
  {
    id: "blizzard",
    label: "Blizzard",
    description: "Severe cold grips the region; infrastructure strains.",
    icon: "❄️",
  },
];

export const SEASONS: Season[] = [
  {
    id: "spring",
    label: "Spring",
    icon: "🌼",
    description: "Growth season: forests bloom and rivers swell.",
    lengthDays: 18,
  },
  {
    id: "summer",
    label: "Summer",
    icon: "🌞",
    description: "Heat rises. Manage drought risk carefully.",
    lengthDays: 18,
  },
  {
    id: "autumn",
    label: "Autumn",
    icon: "🍂",
    description: "Harvest time with stronger storms.",
    lengthDays: 18,
  },
  {
    id: "winter",
    label: "Winter",
    icon: "❄️",
    description: "Cold weather slows growth yet replenishes snowpack.",
    lengthDays: 18,
  },
];

export const BASELINE_TILES: SimulationTile[] = [
  {
    id: "tile-1",
    type: "forest",
    health: 82,
    pollution: 12,
    energy: 5,
    biodiversity: 78,
  },
  {
    id: "tile-2",
    type: "urban",
    health: 58,
    pollution: 48,
    energy: 12,
    biodiversity: 24,
  },
  {
    id: "tile-3",
    type: "polluted",
    health: 40,
    pollution: 72,
    energy: 6,
    biodiversity: 16,
  },
  {
    id: "tile-4",
    type: "water",
    health: 75,
    pollution: 20,
    energy: 4,
    biodiversity: 54,
  },
  {
    id: "tile-5",
    type: "forest",
    health: 84,
    pollution: 10,
    energy: 5,
    biodiversity: 80,
  },
  {
    id: "tile-6",
    type: "urban",
    health: 62,
    pollution: 55,
    energy: 18,
    biodiversity: 18,
  },
  {
    id: "tile-7",
    type: "wildflower",
    health: 88,
    pollution: 8,
    energy: 4,
    biodiversity: 86,
  },
  {
    id: "tile-8",
    type: "polluted",
    health: 42,
    pollution: 68,
    energy: 6,
    biodiversity: 18,
  },
  {
    id: "tile-9",
    type: "wetland",
    health: 76,
    pollution: 22,
    energy: 3,
    biodiversity: 72,
  },
  {
    id: "tile-10",
    type: "urban",
    health: 55,
    pollution: 58,
    energy: 22,
    biodiversity: 20,
  },
  {
    id: "tile-11",
    type: "solar",
    health: 70,
    pollution: 18,
    energy: 65,
    biodiversity: 32,
  },
  {
    id: "tile-12",
    type: "forest",
    health: 86,
    pollution: 11,
    energy: 8,
    biodiversity: 84,
  },
  {
    id: "tile-13",
    type: "water",
    health: 74,
    pollution: 16,
    energy: 4,
    biodiversity: 58,
  },
  {
    id: "tile-14",
    type: "polluted",
    health: 38,
    pollution: 74,
    energy: 5,
    biodiversity: 14,
  },
  {
    id: "tile-15",
    type: "wildflower",
    health: 90,
    pollution: 6,
    energy: 4,
    biodiversity: 90,
  },
  {
    id: "tile-16",
    type: "urban",
    health: 60,
    pollution: 53,
    energy: 18,
    biodiversity: 22,
  },
  {
    id: "tile-17",
    type: "farmland",
    health: 72,
    pollution: 25,
    energy: 14,
    biodiversity: 48,
  },
  {
    id: "tile-18",
    type: "farmland",
    health: 68,
    pollution: 18,
    energy: 10,
    biodiversity: 44,
  },
];

export const REGION_TILE_TRANSFORMS: Record<
  RegionId,
  (tiles: SimulationTile[]) => void
> = {
  coastal: (tiles) => {
    tiles[2] = {
      ...tiles[2],
      type: "wetland",
      pollution: 42,
      biodiversity: 56,
    };
    tiles[3] = { ...tiles[3], type: "water", health: 78 };
    tiles[9] = { ...tiles[9], type: "water", health: 70 };
    tiles[13] = { ...tiles[13], health: 78 };
  },
  desert: (tiles) => {
    tiles[3] = { ...tiles[3], type: "polluted", health: 32, pollution: 82 };
    tiles[4] = { ...tiles[4], type: "farmland", health: 55, biodiversity: 32 };
    tiles[8] = { ...tiles[8], health: 35, pollution: 82 };
    tiles[12] = { ...tiles[12], health: 70, biodiversity: 64 };
    tiles[13] = { ...tiles[13], type: "polluted", health: 44, pollution: 80 };
  },
  forest: (tiles) => {
    tiles[1] = { ...tiles[1], type: "forest", health: 88, biodiversity: 82 };
    tiles[5] = { ...tiles[5], health: 92, biodiversity: 88 };
    tiles[7] = { ...tiles[7], biodiversity: 92 };
    tiles[8] = {
      ...tiles[8],
      type: "forest",
      health: 70,
      pollution: 28,
      biodiversity: 76,
    };
    tiles[10] = { ...tiles[10], pollution: 42 };
  },
  arctic: (tiles) => {
    tiles[0] = { ...tiles[0], type: "wetland", health: 74, biodiversity: 62 };
    tiles[4] = { ...tiles[4], type: "solar", energy: 70, health: 68 };
    tiles[6] = { ...tiles[6], type: "water", health: 80 };
    tiles[13] = { ...tiles[13], type: "water", health: 82 };
    tiles[15] = { ...tiles[15], type: "solar", energy: 72, biodiversity: 44 };
  },
};

export const GAME_MODES: GameMode[] = [
  {
    id: "campaign",
    name: "Campaign",
    tagline: "Lead a civilization from village to global stewardship.",
    description:
      "Story-driven mode with balanced resources and escalating challenges across the decades.",
    modifiers: {
      resourceBias: 6,
      disasterIntensity: 1,
      co2Trend: 1.6,
      moraleBonus: 8,
    },
  },
  {
    id: "survival",
    name: "Survival",
    tagline: "Endure relentless climate shocks and scarce supplies.",
    description:
      "Lean resources, harsher weather swings, and frequent disasters test your adaptability.",
    modifiers: {
      resourceBias: -8,
      disasterIntensity: 1.4,
      co2Trend: 2.2,
      moraleBonus: -4,
    },
  },
  {
    id: "multiplayer",
    name: "Humans vs Nature",
    tagline: "Balance cooperation and competition on a shared planet.",
    description:
      "Model the push and pull between human ambition and natural resilience with dynamic event swings.",
    modifiers: {
      resourceBias: 0,
      disasterIntensity: 1.2,
      co2Trend: 1.9,
      moraleBonus: 4,
    },
  },
];

export const REGIONS: RegionDefinition[] = [
  {
    id: "coastal",
    name: "Coastal Delta",
    description:
      "Low-lying delta city juggling fisheries, mangroves, and rising seas.",
    biome: "Estuary",
    strengths: ["Abundant water access", "Thriving blue economy"],
    vulnerabilities: ["Storm surges", "Saltwater intrusion"],
    startingResources: {
      water: 78,
      economy: 64,
      forest: 62,
      happiness: 68,
    },
    climateBias: {
      storm: 0.9,
      rainy: 0.4,
      drought: -0.2,
    },
  },
  {
    id: "desert",
    name: "Desert Frontier",
    description:
      "An arid eco-city battling heatwaves and sand-choked infrastructure.",
    biome: "Arid Plateau",
    strengths: ["Untapped solar potential", "Rapid innovation"],
    vulnerabilities: ["Water scarcity", "Dust storms"],
    startingResources: {
      water: 48,
      energy: 66,
      airQuality: 54,
      wildlife: 44,
    },
    climateBias: {
      drought: 1.1,
      heatwave: 0.9,
      rainy: -0.3,
    },
  },
  {
    id: "forest",
    name: "Rainforest Alliance",
    description: "Cooperative villages safeguarding biodiversity hotspots.",
    biome: "Tropical Forest",
    strengths: ["High biodiversity", "Carbon sinks"],
    vulnerabilities: ["Illegal logging", "Monsoon floods"],
    startingResources: {
      forest: 82,
      wildlife: 78,
      airQuality: 74,
      economy: 56,
    },
    climateBias: {
      rainy: 0.8,
      storm: 0.5,
      heatwave: 0.2,
    },
  },
  {
    id: "arctic",
    name: "Arctic Research Network",
    description:
      "Floating communities stabilizing permafrost and polar ecosystems.",
    biome: "Polar Coastal",
    strengths: ["Cold energy storage", "Scientific breakthroughs"],
    vulnerabilities: ["Ice melt", "Blizzards"],
    startingResources: {
      water: 76,
      energy: 64,
      airQuality: 70,
      economy: 58,
    },
    climateBias: {
      blizzard: 0.9,
      storm: 0.4,
      heatwave: -0.3,
    },
  },
];

export const MISSION_TEMPLATES: Array<{
  id: string;
  description: string;
  type: SimulationChallenge["type"];
  target: number;
  reward: number;
}> = [
  {
    id: "reforest",
    description:
      "Plant trees across three degraded tiles to restore canopy cover.",
    type: "plant",
    target: 3,
    reward: 140,
  },
  {
    id: "clean-river",
    description: "Decontaminate two polluted zones before the monsoon arrives.",
    type: "clean",
    target: 2,
    reward: 130,
  },
  {
    id: "solar-grid",
    description: "Deploy solar on two districts to avert rolling blackouts.",
    type: "solar",
    target: 2,
    reward: 160,
  },
  {
    id: "wetland-guard",
    description: "Restore wetlands in two floodplains to buffer storm surges.",
    type: "wetland",
    target: 2,
    reward: 150,
  },
];

export const DISASTER_DECK: DisasterDefinition[] = [
  {
    id: "flood",
    name: "Flood Alert",
    icon: "🌊",
    description:
      "Torrential rains threaten to overflow riverbanks and lowlands.",
    triggerWeight: ({ resources, regionId, co2ppm }) => {
      let weight =
        4 + (100 - resources.forest) * 0.02 + (resources.water - 55) * 0.04;
      if (regionId === "coastal") weight += 4;
      if (co2ppm > 450) weight += 3;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "levees",
        label: "Build Levees",
        description: "Invest in defensive walls and smart drainage systems.",
        impact: "Infrastructure holds back the surge but drains your treasury.",
        effects: {
          resources: { economy: -6, water: +6, airQuality: +2, happiness: -2 },
          scoreboard: { resilience: +6 },
        },
      },
      {
        id: "evacuate",
        label: "Evacuate Districts",
        description:
          "Relocate citizens temporarily and provide relief shelters.",
        impact: "Lives are saved yet economic activity slows.",
        effects: {
          resources: { happiness: -4, economy: -4, airQuality: +3 },
          scoreboard: { resilience: +4, happiness: -2 },
        },
      },
      {
        id: "trust-nature",
        label: "Trust Wetlands",
        description:
          "Allow mangroves and restored wetlands to absorb the flood.",
        impact: "Natural buffers help but some neighborhoods are soaked.",
        effects: {
          resources: { forest: +2, wildlife: +4, economy: -2, happiness: -3 },
          scoreboard: { sustainability: +4, resilience: +2 },
        },
      },
    ],
  },
  {
    id: "wildfire",
    name: "Wildfire Outbreak",
    icon: "🔥",
    description: "Dry underbrush and heat spark blazes near settlements.",
    triggerWeight: ({ resources, regionId, co2ppm }) => {
      let weight = 3 + (100 - resources.water) * 0.03 + (co2ppm - 420) * 0.02;
      if (regionId === "forest") weight += 3;
      if (resources.forest > 75) weight += 2;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "firefighters",
        label: "Deploy Firefighters",
        description: "Send crews and drones to contain the blaze.",
        impact: "The blaze slows at the cost of budget and energy.",
        effects: {
          resources: { economy: -5, energy: -4, forest: -3, wildlife: -2 },
          scoreboard: { resilience: +5 },
        },
      },
      {
        id: "controlled-burn",
        label: "Controlled Burn",
        description: "Clear firebreaks and burn fuel in a managed ring.",
        impact: "Short-term loss leads to future safety gains.",
        effects: {
          resources: { forest: -4, airQuality: -6, wildlife: -3 },
          scoreboard: { sustainability: +5, resilience: +3 },
        },
      },
      {
        id: "let-it-burn",
        label: "Let Nature Rebalance",
        description: "Evacuate and let the ecosystem reset naturally.",
        impact: "Massive blaze reduces canopy but regenerates nutrients later.",
        effects: {
          resources: { forest: -10, wildlife: -8, airQuality: -8, economy: -4 },
          scoreboard: { sustainability: -6, happiness: -4 },
        },
      },
    ],
  },
  {
    id: "hurricane",
    name: "Hurricane Spiral",
    icon: "🌀",
    description: "Warm seas energize a cyclone racing toward populated coasts.",
    triggerWeight: ({ regionId, co2ppm }) => {
      let weight = 2 + (co2ppm - 400) * 0.015;
      if (regionId === "coastal") weight += 6;
      if (regionId === "arctic") weight += 1;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "reinforce",
        label: "Fortify Infrastructure",
        description: "Upgrade sea walls, microgrids, and emergency comms.",
        impact: "High upfront cost but communities withstand the storm.",
        effects: {
          resources: { economy: -7, energy: -3, happiness: -1 },
          scoreboard: { resilience: +7 },
        },
      },
      {
        id: "mass-evacuate",
        label: "Mass Evacuation",
        description: "Move citizens inland with rapid transport corridors.",
        impact: "Lives protected though livelihoods pause.",
        effects: {
          resources: { happiness: -5, economy: -5, airQuality: +4 },
          scoreboard: { resilience: +5 },
        },
      },
      {
        id: "ride-storm",
        label: "Ride Out the Storm",
        description: "Prioritize economy, risking deeper damage.",
        impact: "Trade continues but devastation follows.",
        effects: {
          resources: { economy: +2, happiness: -6, forest: -5, wildlife: -4 },
          scoreboard: { resilience: -6, sustainability: -4 },
        },
      },
    ],
  },
  {
    id: "volcano",
    name: "Volcanic Tremors",
    icon: "🌋",
    description: "A dormant volcano rumbles, threatening nearby settlements.",
    triggerWeight: ({ regionId }) => {
      let weight = regionId === "arctic" ? 1 : 2;
      if (regionId === "desert") weight += 1;
      return weight;
    },
    choices: [
      {
        id: "evacuate",
        label: "Evacuate Zones",
        description:
          "Move populations away and plan for prolonged displacement.",
        impact: "Safety first but morale dips as communities scatter.",
        effects: {
          resources: { happiness: -6, economy: -5 },
          scoreboard: { resilience: +4 },
        },
      },
      {
        id: "reinforce",
        label: "Reinforce and Monitor",
        description:
          "Invest in monitoring, buttress roofs, and lava diversions.",
        impact: "Expensive engineering lessens long-term damage.",
        effects: {
          resources: { economy: -7, airQuality: -3 },
          scoreboard: { resilience: +5, sustainability: +2 },
        },
      },
      {
        id: "accept",
        label: "Accept Eruption",
        description: "Stand aside and plan for fertile soils afterward.",
        impact: "Short-term destruction for future agricultural gains.",
        effects: {
          resources: { forest: -4, wildlife: -6, airQuality: -8, economy: -4 },
          scoreboard: { sustainability: -4 },
        },
      },
    ],
  },
  {
    id: "heatwave",
    name: "Mega Heatwave",
    icon: "🌡️",
    description: "Extreme temperatures threaten the grid and human health.",
    triggerWeight: ({ resources, regionId, co2ppm }) => {
      let weight =
        4 + (co2ppm - 410) * 0.02 + (100 - resources.airQuality) * 0.02;
      if (regionId === "desert") weight += 4;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "cooling-centers",
        label: "Cooling Centers",
        description: "Open public cooling shelters with medical teams.",
        impact: "Citizens feel safe though energy reserves dip.",
        effects: {
          resources: { energy: -6, happiness: +4, economy: -2 },
          scoreboard: { happiness: +6 },
        },
      },
      {
        id: "ration",
        label: "Ration Power",
        description: "Implement rolling outages and water rationing.",
        impact: "Grid stability improves while morale suffers.",
        effects: {
          resources: { energy: +4, happiness: -6, economy: -3 },
          scoreboard: { resilience: +3, happiness: -5 },
        },
      },
      {
        id: "ignore",
        label: "Business as Usual",
        description: "Keep economy running, accepting health impacts.",
        impact: "Profits rise briefly as wellbeing plunges.",
        effects: {
          resources: { economy: +3, happiness: -8, airQuality: -5 },
          scoreboard: { happiness: -7, sustainability: -3 },
        },
      },
    ],
  },
  {
    id: "blizzard",
    name: "Polar Vortex",
    icon: "🌨️",
    description: "An Arctic blast locks cities in ice and snow.",
    triggerWeight: ({ regionId, co2ppm }) => {
      let weight = regionId === "arctic" ? 5 : 2;
      if (co2ppm > 440) weight += 1;
      return weight;
    },
    choices: [
      {
        id: "heating",
        label: "Subsidize Heating",
        description: "Provide clean heating credits and insulation kits.",
        impact: "Citizens stay safe but reserves shrink.",
        effects: {
          resources: { economy: -4, energy: -5, happiness: +3 },
          scoreboard: { happiness: +4 },
        },
      },
      {
        id: "shutdown",
        label: "Emergency Shutdown",
        description: "Close schools and factories to reduce exposure.",
        impact: "Less strain on services but economy cools.",
        effects: {
          resources: { economy: -5, energy: +2, happiness: -3 },
          scoreboard: { resilience: +2 },
        },
      },
      {
        id: "status-quo",
        label: "Hold the Line",
        description: "Maintain operations, risking accidents and illness.",
        impact: "Short-term productivity leads to human costs.",
        effects: {
          resources: { happiness: -6, economy: +2, airQuality: -2 },
          scoreboard: { happiness: -5 },
        },
      },
    ],
  },
  {
    id: "disease",
    name: "Vector Outbreak",
    icon: "🦟",
    description: "Floods and heatwaves boost mosquito-borne illness.",
    triggerWeight: ({ resources, co2ppm }) => {
      let weight =
        3 + (100 - resources.airQuality) * 0.02 + (co2ppm - 415) * 0.02;
      if (resources.water > 75) weight += 2;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "hospitals",
        label: "Fund Hospitals",
        description: "Boost clinics, medication, and rapid testing.",
        impact: "Public health stabilizes while coffers shrink.",
        effects: {
          resources: { economy: -4, happiness: +5 },
          scoreboard: { happiness: +4, resilience: +3 },
        },
      },
      {
        id: "vaccinate",
        label: "Vaccination Drive",
        description: "Mass vaccination and education campaigns roll out.",
        impact: "High upfront cost but long-term immunity.",
        effects: {
          resources: { economy: -6, happiness: +3, airQuality: +2 },
          scoreboard: { sustainability: +2, resilience: +4 },
        },
      },
      {
        id: "ignore",
        label: "Wait and See",
        description: "Hope the outbreak fizzles without major action.",
        impact: "Illness spreads, eroding trust and workforce.",
        effects: {
          resources: { happiness: -8, economy: -6, wildlife: -3 },
          scoreboard: { happiness: -6, resilience: -4 },
        },
      },
    ],
  },
  {
    id: "drought",
    name: "Prolonged Drought",
    icon: "🏜️",
    description: "Reservoirs recede and crops face failure.",
    triggerWeight: ({ resources, regionId, co2ppm }) => {
      let weight = 4 + (100 - resources.water) * 0.05 + (co2ppm - 410) * 0.03;
      if (regionId === "desert") weight += 5;
      return Math.max(weight, 0.5);
    },
    choices: [
      {
        id: "reservoirs",
        label: "Build Reservoirs",
        description: "Construct capture systems and desalination plants.",
        impact: "Expensive infrastructure locks in future supply.",
        effects: {
          resources: { economy: -7, water: +10, energy: -3 },
          scoreboard: { resilience: +6, sustainability: +3 },
        },
      },
      {
        id: "import",
        label: "Import Water",
        description: "Purchase water credits and trade for relief.",
        impact: "Budget strains but crops survive the season.",
        effects: {
          resources: { economy: -5, water: +6, happiness: -2 },
          scoreboard: { resilience: +4 },
        },
      },
      {
        id: "tighten",
        label: "Strict Rationing",
        description: "Mandate reductions, risking unrest.",
        impact: "Supplies stretch while morale dips.",
        effects: {
          resources: { water: +4, economy: -2, happiness: -5 },
          scoreboard: { resilience: +2, happiness: -4 },
        },
      },
    ],
  },
  {
    id: "earthquake",
    name: "Seismic Shock",
    icon: "🌎",
    description: "Tectonic plates shift beneath critical infrastructure.",
    triggerWeight: () => 2.5,
    choices: [
      {
        id: "codes",
        label: "Upgrade Building Codes",
        description: "Retrofitting program reduces future casualties.",
        impact: "High cost today for resilience tomorrow.",
        effects: {
          resources: { economy: -6, happiness: -2 },
          scoreboard: { resilience: +7 },
        },
      },
      {
        id: "aid",
        label: "Rapid Aid",
        description: "Focus on immediate relief and rebuilding grants.",
        impact: "Communities feel supported though budgets shrink.",
        effects: {
          resources: { economy: -4, happiness: +2 },
          scoreboard: { resilience: +3, happiness: +2 },
        },
      },
      {
        id: "minimal",
        label: "Minimal Response",
        description: "Stabilize only the most critical systems.",
        impact: "Short-term savings increase long-term risk.",
        effects: {
          resources: { economy: +1, happiness: -5, airQuality: -2 },
          scoreboard: { resilience: -4 },
        },
      },
    ],
  },
  {
    id: "climate-shift",
    name: "Global Climate Summit",
    icon: "🕊️",
    description: "Earth passes a new CO₂ threshold. The world gathers to act.",
    triggerWeight: ({ co2ppm, year }) => {
      if (co2ppm < 430 && year < 2080) return 0.5;
      return 4 + (co2ppm - 430) * 0.04 + (year - 2080) * 0.03;
    },
    choices: [
      {
        id: "treaty",
        label: "Sign Climate Treaty",
        description: "Commit to steep emission cuts and share green tech.",
        impact: "Economic slowdown now, stability later.",
        effects: {
          resources: { economy: -6, energy: +4, happiness: +2 },
          scoreboard: { sustainability: +8, resilience: +4, happiness: +2 },
          co2Delta: -6,
        },
      },
      {
        id: "innovate",
        label: "Fund Radical Innovation",
        description: "Invest in carbon capture, fusion, and AI farming.",
        impact: "Huge investment unlocks breakthrough technology.",
        effects: {
          resources: { economy: -8, energy: +8, forest: +4, wildlife: +4 },
          scoreboard: { sustainability: +6, resilience: +6 },
          co2Delta: -8,
        },
      },
      {
        id: "delay",
        label: "Delay Commitments",
        description: "Prioritize domestic growth over global action.",
        impact: "Short-term boom, long-term climate risk spikes.",
        effects: {
          resources: { economy: +4, airQuality: -6, happiness: -4 },
          scoreboard: { sustainability: -8, resilience: -6 },
          co2Delta: +6,
        },
      },
    ],
  },
];

export function getModeById(id: GameModeId): GameMode {
  return GAME_MODES.find((mode) => mode.id === id) ?? GAME_MODES[0];
}

export function getRegionById(id: RegionId): RegionDefinition {
  return REGIONS.find((region) => region.id === id) ?? REGIONS[0];
}

export function createTilesForRegion(regionId: RegionId): SimulationTile[] {
  const tiles = BASELINE_TILES.map((tile) => ({ ...tile }));
  REGION_TILE_TRANSFORMS[regionId](tiles);
  return tiles;
}

export function createStartingResources(
  mode: GameMode,
  region: RegionDefinition,
): ResourceState {
  const base = { ...BASE_RESOURCE_TEMPLATE };
  for (const key of Object.keys(region.startingResources) as Array<
    keyof ResourceState
  >) {
    base[key] = clamp(
      (region.startingResources[key] ?? base[key]) +
        mode.modifiers.resourceBias,
    );
  }
  base.happiness = clamp(base.happiness + mode.modifiers.moraleBonus);
  base.economy = clamp(base.economy + mode.modifiers.resourceBias * 0.8);
  return base;
}

export function generateMission(): SimulationChallenge {
  const template =
    MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
  return {
    id: `${template.id}-${Date.now()}`,
    description: template.description,
    type: template.type,
    target: template.target,
    reward: template.reward,
    progress: 0,
    completed: false,
  };
}

export function selectDisaster(
  context: DisasterContext,
  intensityMultiplier: number,
): DisasterDefinition {
  const weighted: Array<{ weight: number; event: DisasterDefinition }> = [];
  let total = 0;
  for (const event of DISASTER_DECK) {
    const weight =
      Math.max(0, event.triggerWeight(context) * intensityMultiplier) || 0;
    if (weight <= 0) continue;
    weighted.push({ weight, event });
    total += weight;
  }
  if (!weighted.length) {
    return DISASTER_DECK[0];
  }
  let threshold = Math.random() * total;
  for (const { weight, event } of weighted) {
    threshold -= weight;
    if (threshold <= 0) return event;
  }
  return weighted[weighted.length - 1].event;
}

export function mergeClimateBias(
  region: RegionDefinition,
): Partial<Record<WeatherCondition["id"], number>> {
  return region.climateBias;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}
