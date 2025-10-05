import { useState } from "react";
import { LevelSelector, type EducationLevel } from "@/components/LevelSelector";
import { login, register, getCurrentUser, logout } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthPage() {
  const current = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from || "/";
  const [tab, setTab] = useState<"login" | "register" | "admin">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState<EducationLevel>("elementary");
  const [msg, setMsg] = useState("");

  if (current) {
    return (
      <div className="container mx-auto py-10 max-w-lg">
        <h1 className="text-2xl font-bold">You are signed in</h1>
        <p className="mt-2 text-foreground/70">
          {current.name} · {current.email}
        </p>
        <p className="mt-1 text-sm">
          Education level:{" "}
          <span className="font-medium capitalize">
            {current.educationLevel}
          </span>
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Go Home
          </a>
          <Button
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-lg">
      <div className="mb-6 inline-flex rounded-lg bg-secondary p-1">
        <button
          onClick={() => setTab("register")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "register" ? "bg-white shadow" : "text-foreground/70"}`}
        >
          Register
        </button>
        <button
          onClick={() => setTab("login")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "login" ? "bg-white shadow" : "text-foreground/70"}`}
        >
          Login
        </button>
        <button
          onClick={() => setTab("admin")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${tab === "admin" ? "bg-white shadow" : "text-foreground/70"}`}
        >
          Admin
        </button>
      </div>
      {tab === "register" ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const res = register(name, email, password, level);
            if (!res.ok) setMsg(res.message || "Error");
            else navigate("/");
          }}
        >
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Education level</label>
            <div className="mt-2">
              <LevelSelector value={level} onChange={setLevel} />
            </div>
          </div>
          {!!msg && <p className="text-sm text-red-600">{msg}</p>}
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      ) : tab === "login" ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const res = login(email, password);
            if (!res.ok) setMsg(res.message || "Error");
            else navigate("/");
          }}
        >
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!!msg && <p className="text-sm text-red-600">{msg}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const res = login(
              email || "admin@ecolearn.app",
              password || "admin123",
            );
            if (!res.ok) setMsg(res.message || "Error");
            else navigate("/admin");
          }}
        >
          <div>
            <label className="text-sm font-medium">Admin Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ecolearn.app"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Admin Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>
          <p className="text-xs text-foreground/70">
            Tip: leave blank to use default admin credentials.
          </p>
          {!!msg && <p className="text-sm text-red-600">{msg}</p>}
          <Button type="submit" className="w-full">
            Sign in to Admin
          </Button>
        </form>
      )}
    </div>
  );
}
