export type PointsHistoryItem = {
  type: "quiz" | "redeem";
  points: number;
  ts: number;
  note?: string;
};

import { getCurrentUser } from "@/services/auth";
import { syncLeaderboard } from "@/services/leaderboard";
const scope = () => getCurrentUser()?.id || "guest";
const KEY = () => `ecolearn_points_${scope()}`;
const HISTORY_KEY = () => `ecolearn_points_history_${scope()}`;

export function getPoints() {
  return Number(localStorage.getItem(KEY()) || 0);
}

export function addPoints(amount: number, note?: string) {
  const current = getPoints();
  const next = current + amount;
  localStorage.setItem(KEY(), String(next));
  const history = getHistory();
  history.push({ type: "quiz", points: amount, ts: Date.now(), note });
  localStorage.setItem(HISTORY_KEY(), JSON.stringify(history));
  syncLeaderboard(next);
  return next;
}

export function redeemPoints(amount: number, note?: string) {
  const current = getPoints();
  if (current < amount) return false;
  const next = current - amount;
  localStorage.setItem(KEY(), String(next));
  const history = getHistory();
  history.push({ type: "redeem", points: -amount, ts: Date.now(), note });
  localStorage.setItem(HISTORY_KEY(), JSON.stringify(history));
  syncLeaderboard(next);
  return true;
}

export function getHistory(): PointsHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY()) || "[]");
  } catch {
    return [];
  }
}
