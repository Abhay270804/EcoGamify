import { ReactNode, useMemo } from "react";
import type { EducationLevel } from "@/components/LevelSelector";
import { getActiveEducationLevel } from "@/services/settings";

function varsFor(level: EducationLevel) {
  // HSL tokens to override CSS variables per level
  switch (level) {
    case "elementary":
      return {
        "--primary": "150 70% 40%",
        "--secondary": "150 35% 94%",
        "--accent": "40 95% 55%",
      } as Record<string, string>;
    case "middle":
      return {
        "--primary": "180 70% 35%",
        "--secondary": "180 35% 94%",
        "--accent": "200 90% 55%",
      } as Record<string, string>;
    case "high":
      return {
        "--primary": "140 60% 30%",
        "--secondary": "140 35% 92%",
        "--accent": "30 90% 55%",
      } as Record<string, string>;
    case "college":
      return {
        "--primary": "120 45% 22%",
        "--secondary": "120 25% 90%",
        "--accent": "25 85% 52%",
      } as Record<string, string>;
    default:
      return {} as Record<string, string>;
  }
}

export function LevelTheme({ children }: { children: ReactNode }) {
  const level = getActiveEducationLevel();
  const style = useMemo(() => varsFor(level), [level]);
  return <div style={style as React.CSSProperties}>{children}</div>;
}
