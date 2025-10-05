import type { EducationLevel } from "@/components/LevelSelector";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type Question = {
  id: string;
  q: string;
  options: string[];
  answer: number;
};
export type Lesson = {
  id: string;
  title: string;
  youtubeVideoId?: string;
  youtubeSearchQuery?: string;
  quiz: Question[];
};
export type Course = {
  id: string;
  title: string;
  level: CourseLevel;
  audience: EducationLevel[];
  description: string;
  pointsPerQuiz: number;
  lessons: Lesson[];
  badge: { id: string; label: string };
};

export const COURSES: Course[] = [
  {
    id: "elementary-beginner",
    title: "Discovering Our Environment",
    level: "Beginner",
    audience: ["elementary"],
    description:
      "Introductory lessons for young learners focusing on the air, water, and living things around them.",
    pointsPerQuiz: 40,
    badge: { id: "badge_elem_beginner", label: "Junior Eco Explorer" },
    lessons: [
      {
        id: "elem-beg-1",
        title: "What is Environment?",
        quiz: [
          {
            id: "q1",
            q: "Which of these is part of the environment?",
            options: ["A leafy tree", "A toy robot", "A video game"],
            answer: 0,
          },
          {
            id: "q2",
            q: "The air, water, and animals around us are called the...",
            options: ["Environment", "Homework", "Lunch"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Which place do fish call home?",
            options: ["A river or ocean", "A bookshelf", "A backpack"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Breathing clean air helps us stay...",
            options: ["Sleepy all day", "Healthy and strong", "Like robots"],
            answer: 1,
          },
        ],
      },
      {
        id: "elem-beg-2",
        title: "Our Needs from Nature",
        quiz: [
          {
            id: "q1",
            q: "Apples and bananas come from...",
            options: ["Plants", "Plastic", "Metal"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Clean drinking water comes from...",
            options: ["Rivers, lakes, and rain", "Television", "Crayons"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Wood for many homes and furniture comes from...",
            options: ["Trees", "Clouds", "Computers"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Sunlight helps plants by letting them make...",
            options: ["Food through photosynthesis", "Noise", "Snowflakes"],
            answer: 0,
          },
        ],
      },
      {
        id: "elem-beg-3",
        title: "Keep it Clean",
        quiz: [
          {
            id: "q1",
            q: "If you see litter in the park you should...",
            options: [
              "Pick it up with care and place it in a bin",
              "Ignore it and keep walking",
              "Kick it into the bushes",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Planting trees helps because they...",
            options: [
              "Clean the air and give shade",
              "Make loud noises",
              "Scare away animals",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Which symbol reminds us to recycle?",
            options: ["♻️", "⛔", "⚡"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Keeping classrooms tidy and washing hands keeps the environment...",
            options: ["Clean and safe", "Messy", "Sticky"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "elementary-intermediate",
    title: "Seasons, Habitats, and Saving Resources",
    level: "Intermediate",
    audience: ["elementary"],
    description:
      "Learners explore weather patterns, local ecosystems, and everyday ways to protect resources.",
    pointsPerQuiz: 55,
    badge: { id: "badge_elem_intermediate", label: "Eco Investigator" },
    lessons: [
      {
        id: "elem-int-4",
        title: "Seasons & Weather",
        quiz: [
          {
            id: "q1",
            q: "Which season is usually cold with snow in many places?",
            options: ["Winter", "Summer", "Autumn"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Flowers begin to bloom most in...",
            options: ["Spring", "Late winter", "Midnight"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Weather describes...",
            options: [
              "Day-to-day conditions like sun or rain",
              "Only where animals live",
              "Names of the months",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "On a rainy day you should carry a...",
            options: ["Beach towel", "Umbrella or raincoat", "Skateboard"],
            answer: 1,
          },
        ],
      },
      {
        id: "elem-int-5",
        title: "Plants and Animals Around Us",
        quiz: [
          {
            id: "q1",
            q: "Bees help plants by...",
            options: ["Carrying pollen", "Eating leaves", "Making holes"],
            answer: 0,
          },
          {
            id: "q2",
            q: "A frog is most likely to live in a...",
            options: ["Pond", "Toy box", "School bus"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Plant roots help by...",
            options: [
              "Holding the plant in place and soaking up water",
              "Singing songs",
              "Glowing in the dark",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Animals need which three things to survive?",
            options: [
              "Food, water, and shelter",
              "Video games, glitter, and posters",
              "Hats, kites, and crayons",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "elem-int-6",
        title: "Save Water & Electricity",
        quiz: [
          {
            id: "q1",
            q: "Turning off lights when leaving a room saves...",
            options: ["Electricity", "Paint", "Snacks"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Taking shorter showers helps save...",
            options: ["Water", "Homework", "Shoes"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Closing the tap while brushing stops...",
            options: ["Water waste", "Sunshine", "Music"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Energy-efficient bulbs use...",
            options: ["More energy", "Less electricity", "Only batteries"],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: "elementary-advanced",
    title: "Protecting Nature at Home",
    level: "Advanced",
    audience: ["elementary"],
    description:
      "Older elementary students investigate pollution, recycling, and how their choices can protect nature.",
    pointsPerQuiz: 65,
    badge: { id: "badge_elem_advanced", label: "Eco Guardian" },
    lessons: [
      {
        id: "elem-adv-7",
        title: "Pollution Types",
        quiz: [
          {
            id: "q1",
            q: "Car horns and loud machines create...",
            options: ["Noise pollution", "Water pollution", "Soil pollution"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Trash floating in a river is an example of...",
            options: ["Water pollution", "Air pollution", "Noise pollution"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Smoke from factories that makes the sky grey is...",
            options: ["Air pollution", "Light pollution", "No pollution"],
            answer: 0,
          },
          {
            id: "q4",
            q: "A clean beach without litter shows...",
            options: [
              "People prevented pollution",
              "Pollution is increasing",
              "Noise pollution",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "elem-adv-8",
        title: "Recycling & Reuse",
        quiz: [
          {
            id: "q1",
            q: "A glass bottle belongs in the...",
            options: ["Recycling bin", "Trash can", "Garden"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Using both sides of paper is an example of...",
            options: ["Reusing", "Wasting", "Hiding"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Turning an old T-shirt into a cleaning cloth is...",
            options: ["Upcycling", "Polluting", "Ignoring"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Items that cannot be recycled should be...",
            options: [
              "Reduced or reused when possible",
              "Dumped in rivers",
              "Burned in the yard",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "elem-adv-9",
        title: "Our Role in Protecting Nature",
        quiz: [
          {
            id: "q1",
            q: "Joining a school cleanup shows...",
            options: ["Active stewardship", "Disinterest", "Pollution"],
            answer: 0,
          },
          {
            id: "q2",
            q: "If your friend leaves the water running, you should...",
            options: [
              "Kindly remind them to turn it off",
              "Laugh about it",
              "Waste more water too",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Which action reduces waste at lunch?",
            options: [
              "Using a reusable bottle",
              "Buying extra plastic forks",
              "Throwing food away",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Teaching others about recycling is an example of...",
            options: [
              "Sharing knowledge",
              "Keeping secrets",
              "Ignoring nature",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "middle-beginner",
    title: "Middle School Environment Foundations",
    level: "Beginner",
    audience: ["middle"],
    description:
      "Students examine living and non-living components, energy flow, and natural resources in their communities.",
    pointsPerQuiz: 60,
    badge: { id: "badge_middle_beginner", label: "Eco Analyst" },
    lessons: [
      {
        id: "mid-beg-1",
        title: "Components of Environment",
        quiz: [
          {
            id: "q1",
            q: "Biotic components are...",
            options: ["Living things", "Rocks only", "Clouds"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Abiotic components include...",
            options: ["Sunlight and soil", "Birds", "Trees"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Which pair shows biotic and abiotic parts working together?",
            options: [
              "A plant using sunlight",
              "A computer and a chair",
              "A book and a pencil",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Healthy ecosystems need...",
            options: [
              "Only animals",
              "Both biotic and abiotic parts",
              "Only air",
            ],
            answer: 1,
          },
        ],
      },
      {
        id: "mid-beg-2",
        title: "Food Chains & Webs",
        quiz: [
          {
            id: "q1",
            q: "A food chain usually starts with...",
            options: ["Producers like plants", "Carnivores", "Decomposers"],
            answer: 0,
          },
          {
            id: "q2",
            q: "In grass → rabbit → fox, the rabbit is a...",
            options: ["Producer", "Primary consumer", "Decomposer"],
            answer: 1,
          },
          {
            id: "q3",
            q: "Food webs show...",
            options: [
              "Many connected food chains",
              "Weather patterns",
              "Migration routes",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Removing one species from a food web can...",
            options: [
              "Disrupt the balance",
              "Have no effect",
              "Stop photosynthesis",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "mid-beg-3",
        title: "Natural Resources",
        quiz: [
          {
            id: "q1",
            q: "Wind and sunlight are...",
            options: [
              "Renewable resources",
              "Non-renewable resources",
              "Waste products",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Coal is a...",
            options: [
              "Non-renewable fossil fuel",
              "Renewable resource",
              "Recyclable plastic",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Choosing public transport conserves...",
            options: ["Fresh vegetables", "Fossil fuels", "Starlight"],
            answer: 1,
          },
          {
            id: "q4",
            q: "Recycling aluminum cans saves...",
            options: [
              "Energy and raw materials",
              "Extra trash",
              "Nothing at all",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "middle-intermediate",
    title: "Managing Forests, Water, and Waste",
    level: "Intermediate",
    audience: ["middle"],
    description:
      "Learners evaluate human impacts such as deforestation and develop practical water and waste solutions.",
    pointsPerQuiz: 70,
    badge: { id: "badge_middle_intermediate", label: "Resource Protector" },
    lessons: [
      {
        id: "mid-int-4",
        title: "Deforestation & Its Effects",
        quiz: [
          {
            id: "q1",
            q: "Deforestation is...",
            options: [
              "Large-scale removal of forests",
              "Planting new trees",
              "A natural disaster",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "One effect of deforestation is...",
            options: [
              "Loss of wildlife habitat",
              "Instant soil improvement",
              "Less erosion",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Planting native trees helps because it...",
            options: [
              "Restores habitats",
              "Creates pollution",
              "Uses more paper",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "A policy response to deforestation is...",
            options: [
              "Creating protected forest reserves",
              "Cutting trees faster",
              "Ignoring illegal logging",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "mid-int-5",
        title: "Water Cycle & Conservation",
        quiz: [
          {
            id: "q1",
            q: "Water evaporates when...",
            options: ["The sun heats liquid water", "It rains", "We freeze it"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Condensation in the water cycle forms...",
            options: ["Clouds", "Mountains", "Soil"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Collecting rainwater in barrels is an example of...",
            options: ["Conservation", "Pollution", "Deforestation"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Fixing leaks at school helps by...",
            options: ["Saving water", "Making noise", "Adding pollution"],
            answer: 0,
          },
        ],
      },
      {
        id: "mid-int-6",
        title: "Waste Management",
        quiz: [
          {
            id: "q1",
            q: "The three Rs stand for...",
            options: [
              "Reduce, Reuse, Recycle",
              "Read, Run, Rest",
              "React, Refuse, Report",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Composting lunch scraps turns waste into...",
            options: ["Soil nutrients", "Plastic", "Metal"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Hazardous waste should be...",
            options: [
              "Taken to special collection centers",
              "Thrown in the trash",
              "Buried in the yard",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Choosing products with less packaging helps by...",
            options: [
              "Reducing waste",
              "Making it heavier",
              "Creating more trash",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "middle-advanced",
    title: "Climate Action and Community Projects",
    level: "Advanced",
    audience: ["middle"],
    description:
      "Students connect global climate science with biodiversity and local action through project-based learning.",
    pointsPerQuiz: 80,
    badge: { id: "badge_middle_advanced", label: "Climate Champion" },
    lessons: [
      {
        id: "mid-adv-7",
        title: "Climate Change & Global Warming",
        quiz: [
          {
            id: "q1",
            q: "Global warming refers to...",
            options: [
              "A long-term increase in Earth's average temperature",
              "Daily weather changes",
              "Moon phases",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "A main driver of climate change is increased...",
            options: ["Greenhouse gases", "Rainfall", "Earthquakes"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Melting polar ice can...",
            options: [
              "Raise sea levels",
              "Cool the planet",
              "Stop evaporation",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Students can help by...",
            options: [
              "Saving energy and speaking up",
              "Burning more fuel",
              "Ignoring the issue",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "mid-adv-8",
        title: "Biodiversity & Its Importance",
        quiz: [
          {
            id: "q1",
            q: "Biodiversity means...",
            options: [
              "The variety of life in an area",
              "The amount of rain",
              "The number of rocks",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Losing species can...",
            options: [
              "Disrupt ecosystems",
              "Improve soil instantly",
              "Grow new mountains",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Protecting pollinators helps because...",
            options: [
              "They support food crops",
              "They make loud noise",
              "They create plastic",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Endangered species are...",
            options: [
              "At risk of extinction",
              "Always predators",
              "Plants only",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "mid-adv-9",
        title: "Local Environmental Projects",
        quiz: [
          {
            id: "q1",
            q: "A community garden project builds...",
            options: [
              "Healthy food access",
              "More pavement",
              "Noise pollution",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Measuring litter before and after a cleanup is a...",
            options: ["Way to track impact", "Waste of time", "Punishment"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Sharing project results with local leaders is...",
            options: ["Advocacy", "Avoidance", "Littering"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Working in teams teaches...",
            options: [
              "Collaboration skills",
              "How to ignore issues",
              "More pollution",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "high-beginner",
    title: "High School Environmental Systems",
    level: "Beginner",
    audience: ["high"],
    description:
      "Students analyze ecosystems, energy resources, and population dynamics at a high-school level.",
    pointsPerQuiz: 75,
    badge: { id: "badge_high_beginner", label: "Systems Explorer" },
    lessons: [
      {
        id: "high-beg-1",
        title: "Ecosystems: Types & Functions",
        quiz: [
          {
            id: "q1",
            q: "Which of these is an ecosystem?",
            options: ["A coral reef", "A math textbook", "A baseball"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Producers in ecosystems...",
            options: [
              "Create energy-rich food via photosynthesis",
              "Only eat animals",
              "Break down waste",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Ecosystem functions include...",
            options: ["Nutrient cycling", "Timekeeping", "Coloring pages"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Disturbing a keystone species can...",
            options: [
              "Alter the entire ecosystem",
              "Have no effect",
              "Stop gravity",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "high-beg-2",
        title: "Energy Resources",
        quiz: [
          {
            id: "q1",
            q: "Solar and wind power are...",
            options: [
              "Renewable energy sources",
              "Fossil fuels",
              "Nuclear waste",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Burning coal releases...",
            options: [
              "Carbon dioxide and pollutants",
              "Only clean oxygen",
              "Nothing at all",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Energy efficiency means...",
            options: [
              "Getting the same service with less energy",
              "Using more electricity",
              "Turning off all power forever",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Geothermal energy uses heat from...",
            options: ["Deep within Earth", "Clouds", "Icebergs"],
            answer: 0,
          },
        ],
      },
      {
        id: "high-beg-3",
        title: "Human Population & Environment",
        quiz: [
          {
            id: "q1",
            q: "Rapid population growth can increase...",
            options: ["Resource demand", "Star formation", "Mountain height"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Urban sprawl often leads to...",
            options: ["Habitat loss", "Fewer roads", "Lower energy use"],
            answer: 0,
          },
          {
            id: "q3",
            q: "Carrying capacity describes...",
            options: [
              "The maximum population an environment can support",
              "Total number of cities",
              "Amount of rainfall",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Investing in education, especially for girls, often...",
            options: [
              "Improves health and stabilizes population",
              "Uses more fossil fuels",
              "Increases pollution immediately",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "high-intermediate",
    title: "Policies, Ethics, and Movements",
    level: "Intermediate",
    audience: ["high"],
    description:
      "Students explore how regulations, ethics, and social movements drive environmental change.",
    pointsPerQuiz: 90,
    badge: { id: "badge_high_intermediate", label: "Policy Pathfinder" },
    lessons: [
      {
        id: "high-int-4",
        title: "Pollution Management",
        quiz: [
          {
            id: "q1",
            q: "The Clean Air Act is an example of...",
            options: [
              "Pollution control law",
              "Agriculture policy",
              "Ocean treaty",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Electrostatic precipitators remove...",
            options: [
              "Particles from smokestacks",
              "Fish from rivers",
              "Noise from cities",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Switching to electric buses reduces...",
            options: ["Tailpipe emissions", "School attendance", "Library use"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Life-cycle analysis helps compare...",
            options: [
              "Environmental impacts of products",
              "Movie plots",
              "Sports scores",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "high-int-5",
        title: "Environmental Ethics & Sustainable Living",
        quiz: [
          {
            id: "q1",
            q: "The precautionary principle suggests...",
            options: [
              "Acting to prevent harm even without full proof",
              "Waiting for complete certainty",
              "Ignoring risks",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "A sustainable lifestyle practice is...",
            options: [
              "Buying durable goods for long use",
              "Using disposable items every day",
              "Leaving lights on constantly",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Environmental justice focuses on...",
            options: [
              "Fair distribution of environmental benefits and burdens",
              "Only wildlife concerns",
              "Corporate profits",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Personal carbon footprint can be lowered by...",
            options: [
              "Reducing car travel",
              "Flying more for fun",
              "Buying extra plastic items",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "high-int-6",
        title: "Environmental Movements",
        quiz: [
          {
            id: "q1",
            q: "The Chipko movement is known for...",
            options: [
              "Tree hugging to prevent logging",
              "Ocean cleanup",
              "Building dams",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "The Paris Agreement aims to...",
            options: [
              "Limit global temperature rise",
              "Increase fossil fuel use",
              "Reduce recycling",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Rachel Carson's 'Silent Spring' raised awareness about...",
            options: ["Pesticide impacts", "Galaxy formation", "Fast cars"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Grassroots movements succeed by...",
            options: [
              "Community organizing and advocacy",
              "Keeping issues secret",
              "Avoiding media",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "high-advanced",
    title: "Advanced Climate and Conservation",
    level: "Advanced",
    audience: ["high"],
    description:
      "Learners evaluate international climate policy and design conservation strategies that safeguard ecosystems.",
    pointsPerQuiz: 110,
    badge: { id: "badge_high_advanced", label: "Policy Strategist" },
    lessons: [
      {
        id: "high-adv-7",
        title: "Climate Policies & International Cooperation",
        quiz: [
          {
            id: "q1",
            q: "Nationally Determined Contributions are...",
            options: [
              "Country plans for emissions reductions",
              "Types of renewable energy",
              "Trade agreements",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Carbon pricing tools include...",
            options: [
              "Taxes or cap-and-trade systems",
              "Food labels",
              "River restoration",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Loss and damage funds support...",
            options: [
              "Vulnerable nations facing climate impacts",
              "Fossil fuel expansion",
              "Sports events",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "The IPCC provides...",
            options: [
              "Scientific assessments on climate change",
              "New laws",
              "Private investments",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "high-adv-8",
        title: "Conservation Strategies",
        quiz: [
          {
            id: "q1",
            q: "Protected areas conserve biodiversity by...",
            options: [
              "Limiting damaging activities",
              "Removing all humans permanently",
              "Selling land for development",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Wildlife corridors help by...",
            options: [
              "Connecting habitats",
              "Isolating species",
              "Adding pollution",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Marine protected areas can...",
            options: [
              "Restore fish populations",
              "Increase overfishing",
              "Stop waves",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Community-based conservation succeeds when...",
            options: [
              "Local people co-manage resources",
              "Outsiders ignore local voices",
              "Poaching is rewarded",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "high-adv-9",
        title: "Project: Local Environmental Issues",
        quiz: [
          {
            id: "q1",
            q: "A strong project begins by...",
            options: [
              "Assessing the local issue with data",
              "Assuming the answer",
              "Skipping research",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "A waste audit measures...",
            options: [
              "Types and amounts of waste generated",
              "Student grades",
              "Daily temperature",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Peer review improves projects by...",
            options: [
              "Providing constructive feedback",
              "Copying homework",
              "Hiding mistakes",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Effective presentations include...",
            options: [
              "Clear visuals and actionable steps",
              "Unrelated stories",
              "No evidence",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "college-beginner",
    title: "Foundations of Environmental Science",
    level: "Beginner",
    audience: ["college"],
    description:
      "Undergraduates build a shared vocabulary in environmental science, systems thinking, and resource economics.",
    pointsPerQuiz: 90,
    badge: { id: "badge_college_beginner", label: "EnvSci Scholar" },
    lessons: [
      {
        id: "col-beg-1",
        title: "Introduction to Environmental Science",
        quiz: [
          {
            id: "q1",
            q: "Environmental science is an interdisciplinary field combining...",
            options: [
              "Biology, chemistry, geology, and policy",
              "Only physics",
              "Art history",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Systems thinking means...",
            options: [
              "Understanding how parts interact",
              "Focusing on one part only",
              "Ignoring feedback",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "A control group in experiments is used to...",
            options: [
              "Compare against the treatment",
              "Increase sample bias",
              "Stop data collection",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Baseline data help scientists...",
            options: [
              "Measure change over time",
              "Avoid analysis",
              "Skip statistics",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-beg-2",
        title: "Ecosystem Dynamics & Ecological Balance",
        quiz: [
          {
            id: "q1",
            q: "Succession describes...",
            options: [
              "Gradual change in species composition",
              "Daily weather changes",
              "Instant evolution",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Negative feedback loops tend to...",
            options: [
              "Stabilize systems",
              "Destabilize systems",
              "Create new species",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Carrying capacity is reached when...",
            options: [
              "Population growth equals resource limits",
              "Resources are unlimited",
              "Predators disappear",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Trophic cascades occur when...",
            options: [
              "Changes at one level affect others",
              "Species act independently",
              "Only plants change",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-beg-3",
        title: "Natural Resource Economics",
        quiz: [
          {
            id: "q1",
            q: "Externalities are...",
            options: [
              "Costs or benefits not reflected in price",
              "Government taxes only",
              "Scarcity measures",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "A cost-benefit analysis compares...",
            options: [
              "Total expected gains and losses",
              "Only profits",
              "Only costs",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "The tragedy of the commons occurs when...",
            options: [
              "Shared resources are overused",
              "People cooperate perfectly",
              "Resources are privately owned",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Sustainable yield means harvesting...",
            options: [
              "At a rate the resource can replenish",
              "As much as possible now",
              "Only when prices drop",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "college-intermediate",
    title: "Climate Policy and Sustainable Technology",
    level: "Intermediate",
    audience: ["college"],
    description:
      "Students dig into climate modeling, environmental law, and technologies that enable sustainable futures.",
    pointsPerQuiz: 110,
    badge: { id: "badge_college_intermediate", label: "Climate Analyst" },
    lessons: [
      {
        id: "col-int-4",
        title: "Climate Models & Predictions",
        quiz: [
          {
            id: "q1",
            q: "General circulation models simulate...",
            options: [
              "Atmosphere and ocean interactions",
              "Only volcanoes",
              "Animal migrations",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Scenario pathways like SSPs describe...",
            options: [
              "Possible socio-economic futures",
              "Exact weather tomorrow",
              "Historical inventions",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Model validation compares predictions to...",
            options: ["Observed data", "Opinions", "Advertisements"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Ensemble modeling helps by...",
            options: [
              "Reducing uncertainty through multiple runs",
              "Eliminating computers",
              "Ignoring variability",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-int-5",
        title: "Environmental Law & Policy",
        quiz: [
          {
            id: "q1",
            q: "The precautionary principle appears in...",
            options: ["The Rio Declaration", "Sports rulebooks", "Cookbooks"],
            answer: 0,
          },
          {
            id: "q2",
            q: "Environmental Impact Statements are required by...",
            options: [
              "NEPA in the United States",
              "The Paris Agreement",
              "The World Health Organization",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Command-and-control regulation relies on...",
            options: [
              "Specific limits and enforcement",
              "Voluntary pledges only",
              "Tax breaks alone",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "International treaties rely on...",
            options: [
              "Cooperation and verification",
              "Single-country enforcement",
              "No monitoring",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-int-6",
        title: "Technology for Sustainability",
        quiz: [
          {
            id: "q1",
            q: "Smart grids help integrate...",
            options: [
              "Variable renewable energy",
              "More diesel use",
              "Only natural gas",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Life-cycle assessment evaluates...",
            options: [
              "Impacts from raw materials to disposal",
              "Only purchase price",
              "Marketing success",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Circular economy strategies aim to...",
            options: [
              "Keep materials in use longer",
              "Increase waste",
              "Ignore recycling",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Precision agriculture can reduce...",
            options: ["Water and fertilizer use", "Cloud cover", "Wind speed"],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "college-advanced",
    title: "Research and Impact Assessment",
    level: "Advanced",
    audience: ["college"],
    description:
      "Advanced students design research, lead impact assessments, and deliver professional sustainability projects.",
    pointsPerQuiz: 130,
    badge: { id: "badge_college_advanced", label: "Sustainability Leader" },
    lessons: [
      {
        id: "col-adv-7",
        title: "Research Methods in Environmental Studies",
        quiz: [
          {
            id: "q1",
            q: "A mixed-methods approach combines...",
            options: [
              "Quantitative and qualitative data",
              "Lab work and painting",
              "Only surveys",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Peer-reviewed journals ensure...",
            options: [
              "Quality through expert evaluation",
              "Faster publication regardless",
              "No revisions are needed",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Spatial analysis in environmental research often uses...",
            options: ["GIS tools", "Musical instruments", "Only spreadsheets"],
            answer: 0,
          },
          {
            id: "q4",
            q: "Ethical research requires...",
            options: [
              "Informed consent and transparency",
              "Ignoring stakeholders",
              "Hiding methods",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-adv-8",
        title: "Environmental Impact Assessment (EIA)",
        quiz: [
          {
            id: "q1",
            q: "Scoping in an EIA identifies...",
            options: [
              "Key issues and stakeholders",
              "Final mitigation plans",
              "Weather forecasts",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Mitigation measures are designed to...",
            options: [
              "Reduce negative impacts",
              "Increase project cost only",
              "Delay approvals",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "Public participation in an EIA provides...",
            options: [
              "Local knowledge and legitimacy",
              "Distractions",
              "Guaranteed approval",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "Post-project monitoring tracks...",
            options: [
              "Actual impacts versus predictions",
              "Marketing success",
              "Stock prices",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "col-adv-9",
        title: "Capstone Project – Sustainable Solutions",
        quiz: [
          {
            id: "q1",
            q: "A strong proposal includes...",
            options: [
              "Clear objectives, methods, and timeline",
              "Surprises only",
              "No references",
            ],
            answer: 0,
          },
          {
            id: "q2",
            q: "Stakeholder mapping helps...",
            options: [
              "Identify who is affected",
              "Hide project goals",
              "Avoid engagement",
            ],
            answer: 0,
          },
          {
            id: "q3",
            q: "For an oral defense, students should...",
            options: [
              "Explain evidence and answer questions",
              "Read slides word-for-word",
              "Ignore feedback",
            ],
            answer: 0,
          },
          {
            id: "q4",
            q: "A written report should conclude with...",
            options: [
              "Actionable recommendations",
              "Blank pages",
              "Unrelated stories",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
];
