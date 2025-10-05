import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HOW_TO_PLAY_STEPS, HOW_TO_PLAY_TIPS } from "./how-to-play";
import {
  ACTIONS,
  BASELINE_TILES,
  BASE_RESOURCE_TEMPLATE,
  DISASTER_DECK,
  GAME_MODES,
  MISSION_TEMPLATES,
  REGIONS,
  REGION_TILE_TRANSFORMS,
  SEASONS,
  WEATHER_OPTIONS,
} from "./config";
import { EnvironmentDashboard, ScoreboardPanel } from "./EnvironmentDashboard";
import { TileCard } from "./TileCard";
import type {
  DisasterChoice,
  DisasterChoiceEffect,
  DisasterDefinition,
  GameMode,
  GameModeId,
  GamePhase,
  RegionDefinition,
  RegionId,
  ResourceState,
  ScoreboardState,
  SimulationAction,
  SimulationChallenge,
  SimulationTile,
  WeatherCondition,
  WeatherId,
} from "./types";

const PHASE_FLOW: GamePhase[] = [
  "plan",
  "weather",
  "disaster",
  "adapt",
  "evaluate",
];
const PLAN_ACTIONS_PER_YEAR = 3;
const INITIAL_YEAR = 2080;
const TARGET_YEAR = 2100;
const INITIAL_CO2 = 420;
const MAX_LOG_ENTRIES = 24;

type SimulationStatus = "setup" | "active" | "victory" | "collapse";

type LogEntry = {
  id: string;
  year: number;
  phase: string;
  title: string;
  description: string;
};

type DisasterRuntime = {
  definition: DisasterDefinition;
  resolved: boolean;
  choiceId?: string;
  summary?: string;
};

type EvaluationSummary = {
  outcome: "stable" | "warning" | "critical";
  narrative: string;
  resourceSnapshot: ResourceState;
  scoreboardSnapshot: ScoreboardState;
};

type AdaptationOption = {
  id: string;
  label: string;
  description: string;
  effects: DisasterChoiceEffect;
};

type SimulationRuntime = {
  status: SimulationStatus;
  modeId: GameModeId | null;
  regionId: RegionId | null;
  year: number;
  phase: GamePhase;
  seasonIndex: number;
  planActionsRemaining: number;
  tiles: SimulationTile[];
  selectedAction: SimulationAction;
  resources: ResourceState;
  scoreboard: ScoreboardState;
  co2ppm: number;
  mission: SimulationChallenge | null;
  log: LogEntry[];
  currentWeather: WeatherCondition | null;
  currentDisaster: DisasterRuntime | null;
  adaptationTaken: boolean;
  evaluation?: EvaluationSummary;
};

const SIMULATION_STATE_VERSION = 1;
const SIMULATION_STATE_KEY = "ecogamify_simulation_state_v1";
const SIMULATION_ONBOARDING_KEY = "ecogamify_simulation_onboarding_seen_v1";

type PersistedSimulationPayload = {
  version: number;
  state: SimulationRuntime;
};

function loadPersistedRuntime(): SimulationRuntime | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(SIMULATION_STATE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as PersistedSimulationPayload;
    if (
      !payload ||
      payload.version !== SIMULATION_STATE_VERSION ||
      !isSimulationRuntimeLike(payload.state)
    ) {
      return null;
    }
    return sanitizeRuntime(payload.state);
  } catch {
    return null;
  }
}

function persistRuntime(state: SimulationRuntime) {
  if (typeof window === "undefined") return;
  const payload: PersistedSimulationPayload = {
    version: SIMULATION_STATE_VERSION,
    state: sanitizeRuntime(state),
  };
  window.localStorage.setItem(SIMULATION_STATE_KEY, JSON.stringify(payload));
}

function hasSeenSimulationOnboarding() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(SIMULATION_ONBOARDING_KEY) === "true";
}

function markSimulationOnboardingSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SIMULATION_ONBOARDING_KEY, "true");
}

function sanitizeRuntime(runtime: SimulationRuntime): SimulationRuntime {
  const base = createInitialRuntime();
  const tiles = Array.isArray(runtime.tiles)
    ? runtime.tiles.map((tile) => ({ ...tile }))
    : base.tiles;
  const log = Array.isArray(runtime.log)
    ? runtime.log.slice(-MAX_LOG_ENTRIES)
    : base.log;
  const planActionsRemaining =
    typeof runtime.planActionsRemaining === "number"
      ? Math.max(
          0,
          Math.min(PLAN_ACTIONS_PER_YEAR, runtime.planActionsRemaining),
        )
      : base.planActionsRemaining;
  const seasonIndex =
    typeof runtime.seasonIndex === "number"
      ? Math.max(0, Math.min(SEASONS.length - 1, runtime.seasonIndex))
      : base.seasonIndex;

  return {
    ...base,
    ...runtime,
    tiles,
    log,
    planActionsRemaining,
    seasonIndex,
    mission: runtime.mission ? { ...runtime.mission } : base.mission,
    currentWeather: runtime.currentWeather
      ? { ...runtime.currentWeather }
      : base.currentWeather,
    currentDisaster: runtime.currentDisaster
      ? { ...runtime.currentDisaster }
      : base.currentDisaster,
    evaluation: runtime.evaluation
      ? { ...runtime.evaluation }
      : base.evaluation,
  };
}

function isSimulationRuntimeLike(value: unknown): value is SimulationRuntime {
  if (!value || typeof value !== "object") {
    return false;
  }
  const runtime = value as SimulationRuntime;
  const validStatuses: SimulationStatus[] = [
    "setup",
    "active",
    "victory",
    "collapse",
  ];
  const validPhases = new Set<GamePhase>(PHASE_FLOW);
  if (!validStatuses.includes(runtime.status)) return false;
  if (!validPhases.has(runtime.phase)) return false;
  if (typeof runtime.year !== "number" || typeof runtime.co2ppm !== "number") {
    return false;
  }
  if (
    typeof runtime.planActionsRemaining !== "number" ||
    typeof runtime.seasonIndex !== "number"
  ) {
    return false;
  }
  if (!hasValidTiles(runtime.tiles)) return false;
  if (!hasValidResources(runtime.resources)) return false;
  if (!hasValidScoreboard(runtime.scoreboard)) return false;
  if (!Array.isArray(runtime.log)) return false;
  return true;
}

function hasValidTiles(value: unknown): value is SimulationTile[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (tile) =>
      tile &&
      typeof tile === "object" &&
      typeof (tile as SimulationTile).id === "string" &&
      typeof (tile as SimulationTile).type === "string" &&
      typeof (tile as SimulationTile).health === "number" &&
      typeof (tile as SimulationTile).pollution === "number" &&
      typeof (tile as SimulationTile).energy === "number" &&
      typeof (tile as SimulationTile).biodiversity === "number",
  );
}

function hasValidResources(value: unknown): value is ResourceState {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<keyof ResourceState, unknown>;
  const keys: Array<keyof ResourceState> = [
    "forest",
    "water",
    "energy",
    "airQuality",
    "economy",
    "happiness",
    "wildlife",
  ];
  return keys.every((key) => typeof source[key] === "number");
}

