import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/services/auth";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between gap-[74px] lg:gap-0">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fcdeaae3f0e5c4f16a396edb9efd87c69%2Fd708e6b572004fcca3d5df69c25a8665"
            alt="EcoGamify logo"
            className="h-9 w-9 rounded-[10px] object-cover"
          />
          <span className="text-xl font-bold tracking-tight">EcoGamify</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 max-[991px]:justify-start lg:gap-8 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`
            }
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/simulation"
            className={({ isActive }) =>
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`
            }
          >
            Eco Simulation
          </NavLink>
          <NavLink
            to="/rewards"
            className={({ isActive }) =>
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/70"}`
            }
          >
            Rewards
          </NavLink>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/courses">Start Learning</Link>
          </Button>
          <Button asChild>
            <Link to="/badges">Badges</Link>
          </Button>
          {isAdmin() && (
            <Button asChild variant="outline">
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
