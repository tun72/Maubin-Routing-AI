interface AuthCredentials {
  username: string;
  email: string;
  password: string;
  token?: string;
  id?: string;
}

interface Locations {
  burmese_name: string;
  english_name: string;
  address: string;
  description: string;
  lon: number;
  lat: number;
  type: string;
}

interface Roads {
  burmese_name: string;
  english_name: string;
  coordinates: number[][];
  length_m: number[];
  road_type: string;
}

interface Routes {
  start_lat: number;
  start_lon: number;
  end_lon: number;
  end_lat: number;
}

interface Location {
  address: string;
  burmese_name: string;
  description: null;
  english_name: string;
  description?: string;
  id?: string;
  lat: number;
  lon: number;
  type: string;
}

interface StepLocation {
  address: string;
  burmese_name: string;
  english_name: string;
  latitude: number;
  longitude: number;
  type: string;
}

interface RoadName {
  burmese_name: string;
  english_name: string;
  length: string;
  road_id: string;
}

interface RouteData {
  distance: number;
  end_location: StepLocation;
  estimated_time: number;
  is_success: boolean;
  road_names: RoadName[];
  route: {
    geometry: {
      coordinates: number[][];
      type: string;
    };
    type: string;
  };
  route_id: string;
  start_location: StepLocation;
  step_locations: StepLocation[];
}

type Place = {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  estimatedTime: string;
  image: string;
  rating: number;
  visits: number;
};

interface Road {
  id: string;
  // Add other road properties here
  name?: string;
  burmese_name?: string;
  english_name?: string;
  road_type?: string;
  from_location?: string;
  to_location?: string;
  distance?: number;
  condition?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