function hasValidScoreboard(value: unknown): value is ScoreboardState {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<keyof ScoreboardState, unknown>;
  const keys: Array<keyof ScoreboardState> = [
    "sustainability",
    "happiness",
    "resilience",
  ];
  return keys.every((key) => typeof source[key] === "number");
}

const ACTION_IMPACTS: Record<
  SimulationAction,
  { effects: DisasterChoiceEffect; narrative: string }
> = {
  plant: {
    effects: {
      resources: {
        forest: +8,
        airQuality: +6,
        water: +3,
        wildlife: +7,
        economy: -2,
      },
      scoreboard: { sustainability: +4, happiness: +2 },
      co2Delta: -4,
    },
    narrative:
      "New forests take root, drawing down carbon and sheltering wildlife.",
  },
  clean: {
    effects: {
      resources: {
        airQuality: +8,
        happiness: +4,
        wildlife: +3,
        economy: -3,
      },
      scoreboard: { sustainability: +3, happiness: +2 },
      co2Delta: -2,
    },
    narrative:
      "Cleanup crews scrub pollutants and restore citizen trust in leadership.",
  },
  solar: {
    effects: {
      resources: {
        energy: +12,
        economy: +4,
        airQuality: +3,
        forest: -2,
        wildlife: -1,
      },
      scoreboard: { resilience: +3, sustainability: +2 },
      co2Delta: -3,
    },
    narrative:
      "Solar microgrids flare to life, easing dependence on fossil fuels.",
  },
  wetland: {
    effects: {
      resources: {
        water: +9,
        wildlife: +6,
        forest: +3,
        economy: -2,
        airQuality: +2,
      },
      scoreboard: { sustainability: +4, resilience: +2 },
      co2Delta: -2,
    },
    narrative:
      "Wetlands expand, buffering floods and nurturing biodiversity corridors.",
  },
};

const WEATHER_EFFECTS: Record<
  WeatherId,
  { summary: string; effects: DisasterChoiceEffect }
> = {
  sunny: {
    summary:
      "Sunny skies boost morale and solar production while soils dry slightly.",
    effects: {
      resources: { energy: +4, happiness: +2, water: -3, wildlife: -1 },
      scoreboard: { happiness: +2, resilience: +1 },
      co2Delta: -1,
    },
  },
  rainy: {
    summary:
      "Steady rainfall refills reservoirs and washes away particulate pollution.",
    effects: {
      resources: { water: +6, forest: +3, wildlife: +2, airQuality: +2 },
      scoreboard: { sustainability: +3 },
      co2Delta: -1,
    },
  },
  storm: {
    summary:
      "Storm bands batter infrastructure and unsettle coastal districts.",
    effects: {
      resources: { economy: -5, energy: -4, happiness: -4, forest: -3 },
      scoreboard: { resilience: -3, happiness: -2 },
    },
  },
  drought: {
    summary: "Persistent drought scorches crops and stresses ecosystems.",
    effects: {
      resources: {
        water: -8,
        forest: -5,
        wildlife: -4,
        happiness: -4,
        economy: -2,
      },
      scoreboard: { sustainability: -4, happiness: -3 },
      co2Delta: +2,
    },
  },
  breezy: {
    summary: "Gusts clear polluted air and spin turbines to life.",
    effects: {
      resources: { airQuality: +5, energy: +3 },
      scoreboard: { sustainability: +2, resilience: +1 },
      co2Delta: -1,
    },
  },
  heatwave: {
    summary: "Extreme heat strains citizens, wildlife, and the power grid.",
    effects: {
      resources: { water: -6, happiness: -6, wildlife: -3, energy: +2 },
      scoreboard: { happiness: -4, resilience: -1 },
      co2Delta: +2,
    },
  },
  blizzard: {
    summary: "An arctic blast forces shutdowns but replenishes snowpack.",
    effects: {
      resources: { economy: -4, energy: -5, happiness: -3, water: +2 },
      scoreboard: { resilience: -2 },
      co2Delta: 0.5,
    },
  },
};

const ADAPTATION_OPTIONS: AdaptationOption[] = [
  {
    id: "resilience",
    label: "Invest in Resilience",
    description:
      "Fortify infrastructure, train rapid response teams, and modernize warning systems.",
    effects: {
      resources: { energy: +4, economy: -3, happiness: +2 },
      scoreboard: { resilience: +6, sustainability: +2 },
      co2Delta: -1,
    },
  },
  {
    id: "innovation",
    label: "Green Innovation Labs",
    description:
      "Fund climate-tech incubators, carbon capture pilots, and agroforestry research.",
    effects: {
      resources: { economy: +4, forest: +4, airQuality: +3, wildlife: +2 },
      scoreboard: { sustainability: +6, resilience: +2 },
      co2Delta: -3,
    },
  },
  {
    id: "community",
    label: "Community Co-ops",
    description:
      "Empower local councils with micro-grants for adaptation, health, and education.",
    effects: {
      resources: { happiness: +6, economy: +2, water: +2 },
      scoreboard: { happiness: +6, sustainability: +2 },
      co2Delta: -0.5,
    },
  },
];

