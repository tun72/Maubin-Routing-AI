export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  estimatedTime: string;
  image: string;
  rating?: number;
  visits?: number;
  lastVisited?: string;
}
