import { Badge } from "@/components/ui/badge";
import { getWeeklyLeaderboard, type LeagueTier } from "@/services/leaderboard";
import { cn } from "@/lib/utils";

const leagueStyles: Record<LeagueTier, string> = {
  Diamond: "bg-sky-100 text-sky-700 border-sky-200",
  Platinum: "bg-slate-100 text-slate-700 border-slate-200",
  Gold: "bg-amber-100 text-amber-700 border-amber-200",
  Silver: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Bronze: "bg-orange-100 text-orange-700 border-orange-200",
};

export function LeaderboardPreview() {
  const { entries, yourEntry, weekRange } = getWeeklyLeaderboard();
  const topFive = entries.slice(0, 5);
  const isYouInTop = topFive.some((entry) => entry.id === yourEntry?.id);
  const displayRows =
    isYouInTop || !yourEntry ? topFive : [...topFive.slice(0, 4), yourEntry];

  return (
    <div className="rounded-xl border bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold">This Week's Leaderboard</h4>
          <p className="text-xs text-foreground/60">{weekRange}</p>
        </div>
        <a className="text-sm text-primary hover:underline" href="/leaderboard">
          View all
        </a>
      </div>
      <ol className="mt-4 space-y-2">
        {displayRows.map((row, index) => {
          const rank = entries.findIndex((entry) => entry.id === row.id) + 1;
          const isYou = row.id === yourEntry?.id;
          return (
            <li
              key={row.id}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2",
                isYou
                  ? "border-primary/40 bg-primary/5"
                  : "border-transparent bg-secondary/50",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {rank}
                </span>
                <div>
                  <div className="font-medium">
                    {row.name}
                    {isYou && (
                      <span className="ml-2 text-xs text-primary">(You)</span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {row.points} pts
                  </div>
                </div>
              </div>
              <Badge className={cn("border", leagueStyles[row.league])}>
                {row.league}
              </Badge>
            </li>
          );
        })}
      </ol>
      {yourEntry && !isYouInTop && (
        <p className="mt-3 text-xs text-foreground/60">
          You're currently #
          {entries.findIndex((entry) => entry.id === yourEntry.id) + 1} in the{" "}
          {yourEntry.league} League.
        </p>
      )}
    </div>
  );
}
