export function Footer() {
  return (
    <footer className="border-t bg-white/60 dark:bg-background/80">
      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fcdeaae3f0e5c4f16a396edb9efd87c69%2F14569a937ac94ba3a7daa9bf4794521b"
              alt="EcoGamify logo"
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="text-lg font-bold">EcoGamify</span>
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            Environmental education for every level. Learn, quiz, earn badges
            and redeem eco-rewards.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="text-sm space-y-1">
            <li>
              <a href="/courses" className="hover:text-primary">
                Courses
              </a>
            </li>
            <li>
              <a href="/leaderboard" className="hover:text-primary">
                Weekly Leaderboard
              </a>
            </li>
            <li>
              <a href="/rewards" className="hover:text-primary">
                Rewards
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="text-sm space-y-1">
            <li>
              <a className="hover:text-primary">Privacy</a>
            </li>
            <li>
              <a className="hover:text-primary">Terms</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} EcoGamify. All rights reserved.
      </div>
    </footer>
  );
}
