import { RewardsPreview } from "@/components/RewardsPreview";

export default function RewardsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Rewards</h1>
      <p className="mt-2 text-foreground/70">
        Redeem prizes with the points you earn from perfect quizzes.
      </p>
      <div className="mt-6 max-w-3xl">
        <RewardsPreview />
      </div>
    </div>
  );
}