export function SimulationGame() {
  const restoredState = useMemo(() => loadPersistedRuntime(), []);
  const [state, setState] = useState<SimulationRuntime>(
    restoredState ?? createInitialRuntime(),
  );
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const stateRef = useRef(state);

  const handleOpenHowToPlay = useCallback(() => {
    setShowHowToPlay(true);
  }, []);

  const handleDismissHowToPlay = useCallback(() => {
    setShowHowToPlay((prev) => {
      if (prev) {
        markSimulationOnboardingSeen();
      }
      return false;
    });
  }, []);

  useEffect(() => {
    stateRef.current = state;
    persistRuntime(state);
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const persistLatest = () => {
      persistRuntime(stateRef.current);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        persistLatest();
      }
    };
    window.addEventListener("beforeunload", persistLatest);
    window.addEventListener("pagehide", persistLatest);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      persistLatest();
      window.removeEventListener("beforeunload", persistLatest);
      window.removeEventListener("pagehide", persistLatest);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!hasSeenSimulationOnboarding()) {
      setShowHowToPlay(true);
    }
  }, []);

  const hasSavedCampaign = Boolean(
    restoredState && restoredState.status !== "setup",
  );

  const selectedMode = useMemo(
    () =>
      state.modeId
        ? (GAME_MODES.find((mode) => mode.id === state.modeId) ?? null)
        : null,
    [state.modeId],
  );

  const selectedRegion = useMemo(
    () =>
      state.regionId
        ? (REGIONS.find((region) => region.id === state.regionId) ?? null)
        : null,
    [state.regionId],
  );

  const season = SEASONS[state.seasonIndex] ?? SEASONS[0];

  const canTakeAction =
    state.status === "active" &&
    state.phase === "plan" &&
    state.planActionsRemaining > 0;

  function handleModeSelect(modeId: GameModeId) {
    setState((prev) => ({ ...prev, modeId }));
  }

  function handleRegionSelect(regionId: RegionId) {
    setState((prev) => ({ ...prev, regionId }));
  }

  function handleStart() {
    setState((prev) => startSimulation(prev));
  }

  function handleSelectAction(action: SimulationAction) {
    if (state.status !== "active" || state.phase !== "plan") return;
    setState((prev) => ({ ...prev, selectedAction: action }));
  }

  function handleTileInteract(tileId: string) {
    setState((prev) => {
      if (
        prev.status !== "active" ||
        prev.phase !== "plan" ||
        prev.planActionsRemaining <= 0
      ) {
        return prev;
      }
      const tileIndex = prev.tiles.findIndex((tile) => tile.id === tileId);
      if (tileIndex === -1) return prev;

      const tile = prev.tiles[tileIndex];
      const action = prev.selectedAction;
      const impact = applyActionToTile(tile, action);
      if (!impact.success) {
        const rejectionLog: LogEntry = {
          id: createId(),
          year: prev.year,
          phase: "plan",
          title: "Action Unavailable",
          description: "That tile cannot support the chosen action right now.",
        };
        return { ...prev, log: appendLog(prev.log, rejectionLog) };
      }

      const updatedTiles = [...prev.tiles];
      updatedTiles[tileIndex] = impact.tile;

      let nextState: SimulationRuntime = {
        ...prev,
        tiles: updatedTiles,
        planActionsRemaining: Math.max(prev.planActionsRemaining - 1, 0),
      };

      nextState = applyEffects(nextState, ACTION_IMPACTS[action].effects);

      const missionResult = applyMissionProgress(nextState.mission, action);
      if (missionResult) {
        const { mission, completed, rewardEffects, summary } = missionResult;
        nextState = { ...nextState, mission };
        if (rewardEffects) {
          nextState = applyEffects(nextState, rewardEffects);
        }
        const missionLog: LogEntry = {
          id: createId(),
          year: prev.year,
          phase: "plan",
          title: completed ? "Mission Complete" : "Mission Progress",
          description: summary,
        };
        nextState = { ...nextState, log: appendLog(nextState.log, missionLog) };
      }

      const actionLog: LogEntry = {
        id: createId(),
        year: prev.year,
        phase: "plan",
        title: `${capitalize(action)} action executed`,
        description: ACTION_IMPACTS[action].narrative,
      };

      nextState = { ...nextState, log: appendLog(nextState.log, actionLog) };
      return nextState;
    });
  }

  function handleAdvanceFromPlan() {
    setState((prev) => {
      if (prev.status !== "active" || prev.phase !== "plan") return prev;
      const withSeason: SimulationRuntime = {
        ...prev,
        phase: "weather",
        seasonIndex: (prev.seasonIndex + 1) % SEASONS.length,
      };
      const { weather, effects } = selectWeather(withSeason, selectedRegion);
      let next: SimulationRuntime = { ...withSeason, currentWeather: weather };
      next = applyEffects(next, effects.effects);
      const log: LogEntry = {
        id: createId(),
        year: next.year,
        phase: "weather",
        title: `${weather.icon} ${weather.label} conditions`,
        description: effects.summary,
      };
      next = { ...next, log: appendLog(next.log, log) };
      return next;
    });
  }

  function handleAdvanceFromWeather() {
    setState((prev) => {
      if (prev.status !== "active" || prev.phase !== "weather") return prev;
      const mode = selectedMode ?? GAME_MODES[0];
      const nextPhaseState: SimulationRuntime = {
        ...prev,
        phase: "disaster",
        seasonIndex: 2,
      };
      const disasterDefinition = selectDisaster(
        nextPhaseState,
        mode,
        selectedRegion,
      );
      if (!disasterDefinition) {
        const calmLog: LogEntry = {
          id: createId(),
          year: prev.year,
          phase: "disaster",
          title: "Calm Season",
          description:
            "Preparedness pays off — no major disaster strikes this year.",
        };
        return {
          ...nextPhaseState,
          currentDisaster: null,
          log: appendLog(prev.log, calmLog),
        };
      }
      const warningLog: LogEntry = {
        id: createId(),
        year: prev.year,
        phase: "disaster",
        title: `${disasterDefinition.icon} ${disasterDefinition.name}`,
        description: disasterDefinition.description,
      };
      return {
        ...nextPhaseState,
        currentDisaster: { definition: disasterDefinition, resolved: false },
        log: appendLog(prev.log, warningLog),
      };
    });
  }

  function handleResolveDisaster(choice: DisasterChoice) {
    setState((prev) => {
      if (
        prev.status !== "active" ||
        prev.phase !== "disaster" ||
        !prev.currentDisaster ||
        prev.currentDisaster.resolved
      ) {
        return prev;
      }
      let next = applyEffects(prev, choice.effects);
      const summary = formatEffect(choice.effects);
      const log: LogEntry = {
        id: createId(),
        year: prev.year,
        phase: "disaster",
        title: `${choice.label} enacted`,
        description: summary,
      };
      next = {
        ...next,
        currentDisaster: {
          ...prev.currentDisaster,
          resolved: true,
          choiceId: choice.id,
          summary,
        },
        log: appendLog(next.log, log),
      };
      return next;
    });
  }

  function handleAdvanceFromDisaster() {
    setState((prev) => {
      if (prev.status !== "active" || prev.phase !== "disaster") return prev;
      if (prev.currentDisaster && !prev.currentDisaster.resolved) return prev;
      return {
        ...prev,
        phase: "adapt",
        seasonIndex: 3,
        adaptationTaken: false,
      };
    });
  }

  function handleAdaptation(option: AdaptationOption) {
    setState((prev) => {
      if (
        prev.status !== "active" ||
        prev.phase !== "adapt" ||
        prev.adaptationTaken
      ) {
        return prev;
      }
      let next = applyEffects(prev, option.effects);
      const log: LogEntry = {
        id: createId(),
        year: prev.year,
        phase: "adapt",
        title: `${option.label} enacted`,
        description: formatEffect(option.effects),
      };
      next = { ...next, adaptationTaken: true, log: appendLog(next.log, log) };
      return next;
    });
  }

  function handleAdvanceToEvaluation() {
    setState((prev) => {
      if (prev.status !== "active" || prev.phase !== "adapt") return prev;
      if (!prev.adaptationTaken) return prev;

      const mode = selectedMode ?? GAME_MODES[0];
      const resources = prev.resources;
      const scoreboard = recalculateScoreboard(resources, prev.scoreboard);
      const co2ppm = clampCo2(
        prev.co2ppm +
          mode.modifiers.co2Trend +
          (100 - resources.airQuality) * 0.04 +
          (100 - resources.forest) * 0.035 -
          resources.energy * 0.02 -
          resources.wildlife * 0.01,
      );

      const outcome = evaluateOutcome(scoreboard, co2ppm);
      const evaluation: EvaluationSummary = {
        outcome,
        narrative: buildEvaluationNarrative(outcome, scoreboard, co2ppm),
        resourceSnapshot: resources,
        scoreboardSnapshot: scoreboard,
      };

      let status: SimulationStatus = prev.status;
      if (
        scoreboard.sustainability <= 20 ||
        scoreboard.happiness <= 20 ||
        scoreboard.resilience <= 20 ||
        co2ppm >= 520
      ) {
        status = "collapse";
      } else if (
        prev.year >= TARGET_YEAR &&
        scoreboard.sustainability >= 55 &&
        scoreboard.happiness >= 50 &&
        scoreboard.resilience >= 50 &&
        co2ppm <= 460
      ) {
        status = "victory";
      }

      const log: LogEntry = {
        id: createId(),
        year: prev.year,
        phase: "evaluate",
        title: `Year ${prev.year} assessment`,
        description: evaluation.narrative,
      };

      return {
        ...prev,
        phase: "evaluate",
        seasonIndex: 3,
        scoreboard,
        co2ppm,
        evaluation,
        status,
        log: appendLog(prev.log, log),
      };
    });
  }

  function handleBeginNextYear() {
    setState((prev) => {
      if (prev.phase !== "evaluate") return prev;
      if (prev.status !== "active") {
        return createInitialRuntime();
      }

      const nextYear = prev.year + 1;
      const mission =
        prev.mission && prev.mission.completed
          ? generateMission()
          : prev.mission;
      const log: LogEntry = {
        id: createId(),
        year: nextYear,
        phase: "plan",
        title: `Planning for ${nextYear}`,
        description:
          "Set priorities for the coming year to keep Earth in balance.",
      };

      return {
        ...prev,
        year: nextYear,
        phase: "plan",
        seasonIndex: 0,
        planActionsRemaining: PLAN_ACTIONS_PER_YEAR,
        selectedAction: "plant",
        currentWeather: null,
        currentDisaster: null,
        adaptationTaken: false,
        evaluation: undefined,
        mission,
        log: appendLog(prev.log, log),
      };
    });
  }

  if (state.status === "setup") {
    return (
      <>
        <HowToPlayDialog
          open={showHowToPlay}
          onClose={handleDismissHowToPlay}
          hasSavedCampaign={hasSavedCampaign}
        />
        <SetupView
          selectedModeId={state.modeId}
          selectedRegionId={state.regionId}
          onSelectMode={handleModeSelect}
          onSelectRegion={handleRegionSelect}
          onStart={handleStart}
          onOpenHowToPlay={handleOpenHowToPlay}
        />
      </>
    );
  }

  const disasterChoices = state.currentDisaster?.definition.choices ?? [];

  return (
    <>
      <HowToPlayDialog
        open={showHowToPlay}
        onClose={handleDismissHowToPlay}
        hasSavedCampaign={hasSavedCampaign}
      />

      <div className="space-y-6">
        <GameHeader
          mode={selectedMode}
          region={selectedRegion}
          year={state.year}
          co2ppm={state.co2ppm}
          phase={state.phase}
          season={season}
          status={state.status}
          actionsRemaining={state.planActionsRemaining}
          mission={state.mission}
          onShowHowToPlay={handleOpenHowToPlay}
        />

        <PhaseTimeline currentPhase={state.phase} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.05fr)]">
          <div className="space-y-6">
            {state.phase === "plan" && (
              <PlanPanel
                selectedAction={state.selectedAction}
                planActionsRemaining={state.planActionsRemaining}
                onSelectAction={handleSelectAction}
                onAdvance={handleAdvanceFromPlan}
                disableAdvance={state.planActionsRemaining > 0}
                mission={state.mission}
              />
            )}

            {state.phase === "weather" && state.currentWeather && (
              <PhaseCard
                title={`${state.currentWeather.icon} ${state.currentWeather.label}`}
                description={WEATHER_EFFECTS[state.currentWeather.id].summary}
                actionLabel="Prepare for disasters"
                onAction={handleAdvanceFromWeather}
              >
                <EffectList
                  effect={WEATHER_EFFECTS[state.currentWeather.id].effects}
                />
              </PhaseCard>
            )}

            {state.phase === "disaster" && (
              <DisasterPanel
                disaster={state.currentDisaster}
                choices={disasterChoices}
                onResolve={handleResolveDisaster}
                onAdvance={handleAdvanceFromDisaster}
              />
            )}

            {state.phase === "adapt" && (
              <AdaptPanel
                options={ADAPTATION_OPTIONS}
                onSelect={handleAdaptation}
                selected={state.adaptationTaken}
                onAdvance={handleAdvanceToEvaluation}
              />
            )}

            {state.phase === "evaluate" && state.evaluation && (
              <EvaluationPanel
                evaluation={state.evaluation}
                status={state.status}
                year={state.year}
                targetYear={TARGET_YEAR}
                onRestart={() => setState(createInitialRuntime())}
                onNextYear={handleBeginNextYear}
              />
            )}

            <Card className="bg-white/90">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Biome Map</CardTitle>
                <CardDescription>
                  Tap tiles during the Plan phase to transform your landscape
                  and steer the climate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {state.tiles.map((tile) => (
                    <TileCard
                      key={tile.id}
                      tile={tile}
                      selectedAction={state.selectedAction}
                      onInteract={canTakeAction ? handleTileInteract : () => {}}
                    />
                  ))}
                </div>
                {!canTakeAction && state.phase !== "plan" && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Tile changes are only available during the planning phase.
                  </p>
                )}
              </CardContent>
            </Card>

            <EventLog entries={state.log} />
          </div>

          <div className="space-y-6">
            <EnvironmentDashboard
              resources={state.resources}
              co2ppm={state.co2ppm}
            />
            <ScoreboardPanel scoreboard={state.scoreboard} />
          </div>
        </div>
      </div>
    </>
  );
}

