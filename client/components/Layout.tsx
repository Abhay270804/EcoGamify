import { ReactNode } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { LevelTheme } from "@/components/LevelTheme";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <LevelTheme>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/40">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LevelTheme>
  );
}
