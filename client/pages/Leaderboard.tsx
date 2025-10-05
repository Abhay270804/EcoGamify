import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getWeeklyLeaderboard, type LeagueTier } from "@/services/leaderboard";
import { cn } from "@/lib/utils";

const leagueColors: Record<LeagueTier, string> = {
  Diamond: "bg-sky-100 text-sky-700 border-sky-200",
  Platinum: "bg-slate-100 text-slate-700 border-slate-200",
  Gold: "bg-amber-100 text-amber-700 border-amber-200",
  Silver: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Bronze: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function LeaderboardPage() {
  const { entries, yourEntry, weekRange } = getWeeklyLeaderboard();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Weekly Leaderboard
          </h1>
          <p className="mt-1 text-foreground/70">
            {weekRange}. Resets every Monday at 00:00.
          </p>
        </div>
        <Button asChild>
          <a href="/simulation">Earn Points in EcoSphere</a>
        </Button>
      </div>

      {yourEntry && (
        <section className="rounded-2xl border bg-white/80 p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Your Standing</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-foreground/60">Current League</p>
              <Badge
                className={cn("mt-1 border", leagueColors[yourEntry.league])}
              >
                {yourEntry.league}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Ranking</p>
              <p className="text-2xl font-semibold">
                #{entries.findIndex((entry) => entry.id === yourEntry.id) + 1}
              </p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Points</p>
              <p className="text-2xl font-semibold">{yourEntry.points}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border bg-white/80 p-5 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">League Standings</h2>
          <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
            <Legend label="Diamond" color="bg-sky-500" />
            <Legend label="Platinum" color="bg-slate-400" />
            <Legend label="Gold" color="bg-amber-400" />
            <Legend label="Silver" color="bg-zinc-400" />
            <Legend label="Bronze" color="bg-orange-500" />
          </div>
        </header>
        <div className="mt-4 overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">League</th>
                <th className="px-4 py-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((row, index) => {
                const isYou = yourEntry && row.id === yourEntry.id;
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-t border-muted/40",
                      isYou
                        ? "bg-primary/5"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-muted/30",
                    )}
                  >
                    <td className="px-4 py-3 font-semibold text-primary/80">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {row.name}
                        {isYou && (
                          <span className="ml-2 text-xs text-primary">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn("border", leagueColors[row.league])}>
                        {row.league}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      {label}
    </span>
  );
}
