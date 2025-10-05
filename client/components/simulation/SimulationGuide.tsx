import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HOW_TO_PLAY_STEPS, HOW_TO_PLAY_TIPS } from "./how-to-play";

export function SimulationGuide() {
  return (
    <Card className="bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">How to play EcoSphere</CardTitle>
        <CardDescription>
          Follow these steps to guide your campaign. Progress saves
          automatically after every choice, so you can return anytime without
          losing momentum.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {HOW_TO_PLAY_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border bg-white/80 p-4 shadow-sm"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {index + 1}
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Quick tips
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {HOW_TO_PLAY_TIPS.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Alert className="bg-emerald-50">
              <AlertTitle className="text-sm font-semibold text-emerald-900">
                Progress auto-saves
              </AlertTitle>
              <AlertDescription className="text-xs text-emerald-900/90">
                Every action, forecast, or evaluation updates your local save
                instantly. Close the tab and resume later from the same point.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