function HowToPlayDialog({
  open,
  onClose,
  hasSavedCampaign,
}: {
  open: boolean;
  onClose: () => void;
  hasSavedCampaign: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>EcoSphere quickstart</DialogTitle>
          <DialogDescription>
            {hasSavedCampaign
              ? "Resume your ongoing campaign or refresh yourself on the core phases before diving back in."
              : "Review the core phases before guiding your region toward a thriving future."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            {HOW_TO_PLAY_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border bg-white/80 p-4"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {index + 1}
                </div>
                <h4 className="mt-1 text-sm font-semibold text-foreground">
                  {step.title}
                </h4>
                <p className="mt-2 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Quick tips
            </h4>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              {HOW_TO_PLAY_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <Alert className="bg-emerald-50">
            <AlertTitle className="text-sm font-semibold">
              Progress auto-saves
            </AlertTitle>
            <AlertDescription className="text-xs leading-relaxed">
              Every choice updates your campaign instantly, so you can leave and
              return without losing momentum.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>{"Let's play"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SetupView({
  selectedModeId,
  selectedRegionId,
  onSelectMode,
  onSelectRegion,
  onStart,
  onOpenHowToPlay,
}: {
  selectedModeId: GameModeId | null;
  selectedRegionId: RegionId | null;
  onSelectMode: (mode: GameModeId) => void;
  onSelectRegion: (region: RegionId) => void;
  onStart: () => void;
  onOpenHowToPlay: () => void;
}) {
  const ready = selectedModeId && selectedRegionId;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="text-xl">Choose Game Mode</CardTitle>
          <CardDescription>
            Pick the narrative arc that best matches your challenge appetite.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition hover:border-primary hover:shadow",
                selectedModeId === mode.id
                  ? "border-primary ring-2 ring-primary/40"
                  : "bg-white/60",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {mode.name}
                </span>
                <Badge
                  variant={selectedModeId === mode.id ? "default" : "outline"}
                >
                  {mode.tagline}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode.description}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="text-xl">Select Starting Region</CardTitle>
          <CardDescription>
            Each biome comes with unique strengths, vulnerabilities, and
            starting resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {REGIONS.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition hover:border-primary hover:shadow",
                selectedRegionId === region.id
                  ? "border-primary ring-2 ring-primary/40"
                  : "bg-white/60",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">
                  {region.name}
                </span>
                <Badge variant="outline">{region.biome}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {region.description}
              </p>
              <p className="mt-3 text-xs font-medium text-foreground/70">
                Strengths: {region.strengths.join(", ")}
              </p>
              <p className="text-xs font-medium text-rose-600">
                Risks: {region.vulnerabilities.join(", ")}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-white/95">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Earth 2100: Balance or Collapse
            </h2>
            <p className="text-sm text-muted-foreground">
              Guide humanity through cascading climate feedback loops. Build
              resilient communities, negotiate with nature, and reach 2100 with
              all indices intact.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button variant="outline" onClick={onOpenHowToPlay}>
              How to play
            </Button>
            <Button size="lg" disabled={!ready} onClick={onStart}>
              Begin Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GameHeader({
  mode,
  region,
  year,
  co2ppm,
  phase,
  season,
  status,
  actionsRemaining,
  mission,
  onShowHowToPlay,
}: {
  mode: GameMode | null;
  region: RegionDefinition | null;
  year: number;
  co2ppm: number;
  phase: GamePhase;
  season: (typeof SEASONS)[number];
  status: SimulationStatus;
  actionsRemaining: number;
  mission: SimulationChallenge | null;
  onShowHowToPlay: () => void;
}) {
  return (
    <Card className="bg-white/95">
      <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm uppercase tracking-wide text-primary">
            <span>{mode ? mode.name : "Campaign"}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{region ? region.name : "Unknown Region"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              Year {year} ・ Phase {capitalize(phase)} ・ {season.icon}{" "}
              {season.label}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>CO₂ {Math.round(co2ppm)} ppm</span>
            <Separator orientation="vertical" className="h-4" />
            <span>{actionsRemaining} actions left</span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <Badge
            variant={
              status === "active"
                ? "default"
                : status === "victory"
                  ? "secondary"
                  : "destructive"
            }
            className="text-xs font-semibold"
          >
            {statusLabel(status)}
          </Badge>
          {mission && !mission.completed && (
            <div className="text-left text-xs text-muted-foreground lg:text-right">
              <span className="font-semibold text-foreground">Mission:</span>{" "}
              {mission.description} ({mission.progress}/{mission.target})
            </div>
          )}
          <Button variant="outline" size="sm" onClick={onShowHowToPlay}>
            How to play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PlanPanel({
  selectedAction,
  planActionsRemaining,
  onSelectAction,
  onAdvance,
  disableAdvance,
  mission,
}: {
  selectedAction: SimulationAction;
  planActionsRemaining: number;
  onSelectAction: (action: SimulationAction) => void;
  onAdvance: () => void;
  disableAdvance: boolean;
  mission: SimulationChallenge | null;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Plan Phase</CardTitle>
        <CardDescription>
          Choose up to {PLAN_ACTIONS_PER_YEAR} strategic actions to steer your
          biome before the climate reacts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant={selectedAction === action.id ? "default" : "outline"}
              onClick={() => onSelectAction(action.id)}
            >
              <span className="mr-2 text-base">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
        <Alert variant="default" className="bg-emerald-50">
          <AlertTitle className="text-sm font-semibold">
            🎯 Mission Status
          </AlertTitle>
          <AlertDescription className="text-xs leading-relaxed">
            {mission
              ? `${mission.description} (${mission.progress}/${mission.target})`
              : "No active mission — focus on balance across all systems."}
          </AlertDescription>
        </Alert>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Actions remaining:{" "}
            <span className="font-semibold text-foreground">
              {planActionsRemaining}
            </span>
          </span>
          <Button onClick={onAdvance} disabled={disableAdvance}>
            Confirm plan &amp; advance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PhaseCard({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}

function DisasterPanel({
  disaster,
  choices,
  onResolve,
  onAdvance,
}: {
  disaster: DisasterRuntime | null;
  choices: DisasterChoice[];
  onResolve: (choice: DisasterChoice) => void;
  onAdvance: () => void;
}) {
  if (!disaster) {
    return (
      <PhaseCard
        title="No Disaster Triggered"
        description="Preparedness and sustainable planning kept major disasters at bay this season."
        actionLabel="Proceed to adaptation"
        onAction={onAdvance}
      />
    );
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">
          {disaster.definition.icon} {disaster.definition.name}
        </CardTitle>
        <CardDescription>{disaster.definition.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onResolve(choice)}
              disabled={disaster.resolved}
              className={cn(
                "rounded-xl border p-4 text-left transition hover:border-primary hover:shadow",
                disaster.choiceId === choice.id
                  ? "border-primary ring-2 ring-primary/40"
                  : "bg-white/70",
                disaster.resolved
                  ? "cursor-default opacity-80"
                  : "cursor-pointer",
              )}
            >
              <div className="text-sm font-semibold">{choice.label}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {choice.description}
              </p>
              <p className="mt-2 text-xs text-foreground/70">{choice.impact}</p>
              <EffectList effect={choice.effects} className="mt-3" />
            </button>
          ))}
        </div>
        {disaster.resolved && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {disaster.summary ?? "Disaster resolved."}
            </p>
            <Button onClick={onAdvance}>Proceed to adaptation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdaptPanel({
  options,
  onSelect,
  selected,
  onAdvance,
}: {
  options: AdaptationOption[];
  onSelect: (option: AdaptationOption) => void;
  selected: boolean;
  onAdvance: () => void;
}) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Adapt Phase</CardTitle>
        <CardDescription>
          Deploy long-term policies to steer your society toward resilience and
          sustainability.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option)}
              disabled={selected}
              className={cn(
                "rounded-xl border p-4 text-left transition hover:border-primary hover:shadow",
                selected ? "cursor-default opacity-80" : "bg-white/70",
              )}
            >
              <div className="text-sm font-semibold">{option.label}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {option.description}
              </p>
              <EffectList effect={option.effects} className="mt-3" />
            </button>
          ))}
        </div>
        <Button onClick={onAdvance} disabled={!selected}>
          Review yearly outcomes
        </Button>
      </CardContent>
    </Card>
  );
}

function EvaluationPanel({
  evaluation,
  status,
  year,
  targetYear,
  onRestart,
  onNextYear,
}: {
  evaluation: EvaluationSummary;
  status: SimulationStatus;
  year: number;
  targetYear: number;
  onRestart: () => void;
  onNextYear: () => void;
}) {
  const victory = status === "victory";
  const collapse = status === "collapse";

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg">Yearly Evaluation</CardTitle>
        <CardDescription>{evaluation.narrative}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={badgeVariantForOutcome(evaluation.outcome)}>
            {capitalize(evaluation.outcome)} outlook
          </Badge>
          <span className="text-sm text-muted-foreground">
            Sustainability{" "}
            {Math.round(evaluation.scoreboardSnapshot.sustainability)} ・
            Happiness {Math.round(evaluation.scoreboardSnapshot.happiness)} ・
            Resilience {Math.round(evaluation.scoreboardSnapshot.resilience)}
          </span>
        </div>
        {victory && (
          <Alert className="bg-emerald-50">
            <AlertTitle>🌍 Green Future Secured</AlertTitle>
            <AlertDescription>
              Your leadership carried Earth beyond {targetYear} with thriving
              ecosystems and stable societies.
            </AlertDescription>
          </Alert>
        )}
        {collapse && (
          <Alert variant="destructive">
            <AlertTitle>⚠️ Collapse Scenario</AlertTitle>
            <AlertDescription>
              One or more global indices fell into irreversible decline. Restart
              to chart a new future.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-wrap gap-3">
          <Button onClick={onRestart} variant="outline">
            Restart campaign
          </Button>
          {!collapse && !victory && (
            <Button onClick={onNextYear}>Begin next year ({year + 1})</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StageTag({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-muted bg-muted/60 text-muted-foreground",
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </div>
  );
}

function PhaseTimeline({ currentPhase }: { currentPhase: GamePhase }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PHASE_FLOW.map((phase) => (
        <StageTag
          key={phase}
          label={capitalize(phase)}
          active={phase === currentPhase}
        />
      ))}
    </div>
  );
}

function EventLog({ entries }: { entries: LogEntry[] }) {
  return (
    <Card className="bg-white/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Timeline</CardTitle>
        <CardDescription>
          Track how each decision and climate event ripples through your world.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 rounded-md border bg-white/80 p-3">
          <div className="space-y-3">
            {[...entries].reverse().map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border bg-white/80 p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    Year {entry.year}
                  </span>
                  <span className="uppercase tracking-wide text-muted-foreground">
                    {entry.phase}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {entry.title}
                </p>
                <p className="text-muted-foreground">{entry.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function EffectList({
  effect,
  className,
}: {
  effect: DisasterChoiceEffect;
  className?: string;
}) {
  const items = mapEffect(effect);
  if (!items.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {items.map((item) => (
        <Badge key={item.id} variant={item.delta > 0 ? "default" : "outline"}>
          {item.label} {item.delta > 0 ? "+" : ""}
          {item.delta}
        </Badge>
      ))}
    </div>
  );
}

function startSimulation(runtime: SimulationRuntime): SimulationRuntime {
  if (!runtime.modeId || !runtime.regionId) return runtime;
  const mode = getMode(runtime.modeId);
  const region = getRegion(runtime.regionId);
  const tiles = createTilesForRegion(region.id);
  const resources = initializeResources(mode, region);
  const scoreboard = recalculateScoreboard(resources, {
    sustainability: 60,
    happiness: 60,
    resilience: 60,
  });
  const mission = generateMission();
  const introLog: LogEntry = {
    id: createId(),
    year: INITIAL_YEAR,
    phase: "setup",
    title: "Campaign Initiated",
    description: `${mode.name} mode from ${region.name}: ${region.biome}. Sustain all indices through ${TARGET_YEAR}.`,
  };
  return {
    status: "active",
    modeId: runtime.modeId,
    regionId: runtime.regionId,
    year: INITIAL_YEAR,
    phase: "plan",
    seasonIndex: 0,
    planActionsRemaining: PLAN_ACTIONS_PER_YEAR,
    tiles,
    selectedAction: "plant",
    resources,
    scoreboard,
    co2ppm: INITIAL_CO2,
    mission,
    log: appendLog([], introLog),
    currentWeather: null,
    currentDisaster: null,
    adaptationTaken: false,
  };
}

function createInitialRuntime(): SimulationRuntime {
  return {
    status: "setup",
    modeId: null,
    regionId: null,
    year: INITIAL_YEAR,
    phase: "plan",
    seasonIndex: 0,
    planActionsRemaining: PLAN_ACTIONS_PER_YEAR,
    tiles: cloneTiles(BASELINE_TILES),
    selectedAction: "plant",
    resources: { ...BASE_RESOURCE_TEMPLATE },
    scoreboard: { sustainability: 60, happiness: 60, resilience: 60 },
    co2ppm: INITIAL_CO2,
    mission: null,
    log: [],
    currentWeather: null,
    currentDisaster: null,
    adaptationTaken: false,
  };
}

function applyActionToTile(tile: SimulationTile, action: SimulationAction) {
  let updated = tile;
  let success = false;

  if (action === "plant") {
    if (
      tile.type !== "water" &&
      tile.type !== "wetland" &&
      tile.type !== "forest"
    ) {
      updated = {
        ...tile,
        type: "forest",
        health: clamp(tile.health + 18),
        pollution: clamp(tile.pollution - 12),
        biodiversity: clamp(tile.biodiversity + 16),
        energy: clamp(tile.energy - 6, 0, 120),
      };
      success = true;
    }
  } else if (action === "clean") {
    if (tile.pollution > 20) {
      updated = {
        ...tile,
        pollution: clamp(tile.pollution - 24),
        health: clamp(tile.health + 12),
        biodiversity: clamp(tile.biodiversity + 10),
        type: tile.type === "polluted" ? "farmland" : tile.type,
      };
      success = true;
    }
  } else if (action === "solar") {
    if (tile.type !== "water" && tile.type !== "wetland") {
      updated = {
        ...tile,
        type: "solar",
        energy: clamp(tile.energy + 42, 0, 160),
        pollution: clamp(tile.pollution - 10),
        biodiversity: clamp(tile.biodiversity - 6, 0, 120),
        health: clamp(tile.health + 6),
      };
      success = true;
    }
  } else if (action === "wetland") {
    if (tile.type !== "water" && tile.type !== "wetland") {
      updated = {
        ...tile,
        type: "wetland",
        health: clamp(tile.health + 10),
        pollution: clamp(tile.pollution - 14),
        biodiversity: clamp(tile.biodiversity + 18),
        energy: clamp(tile.energy - 8, 0, 120),
      };
      success = true;
    }
  }

  return { tile: updated, success };
}

function selectWeather(
  state: SimulationRuntime,
  region: RegionDefinition | null,
): {
  weather: WeatherCondition;
  effects: { summary: string; effects: DisasterChoiceEffect };
} {
  const weights: Record<WeatherId, number> = {
    sunny: 1,
    rainy: 1,
    storm: 0.8,
    drought: 0.6,
    breezy: 0.5,
    heatwave: 0.5,
    blizzard: 0.4,
  };

  const season = SEASONS[state.seasonIndex] ?? SEASONS[0];
  switch (season.id) {
    case "spring":
      weights.rainy += 0.8;
      weights.breezy += 0.4;
      break;
    case "summer":
      weights.sunny += 0.6;
      weights.heatwave += 1.0;
      weights.drought += 1.2;
      break;
    case "autumn":
      weights.storm += 1.1;
      weights.rainy += 0.5;
      break;
    case "winter":
      weights.blizzard += 1.2;
      weights.storm += 0.6;
      break;
    default:
      break;
  }

  if (region?.climateBias) {
    for (const [id, bias] of Object.entries(region.climateBias)) {
      weights[id as WeatherId] = (weights[id as WeatherId] ?? 0.5) + bias;
    }
  }

  if (state.resources.water < 45) {
    weights.drought += 1.4;
  } else if (state.resources.water > 75) {
    weights.rainy += 0.9;
  }
  if (state.resources.airQuality < 50) {
    weights.storm += 0.4;
    weights.heatwave += 0.3;
  }
  if (state.co2ppm > 450) {
    weights.storm += (state.co2ppm - 450) / 25;
    weights.heatwave += (state.co2ppm - 450) / 30;
    weights.drought += (state.co2ppm - 450) / 28;
  }
  if (state.resources.energy > 70) {
    weights.sunny += 0.4;
    weights.breezy += 0.3;
  }

  const weather = weightedPick(weights);
  return { weather, effects: WEATHER_EFFECTS[weather.id] };
}

function selectDisaster(
  state: SimulationRuntime,
  mode: GameMode,
  region: RegionDefinition | null,
) {
  if (!state.regionId) return null;
  const context = {
    resources: state.resources,
    scoreboard: state.scoreboard,
    co2ppm: state.co2ppm,
    modeId: mode.id,
    regionId: region?.id ?? state.regionId,
    year: state.year,
  };
  const entries = DISASTER_DECK.map((definition) => {
    const weight =
      Math.max(0, definition.triggerWeight(context)) *
      mode.modifiers.disasterIntensity;
    return { definition, weight };
  });
  const resilienceBonus = state.scoreboard.resilience / 12;
  const noneWeight = Math.max(
    2,
    12 - mode.modifiers.disasterIntensity * 4 + resilienceBonus,
  );
  const total = entries.reduce((sum, entry) => sum + entry.weight, noneWeight);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  if (roll <= noneWeight) return null;
  roll -= noneWeight;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.definition;
    }
  }
  return entries[entries.length - 1]?.definition ?? null;
}

function initializeResources(mode: GameMode, region: RegionDefinition) {
  const biased: ResourceState = {
    forest: BASE_RESOURCE_TEMPLATE.forest,
    water: BASE_RESOURCE_TEMPLATE.water,
    energy: BASE_RESOURCE_TEMPLATE.energy,
    airQuality: BASE_RESOURCE_TEMPLATE.airQuality,
    economy: BASE_RESOURCE_TEMPLATE.economy,
    happiness: BASE_RESOURCE_TEMPLATE.happiness,
    wildlife: BASE_RESOURCE_TEMPLATE.wildlife,
  };

  for (const key of Object.keys(region.startingResources) as Array<
    keyof ResourceState
  >) {
    const value = region.startingResources[key];
    if (typeof value === "number") {
      biased[key] = clamp(value);
    }
  }

  const delta = mode.modifiers.resourceBias;
  const adjusted: ResourceState = {
    forest: clamp(biased.forest + delta),
    water: clamp(biased.water + delta),
    energy: clamp(biased.energy + delta),
    airQuality: clamp(biased.airQuality + delta),
    economy: clamp(biased.economy + delta),
    happiness: clamp(biased.happiness + delta),
    wildlife: clamp(biased.wildlife + delta),
  };

  return adjusted;
}

function applyMissionProgress(
  mission: SimulationChallenge | null,
  action: SimulationAction,
) {
  if (!mission || mission.completed) return null;
  if (mission.type !== action) {
    return {
      mission,
      completed: false,
      summary: `Mission goal unchanged: ${mission.description} (${mission.progress}/${mission.target}).`,
    };
  }
  const progress = Math.min(mission.target, mission.progress + 1);
  const completed = progress >= mission.target;
  const updated: SimulationChallenge = {
    ...mission,
    progress,
    completed,
  };
  const rewardEffects: DisasterChoiceEffect | undefined = completed
    ? {
        resources: {
          economy: mission.reward / 60,
          happiness: mission.reward / 80,
          forest: action === "plant" ? 4 : 0,
          water: action === "wetland" ? 4 : 0,
        },
        scoreboard: {
          sustainability: mission.reward / 90,
          happiness: mission.reward / 100,
          resilience: mission.reward / 110,
        },
        co2Delta:
          action === "plant" ? -mission.reward / 120 : -mission.reward / 200,
      }
    : undefined;
  const summary = completed
    ? `Mission complete! Earned sustainability boost and ${mission.reward} community momentum.`
    : `Mission progress advanced to ${progress}/${mission.target}.`;
  return { mission: updated, completed, rewardEffects, summary };
}

function generateMission(): SimulationChallenge {
  const template =
    MISSION_TEMPLATES[Math.floor(Math.random() * MISSION_TEMPLATES.length)];
  return {
    id: `${template.id}-${createId()}`,
    description: template.description,
    type: template.type,
    target: template.target,
    reward: template.reward,
    progress: 0,
    completed: false,
  };
}

function applyEffects(
  state: SimulationRuntime,
  effect: DisasterChoiceEffect,
): SimulationRuntime {
  let resources = state.resources;
  if (effect.resources) {
    resources = applyResourceDelta(resources, effect.resources);
  }
  let scoreboard = state.scoreboard;
  if (effect.scoreboard) {
    scoreboard = applyScoreboardDelta(scoreboard, effect.scoreboard);
  }
  scoreboard = recalculateScoreboard(resources, scoreboard);
  const co2ppm = effect.co2Delta
    ? clampCo2(state.co2ppm + effect.co2Delta)
    : state.co2ppm;
  return { ...state, resources, scoreboard, co2ppm };
}

function applyResourceDelta(
  current: ResourceState,
  delta: Partial<ResourceState>,
): ResourceState {
  const updated: ResourceState = { ...current };
  for (const key of Object.keys(delta) as Array<keyof ResourceState>) {
    const value = delta[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      updated[key] = clamp(updated[key] + value);
    }
  }
  return updated;
}

function applyScoreboardDelta(
  current: ScoreboardState,
  delta: Partial<ScoreboardState>,
): ScoreboardState {
  const updated: ScoreboardState = { ...current };
  for (const key of Object.keys(delta) as Array<keyof ScoreboardState>) {
    const value = delta[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      updated[key] = clamp(updated[key] + value);
    }
  }
  return updated;
}

function recalculateScoreboard(
  resources: ResourceState,
  previous: ScoreboardState,
): ScoreboardState {
  const sustainabilityRaw =
    resources.forest * 0.22 +
    resources.water * 0.2 +
    resources.airQuality * 0.2 +
    resources.wildlife * 0.18 +
    resources.energy * 0.1 +
    resources.economy * 0.1;
  const happinessRaw =
    resources.happiness * 0.4 +
    resources.economy * 0.25 +
    resources.airQuality * 0.15 +
    resources.water * 0.1 +
    resources.forest * 0.1;
  const resilienceRaw =
    resources.energy * 0.28 +
    resources.water * 0.18 +
    resources.forest * 0.16 +
    resources.economy * 0.18 +
    resources.wildlife * 0.1 +
    resources.airQuality * 0.1;

  const blend = (calc: number, prev: number) =>
    clamp(calc * 0.65 + prev * 0.35);

  return {
    sustainability: blend(sustainabilityRaw, previous.sustainability),
    happiness: blend(happinessRaw, previous.happiness),
    resilience: blend(resilienceRaw, previous.resilience),
  };
}

function evaluateOutcome(
  scoreboard: ScoreboardState,
  co2ppm: number,
): "stable" | "warning" | "critical" {
  if (
    scoreboard.sustainability < 40 ||
    scoreboard.happiness < 40 ||
    scoreboard.resilience < 40 ||
    co2ppm >= 500
  ) {
    return "critical";
  }
  if (
    scoreboard.sustainability < 60 ||
    scoreboard.happiness < 60 ||
    scoreboard.resilience < 60 ||
    co2ppm >= 470
  ) {
    return "warning";
  }
  return "stable";
}

function buildEvaluationNarrative(
  outcome: "stable" | "warning" | "critical",
  scoreboard: ScoreboardState,
  co2ppm: number,
) {
  if (outcome === "stable") {
    return `Systems hold steady. Sustainability ${Math.round(scoreboard.sustainability)} and resilience ${Math.round(scoreboard.resilience)} remain robust while CO₂ drifts at ${Math.round(co2ppm)} ppm.`;
  }
  if (outcome === "warning") {
    return `Warning lights flash. Focus on reinforcing weak indices (sus ${Math.round(scoreboard.sustainability)}, hap ${Math.round(scoreboard.happiness)}, res ${Math.round(scoreboard.resilience)}) and draw CO₂ down from ${Math.round(co2ppm)} ppm.`;
  }
  return `Critical thresholds breached. Immediate intervention required — indices hover at sustainability ${Math.round(scoreboard.sustainability)}, happiness ${Math.round(scoreboard.happiness)}, resilience ${Math.round(scoreboard.resilience)} with CO₂ ${Math.round(co2ppm)} ppm.`;
}

function createTilesForRegion(regionId: RegionId) {
  const tiles = cloneTiles(BASELINE_TILES);
  const transform = REGION_TILE_TRANSFORMS[regionId];
  if (transform) {
    transform(tiles);
  }
  return tiles;
}

function cloneTiles(tiles: SimulationTile[]) {
  return tiles.map((tile) => ({ ...tile }));
}

function weightedPick(weights: Record<WeatherId, number>) {
  const entries = WEATHER_OPTIONS.map((option) => {
    const weight = Math.max(0, weights[option.id] ?? 0.2);
    return { option, weight };
  });
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= 0) return WEATHER_OPTIONS[0];
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.option;
  }
  return entries[entries.length - 1]!.option;
}

function appendLog(log: LogEntry[], entry: LogEntry) {
  const next = [...log, entry];
  if (next.length > MAX_LOG_ENTRIES) {
    next.splice(0, next.length - MAX_LOG_ENTRIES);
  }
  return next;
}

function mapEffect(effect: DisasterChoiceEffect) {
  const entries: Array<{ id: string; label: string; delta: number }> = [];
  if (effect.resources) {
    for (const [key, value] of Object.entries(effect.resources) as Array<
      [keyof ResourceState, number]
    >) {
      if (!value) continue;
      entries.push({
        id: `resource-${key}`,
        label: shortResourceLabel(key),
        delta: Math.round(value),
      });
    }
  }
  if (effect.scoreboard) {
    for (const [key, value] of Object.entries(effect.scoreboard) as Array<
      [keyof ScoreboardState, number]
    >) {
      if (!value) continue;
      entries.push({
        id: `scoreboard-${key}`,
        label: shortScoreLabel(key),
        delta: Math.round(value),
      });
    }
  }
  if (effect.co2Delta && effect.co2Delta !== 0) {
    entries.push({
      id: "co2-delta",
      label: "CO₂",
      delta: Math.round(effect.co2Delta),
    });
  }
  return entries;
}

function formatEffect(effect: DisasterChoiceEffect) {
  const parts: string[] = [];
  if (effect.resources) {
    for (const [key, value] of Object.entries(effect.resources) as Array<
      [keyof ResourceState, number]
    >) {
      if (!value) continue;
      parts.push(
        `${shortResourceLabel(key)} ${value > 0 ? "+" : ""}${Math.round(value)}`,
      );
    }
  }
  if (effect.scoreboard) {
    for (const [key, value] of Object.entries(effect.scoreboard) as Array<
      [keyof ScoreboardState, number]
    >) {
      if (!value) continue;
      parts.push(
        `${shortScoreLabel(key)} ${value > 0 ? "+" : ""}${Math.round(value)}`,
      );
    }
  }
  if (effect.co2Delta && effect.co2Delta !== 0) {
    parts.push(
      `CO₂ ${effect.co2Delta > 0 ? "+" : ""}${Math.round(effect.co2Delta)} ppm`,
    );
  }
  return parts.join(", ") || "No significant change.";
}

function mapLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function shortResourceLabel(key: keyof ResourceState) {
  switch (key) {
    case "airQuality":
      return "Air";
    case "happiness":
      return "Happiness";
    case "wildlife":
      return "Wildlife";
    case "economy":
      return "Economy";
    case "forest":
      return "Forest";
    case "water":
      return "Water";
    case "energy":
      return "Energy";
    default:
      return mapLabel(key);
  }
}

function shortScoreLabel(key: keyof ScoreboardState) {
  switch (key) {
    case "sustainability":
      return "Sustain";
    case "happiness":
      return "Happiness";
    case "resilience":
      return "Resilience";
    default:
      return mapLabel(key);
  }
}

function badgeVariantForOutcome(outcome: "stable" | "warning" | "critical") {
  switch (outcome) {
    case "stable":
      return "default" as const;
    case "warning":
      return "secondary" as const;
    case "critical":
      return "destructive" as const;
    default:
      return "default" as const;
  }
}

function statusLabel(status: SimulationStatus) {
  if (status === "active") return "In Progress";
  if (status === "victory") return "Green Future";
  if (status === "collapse") return "Collapse";
  return "Planning";
}

function getMode(id: GameModeId) {
  return GAME_MODES.find((mode) => mode.id === id) ?? GAME_MODES[0];
}

function getRegion(id: RegionId) {
  return REGIONS.find((region) => region.id === id) ?? REGIONS[0];
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clamp(value: number, min = 0, max = 100) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function clampCo2(value: number) {
  return Math.max(350, Math.min(580, value));
}
