// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatData(input: any): Place {
  const road = input.road_names[0]; // take first road name if available

  return {
    id: input.id,
    name: input.end, // destination as name
    address: road
      ? `${road.burmese_name} (${road.english_name})`
      : "Unknown Road",
    category: "Route",
    distance: `${Number(input.distance).toFixed(2)} m`,
    estimatedTime: `${Number(input.duration).toFixed(2)} min`,
    image: "/api/placeholder/300/200",
    rating: 0,
    visits: 30,
  };
}
