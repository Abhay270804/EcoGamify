import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getCurrentUser, updateEducationLevel } from "@/services/auth";

const LEVELS = [
  { id: "elementary", label: "Elementary School" },
  { id: "middle", label: "Middle School" },
  { id: "high", label: "High School" },
  { id: "college", label: "College" },
] as const;

export type EducationLevel = (typeof LEVELS)[number]["id"];

export function LevelSelector({
  value,
  onChange,
}: {
  value?: EducationLevel;
  onChange?: (v: EducationLevel) => void;
}) {
  const [selected, setSelected] = useState<EducationLevel>(
    value ||
      (localStorage.getItem("ecolearn_level") as EducationLevel) ||
      (getCurrentUser()?.educationLevel as EducationLevel) ||
      "elementary",
  );

  useEffect(() => {
    localStorage.setItem("ecolearn_level", selected);
    if (getCurrentUser()) updateEducationLevel(selected);
    onChange?.(selected);
  }, [selected, onChange]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      {LEVELS.map((l) => (
        <button
          key={l.id}
          onClick={() => setSelected(l.id)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm md:text-base transition-colors",
            selected === l.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white/70 hover:bg-secondary/60",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
