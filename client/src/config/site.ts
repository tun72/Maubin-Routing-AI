const links = {
  x: "https://twitter.com/sample",
  github: "https://github.com/sample/furniture",
  githubAccount: "https://github.com/sample",
  discord: "https://discord.com/users/sample",
};

export const imageUrl = import.meta.env.VITE_IMAGE_URL;
export const siteConfig = {
  name: "Furniture Shop",
  description: "A Furniture Shopp build with react router.",
  links,
  mainNav: [
    {
      title: "Products",
      card: [
        {
          title: "Wooden",
          href: "/products?categories=1",
          description: "comfortable with Wooden furniture.",
        },
        {
          title: "Bamboo",
          href: "/products?categories=2",
          description: "Build your own Bamboo furniture.",
        },
        {
          title: "Metal",
          href: "/products?categories=3",
          description: "Buy our latest metal furniture.",
        },
      ],
      menu: [
        {
          title: "Services",
          href: "services",
        },
        {
          title: "Blog",
          href: "blogs",
        },
        {
          title: "About Us",
          href: "about",
        },
      ],
    },
  ],
  footerNav: [
    {
      title: "Furniture Types",
      items: [
        {
          title: "Seating",
          href: "/types/seating",
          external: true,
        },
        {
          title: "Lying",
          href: "/types/lying",
          external: true,
        },
        {
          title: "Entertainment",
          href: "/types/entertainment",
          external: true,
        },
        {
          title: "Tables",
          href: "/types/tables",
          external: true,
        },
        {
          title: "Storage",
          href: "/types/storage",
          external: true,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X",
          href: links.x,
          external: true,
        },
        {
          title: "GitHub",
          href: links.githubAccount,
          external: true,
        },
        {
          title: "Discord",
          href: links.discord,
          external: true,
        },
      ],
    },
    {
      title: "Partner",
      items: [
        {
          title: "Shoppy",
          href: "https://shoppy.com",
          external: true,
        },
        {
          title: "Poppy",
          href: "https://poppy.com",
          external: true,
        },
        {
          title: "Talkie",
          href: "https://talkie.com",
          external: true,
        },
        {
          title: "coffee",
          href: "https://coffee.com",
          external: true,
        },
      ],
    },
  ],
};

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
