import { getCurrentUser } from "@/services/auth";

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  league: LeagueTier;
};

export type LeagueTier = "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze";

type StoredEntry = {
  id: string;
  name: string;
  points: number;
};

type LeaderboardState = {
  entries: StoredEntry[];
};

const SAMPLE_ENTRIES: StoredEntry[] = [
  { id: "ava", name: "Ava Green", points: 1120 },
  { id: "noah", name: "Noah Terra", points: 980 },
  { id: "mia", name: "Mia River", points: 930 },
  { id: "liam", name: "Liam Solar", points: 870 },
  { id: "ella", name: "Ella Breeze", points: 820 },
  { id: "zoe", name: "Zoe Coral", points: 780 },
  { id: "ethan", name: "Ethan Grove", points: 720 },
  { id: "ivy", name: "Ivy Meadow", points: 660 },
  { id: "kai", name: "Kai Tide", points: 610 },
  { id: "leo", name: "Leo Summit", points: 580 },
];

const WEEK_KEY_PREFIX = "ecogamify_leaderboard_week_";

function getISOWeek(date: Date) {
  const tmp = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return { year: tmp.getUTCFullYear(), week: weekNo };
}

function getCurrentWeekKey() {
  const now = new Date();
  const { year, week } = getISOWeek(now);
  return `${WEEK_KEY_PREFIX}${year}_w${week}`;
}

function loadState(): LeaderboardState {
  const key = getCurrentWeekKey();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const seeded = { entries: SAMPLE_ENTRIES.map((entry) => ({ ...entry })) };
      localStorage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as LeaderboardState;
    if (!parsed?.entries) throw new Error("Invalid leaderboard state");
    return parsed;
  } catch {
    const fallback = { entries: SAMPLE_ENTRIES.map((entry) => ({ ...entry })) };
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function saveState(state: LeaderboardState) {
  const key = getCurrentWeekKey();
  localStorage.setItem(key, JSON.stringify(state));
}

function assignLeagues(entries: StoredEntry[]): LeaderboardEntry[] {
  const sorted = [...entries].sort((a, b) => b.points - a.points);
  return sorted.map((entry, index) => ({
    ...entry,
    league: leagueForRank(index),
  }));
}

function leagueForRank(rank: number): LeagueTier {
  if (rank === 0) return "Diamond";
  if (rank <= 2) return "Platinum";
  if (rank <= 5) return "Gold";
  if (rank <= 8) return "Silver";
  return "Bronze";
}

function sanitizeName(name?: string | null) {
  const trimmed = (name || "Eco Player").trim();
  return trimmed.length ? trimmed : "Eco Player";
}

function getStoredPoints() {
  const user = getCurrentUser();
  const scope = user?.id || "guest";
  const key = `ecolearn_points_${scope}`;
  return Number(localStorage.getItem(key) || 0);
}

function ensureUserEntry(state: LeaderboardState): LeaderboardState {
  const user = getCurrentUser();
  const id = user?.id || "guest";
  const name = sanitizeName(
    user?.name || (user?.email ? user.email.split("@")[0] : "Guest"),
  );
  const existing = state.entries.find((entry) => entry.id === id);
  if (!existing) {
    state.entries.push({ id, name, points: getStoredPoints() });
    saveState(state);
  }
  return state;
}

export function syncLeaderboard(points: number) {
  const state = loadState();
  const user = getCurrentUser();
  const id = user?.id || "guest";
  const name = sanitizeName(
    user?.name || (user?.email ? user.email.split("@")[0] : "Guest"),
  );
  const existing = state.entries.find((entry) => entry.id === id);
  if (existing) {
    existing.points = points;
    existing.name = name;
  } else {
    state.entries.push({ id, name, points });
  }
  saveState(state);
}

export function getWeeklyLeaderboard() {
  const state = ensureUserEntry(loadState());
  const entries = assignLeagues(state.entries);
  const user = getCurrentUser();
  const userId = user?.id || "guest";
  const yourEntry = entries.find((entry) => entry.id === userId) || null;
  return {
    entries,
    yourEntry,
    weekRange: getCurrentWeekRangeLabel(),
  };
}

function getCurrentWeekRangeLabel() {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });
  return `Week of ${formatter.format(monday)} – ${formatter.format(sunday)}`;
}
