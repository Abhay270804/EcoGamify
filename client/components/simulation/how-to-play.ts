export interface HowToPlayStep {
  title: string;
  description: string;
}

export const HOW_TO_PLAY_STEPS: HowToPlayStep[] = [
  {
    title: "Plan strategic actions",
    description:
      "Select up to three actions each year. Choose an action button, then tap tiles to transform your biome and push mission progress forward.",
  },
  {
    title: "Read the weather outlook",
    description:
      "Seasonal forecasts adjust your resources automatically. Review the summary and prepare before advancing to possible emergencies.",
  },
  {
    title: "Respond to disasters",
    description:
      "When crises strike, compare the options and pick the trade-off that best protects your priorities and long-term resilience.",
  },
  {
    title: "Invest in adaptation",
    description:
      "After the crisis, lock in one adaptation policy to reinforce your region. Each choice shifts multiple resource tracks at once.",
  },
  {
    title: "Review yearly outcomes",
    description:
      "Study the evaluation dashboard to gauge sustainability, happiness, and resilience before beginning the next year or restarting.",
  },
];

export const HOW_TO_PLAY_TIPS: string[] = [
  "During the Plan phase, click a tile after selecting an action to apply the change.",
  "Mission progress beneath the action buttons grants bonus boosts when you reach the target.",
  "Keep an eye on the CO₂ meter and scoreboard badges to avoid collapse scenarios.",
];
