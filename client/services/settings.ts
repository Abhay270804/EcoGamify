import type { EducationLevel } from "@/components/LevelSelector";
import { getCurrentUser } from "@/services/auth";

export function getActiveEducationLevel(): EducationLevel {
  const user = getCurrentUser();
  const fromLocal =
    (localStorage.getItem("ecolearn_level") as EducationLevel) || null;
  return (user?.educationLevel as EducationLevel) || fromLocal || "elementary";
}
