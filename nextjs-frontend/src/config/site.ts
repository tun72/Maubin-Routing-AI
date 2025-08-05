export const themeClasses = {
  dark: {
    text: "text-white",
    textMuted: "text-white/70",
    textSecondary: "text-white/60",
    cardBg: "from-white/20 to-white/5",
    cardBorder: "border-white/20",
    headerBg: "bg-white/10",
    footerBg: "bg-black/20",
    accent: "from-cyan-400 to-purple-400",
    accentBg: "bg-sky-500",
    accentGradient: "from-sky-500 to-cyan-400",
    inputBg: "bg-gray-800",
    inputBorder: "border-gray-600",
    border: "border-white/20",
  },
  light: {
    text: "text-gray-900",
    textMuted: "text-gray-600",
    textSecondary: "text-gray-500",
    cardBg: "from-white/90 to-white/60",
    cardBorder: "border-gray-200/50",
    headerBg: "bg-white/80",
    footerBg: "bg-white/60",
    accent: "from-blue-600 to-purple-600",
    accentBg: "bg-sky-500",
    accentGradient: "from-sky-500 to-cyan-400",
    inputBg: "bg-slate-100",
    inputBorder: "border-slate-300",
    border: "border-gray-200/50",
  },
};

export const locations = [
  { id: 1, name: "Coffee Shop", x: 25, y: 35 },
  { id: 2, name: "Restaurant", x: 75, y: 28 },
  { id: 3, name: "Shopping Mall", x: 80, y: 65 },
  { id: 4, name: "Central Park", x: 35, y: 75 },
  { id: 5, name: "Hospital", x: 15, y: 60 },
  { id: 6, name: "You", x: 50, y: 50, type: "user" },
];

export const paths = {
  1: "M 50 50 Q 37 42 25 35",
  2: "M 50 50 Q 62 39 75 28",
  3: "M 50 50 Q 65 57 80 65",
  4: "M 50 50 Q 42 62 35 75",
  5: "M 50 50 Q 32 55 15 60",
};

export const galleryImages = [
  {
    id: 1,
    title: "Real-time Navigation",
    description:
      "Experience seamless turn-by-turn navigation with live traffic updates.",
    image:
      "https://images.unsplash.com/photo-1551410224-699683e15636?fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Smart Route Planning",
    description:
      "AI analyzes millions of data points to find your optimal route.",
    image:
      "https://images.unsplash.com/photo-1586829135343-132950070391?fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Multi-modal Transport",
    description:
      "Seamlessly switch between driving, walking, and public transport.",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Offline Maps",
    description: "Navigate confidently even without an internet connection.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?fit=crop&crop=center",
  },
];
