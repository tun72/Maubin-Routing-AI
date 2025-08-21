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
