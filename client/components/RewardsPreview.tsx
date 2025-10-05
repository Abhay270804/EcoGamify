import { redeemPoints, getPoints } from "@/services/points";
import { useState } from "react";

const REWARDS = [
  { id: "seed-pack", label: "Seed Pack", cost: 300 },
  { id: "plantable-pencils", label: "Plantable Pencils (set of 3)", cost: 450 },
  { id: "eco-bottle", label: "Eco Water Bottle", cost: 600 },
  { id: "reusable-tote", label: "Reusable Tote Bag", cost: 500 },
  { id: "tree-plant", label: "Plant a Tree", cost: 800 },
  { id: "compost-kit", label: "Mini Compost Kit", cost: 1000 },
];

export function RewardsPreview() {
  const [points, setPoints] = useState(getPoints());
  return (
    <div className="rounded-xl border bg-white/70 p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">Rewards</h4>
        <a className="text-sm text-primary hover:underline" href="/rewards">
          See more
        </a>
      </div>
      <p className="mt-2 text-sm text-foreground/70">
        Your points: <span className="font-semibold">{points}</span>
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {REWARDS.map((r) => {
          const can = points >= r.cost;
          return (
            <div key={r.id} className="rounded-lg border bg-white px-3 py-3">
              <div className="font-medium">{r.label}</div>
              <div className="text-sm text-foreground/70">{r.cost} pts</div>
              <button
                onClick={() => {
                  if (can && redeemPoints(r.cost, r.label))
                    setPoints(getPoints());
                }}
                disabled={!can}
                className={`mt-2 inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm ${can ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/60"}`}
              >
                {can ? "Redeem" : "Earn more"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
