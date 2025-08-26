import { Place } from "@/types/types";

export const favoritePlaces: Place[] = [
  {
    id: "1",
    name: "Central Mall",
    address: "123 Downtown Street, City Center",
    category: "Shopping",
    distance: "2.3 km",
    estimatedTime: "8 mins",
    image: "/api/placeholder/300/200",
    rating: 4.5,
    visits: 23,
  },
  {
    id: "2",
    name: "Coffee Corner",
    address: "456 Main Avenue, Business District",
    category: "Cafe",
    distance: "1.2 km",
    estimatedTime: "5 mins",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    visits: 45,
  },
  {
    id: "3",
    name: "ဓမ္မနောရမ ဝိပဿနာရိပ်သာ",
    address: "Myo Shaung Road & 3rd Street",
    category: "Healthcare",
    distance: "5.7 km",
    estimatedTime: "15 mins",
    image: "/api/placeholder/300/200",
    rating: 4.2,
    visits: 8,
    lon: 95.653791,
    lat: 16.727404,
  },
  {
    id: "4",
    name: "Tech University",
    address: "321 Education Lane, Campus Area",
    category: "Education",
    distance: "3.8 km",
    estimatedTime: "12 mins",
    image: "/api/placeholder/300/200",
    rating: 4.6,
    visits: 67,
  },
  {
    id: "5",
    name: "International Airport",
    address: "Airport Road, Terminal District",
    category: "Transportation",
    distance: "25.4 km",
    estimatedTime: "35 mins",
    image: "/api/placeholder/300/200",
    rating: 4.1,
    visits: 12,
  },
];

export const recentPlaces: Place[] = [
  {
    id: "6",
    name: "Home",
    address: "42 Residential Street, Suburb",
    category: "Personal",
    distance: "0 km",
    estimatedTime: "Current",
    image: "/api/placeholder/300/200",
    lastVisited: "2 hours ago",
    // icon: <Home className="w-5 h-5" />
  },
  {
    id: "7",
    name: "Office Building",
    address: "88 Corporate Plaza, Business Park",
    category: "Work",
    distance: "4.2 km",
    estimatedTime: "13 mins",
    image: "/api/placeholder/300/200",
    lastVisited: "Yesterday",
    // icon: <Building2 className="w-5 h-5" />
  },
  {
    id: "8",
    name: "Riverside Cafe",
    address: "15 Waterfront Drive, River District",
    category: "Dining",
    distance: "6.1 km",
    estimatedTime: "18 mins",
    image: "/api/placeholder/300/200",
    lastVisited: "3 days ago",
    // icon: <Coffee className="w-5 h-5" />
  },
];

export const FIELD_NAMES = {
  username: "Full name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  username: "text",
  email: "email",
  password: "password",
};
