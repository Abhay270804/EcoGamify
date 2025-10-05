export type TileType =
  | "forest"
  | "wetland"
  | "urban"
  | "solar"
  | "water"
  | "polluted"
  | "wildflower"
  | "farmland";

export type SimulationTile = {
  id: string;
  type: TileType;
  health: number;
  pollution: number;
  energy: number;
  biodiversity: number;
};

export type SimulationAction = "plant" | "clean" | "solar" | "wetland";

export type ChallengeType = "plant" | "clean" | "solar" | "wetland";

export type SimulationChallenge = {
  id: string;
  description: string;
  type: ChallengeType;
  target: number;
  progress: number;
  reward: number;
  completed: boolean;
};

export type WeatherId =
  | "sunny"
  | "rainy"
  | "storm"
  | "drought"
  | "breezy"
  | "heatwave"
  | "blizzard";

export type WeatherCondition = {
  id: WeatherId;
  label: string;
  description: string;
  icon: string;
};

export type SeasonId = "spring" | "summer" | "autumn" | "winter";

export type Season = {
  id: SeasonId;
  label: string;
  icon: string;
  description: string;
  lengthDays: number;
};

export type ResourceState = {
  forest: number;
  water: number;
  energy: number;
  airQuality: number;
  economy: number;
  happiness: number;
  wildlife: number;
};

export type ScoreboardState = {
  sustainability: number;
  happiness: number;
  resilience: number;
};

export type GamePhase = "plan" | "weather" | "disaster" | "adapt" | "evaluate";

export type GameModeId = "campaign" | "survival" | "multiplayer";

export type RegionId = "coastal" | "desert" | "forest" | "arctic";

export type GameMode = {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  modifiers: {
    resourceBias: number;
    disasterIntensity: number;
    co2Trend: number;
    moraleBonus: number;
  };
};

export type RegionDefinition = {
  id: RegionId;
  name: string;
  description: string;
  biome: string;
  strengths: string[];
  vulnerabilities: string[];
  startingResources: Partial<ResourceState>;
  climateBias: Partial<Record<WeatherId, number>>;
};

export type DisasterId =
  | "flood"
  | "wildfire"
  | "hurricane"
  | "volcano"
  | "heatwave"
  | "blizzard"
  | "disease"
  | "drought"
  | "earthquake"
  | "climate-shift";

export type DisasterChoiceEffect = {
  resources?: Partial<ResourceState>;
  scoreboard?: Partial<ScoreboardState>;
  co2Delta?: number;
};

export type DisasterChoice = {
  id: string;
  label: string;
  description: string;
  impact: string;
  effects: DisasterChoiceEffect;
};

export type DisasterDefinition = {
  id: DisasterId;
  name: string;
  icon: string;
  description: string;
  triggerWeight: (context: DisasterContext) => number;
  choices: DisasterChoice[];
};

export type DisasterContext = {
  resources: ResourceState;
  scoreboard: ScoreboardState;
  co2ppm: number;
  modeId: GameModeId;
  regionId: RegionId;
  year: number;
};
