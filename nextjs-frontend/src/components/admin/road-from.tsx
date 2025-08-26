/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, Plus, X, Check, ChevronsUpDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRoadStore } from "@/store/use-roads-store"
import { useLocationStore } from "@/store/use-location-store"

const routeSchema = z.object({
    burmese_name: z.string().min(1, "Burmese name is required"),
    english_name: z.string().min(1, "English name is required"),
    coordinates: z.array(z.array(z.number())).min(1, "At least one coordinate pair is required"),
    length_m: z.string(),
    road_type: z.string().min(1, "Road type is required"),
    is_oneway: z.boolean().default(false).optional(),
})

type RouteFormData = z.infer<typeof routeSchema>
type CoordinatePair = { name: string; coordinates: [number, number] }

interface Road {
    id?: string;
    burmese_name: string;
    english_name: string;
    coordinates: number[][];
    length_m: number[];
    road_type: string;
    is_oneway?: boolean;
    geojson: string;
}

const roadTypes = ['highway', 'local', 'residential', 'service', 'pedestrian']

// Memoized coordinate pair component to prevent unnecessary re-renders
const CoordinatePairItem = ({
    pair,
    index,
    onRemove
}: {
    pair: CoordinatePair;
    index: number;
    onRemove: (index: number) => void;
}) => (
    <div className="flex items-center justify-between bg-muted p-2 rounded-md">
        <div className="flex-1">
            <span className="font-medium">{pair.name}</span>
            <span className="text-sm text-muted-foreground ml-2">
                ({pair.coordinates[0].toFixed(6)}, {pair.coordinates[1].toFixed(6)})
            </span>
        </div>
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
        >
            <X className="h-4 w-4" />
        </Button>
    </div>
);

export default function RoadForm({
    type = "CREATE",
    defaultRoads,
    onSubmit,
    id
}: {
    onSubmit: (data: Road) => Promise<{ success: boolean; error?: string; data?: any }>;
    type: "UPDATE" | "CREATE";
    defaultRoads?: Partial<RouteFormData>;
    id?: string;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [coordinatePairs, setCoordinatePairs] = useState<CoordinatePair[]>([])
    const [open, setOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState("")

    const router = useRouter()
    const { addRoad, updateRoad } = useRoadStore()
    const { locations } = useLocationStore()

    // Form with proper default values handling
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<RouteFormData>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            burmese_name: defaultRoads?.burmese_name || "",
            english_name: defaultRoads?.english_name || "",
            coordinates: defaultRoads?.coordinates || [],
            length_m: defaultRoads?.length_m || "",
            road_type: defaultRoads?.road_type || "",
            is_oneway: defaultRoads?.is_oneway || false,
        }
    })

    const isOneway = watch("is_oneway")

    // Memoize filtered locations to prevent unnecessary re-computation
    const availableLocations = useMemo(() =>
        locations.filter(location =>
            !coordinatePairs.some(pair => pair.name === location.english_name)
        ),
        [locations, coordinatePairs]
    );

    // Helper function to find location by coordinates with tolerance
    const findLocationByCoordinates = useCallback((coord: number[]) => {
        const tolerance = 0.001;
        return locations.find(loc =>
            Math.abs(loc.lon - coord[0]) < tolerance &&
            Math.abs(loc.lat - coord[1]) < tolerance
        );
    }, [locations]);

    // Helper function to find closest location
    const findClosestLocation = useCallback((coord: number[]) => {
        if (locations.length === 0) return null;

        let closestLocation = locations[0];
        let minDistance = Math.sqrt(
            Math.pow(locations[0].lon - coord[0], 2) +
            Math.pow(locations[0].lat - coord[1], 2)
        );

        locations.forEach(loc => {
            const distance = Math.sqrt(
                Math.pow(loc.lon - coord[0], 2) +
                Math.pow(loc.lat - coord[1], 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestLocation = loc;
            }
        });

        // Only return if reasonably close (within ~1km)
        return minDistance < 0.01 ? closestLocation : null;
    }, [locations]);

    // Initialize coordinate pairs from default data
    useEffect(() => {
        if (defaultRoads?.coordinates && locations.length > 0) {
            const initialPairs: CoordinatePair[] = [];

            defaultRoads.coordinates.forEach((coord) => {
                const matchingLocation = findLocationByCoordinates(coord);

                if (matchingLocation) {
                    initialPairs.push({
                        name: matchingLocation.english_name,
                        coordinates: [coord[0], coord[1]] as [number, number]
                    });
                } else {
                    const closestLocation = findClosestLocation(coord);

                    if (closestLocation) {
                        initialPairs.push({
                            name: closestLocation.english_name,
                            coordinates: [coord[0], coord[1]] as [number, number]
                        });
                    } else {
                        // Create a coordinate-based name if no close location found
                        initialPairs.push({
                            name: `Custom Point (${coord[0].toFixed(4)}, ${coord[1].toFixed(4)})`,
                            coordinates: [coord[0], coord[1]] as [number, number]
                        });
                    }
                }
            });

            setCoordinatePairs(initialPairs);
        }
    }, [defaultRoads?.coordinates, locations, findLocationByCoordinates, findClosestLocation]);

    // Reset form when defaultRoads changes (for update mode)
    useEffect(() => {
        if (defaultRoads && type === "UPDATE") {
            reset({
                burmese_name: defaultRoads.burmese_name || "",
                english_name: defaultRoads.english_name || "",
                coordinates: defaultRoads.coordinates || [],
                length_m: defaultRoads.length_m || "",
                road_type: defaultRoads.road_type || "",
                is_oneway: defaultRoads.is_oneway || false,
            });
        }
    }, [defaultRoads, type, reset]);

    // Optimized coordinate pair addition
    const addCoordinatePair = useCallback(() => {
        const location = locations.find((loc) => loc.english_name === selectedLocation);
        if (location && !coordinatePairs.some((pair) => pair.name === location.english_name)) {
            const newPairs = [
                ...coordinatePairs,
                {
                    name: location.english_name,
                    coordinates: [location.lon, location.lat] as [number, number]
                },
            ];
            setCoordinatePairs(newPairs);
            setValue("coordinates", newPairs.map((pair) => pair.coordinates));
            setSelectedLocation("");
            setOpen(false);
        }
    }, [selectedLocation, coordinatePairs, locations, setValue]);

    // Optimized coordinate pair removal
    const removeCoordinatePair = useCallback((index: number) => {
        const newPairs = coordinatePairs.filter((_, i) => i !== index);
        setCoordinatePairs(newPairs);
        setValue("coordinates", newPairs.map((pair) => pair.coordinates));
    }, [coordinatePairs, setValue]);

    // Generate GeoJSON from coordinates
    const generateGeoJSON = useCallback((coordinates: number[][]) => {
        return JSON.stringify({
            type: "LineString",
            coordinates: coordinates
        });
    }, []);

    const handleFormSubmit = async (data: RouteFormData) => {
        setIsSubmitting(true);

        try {
            const geojson = generateGeoJSON(data.coordinates);

            const transformedData: Road = {
                burmese_name: data.burmese_name,
                english_name: data.english_name,
                coordinates: data.coordinates,
                length_m: data.length_m.split(",").map((length) => Number(length.trim())),
                road_type: data.road_type,
                is_oneway: data.is_oneway,
                geojson: geojson,
            };

            if (type === "UPDATE" && id) {
                transformedData.id = id;
            }

            const response = await onSubmit(transformedData);

            if (!response.success) {
                throw new Error(response.error || "Road operation failed");
            }

            // Update store based on operation type
            const roadData = {
                ...transformedData,
                ...(response.data || {}),
            };

            if (type === "CREATE") {
                addRoad(roadData);
            } else if (type === "UPDATE" && id) {
                updateRoad(id, roadData);
            }

            router.push("/admin/roads");
        } catch (error) {
            console.error("Form submission error:", error);
            // You might want to show a toast notification here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto py-8">
            <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2">
                    {type === "UPDATE" ? "Update Road" : "Create New Road"}
                </CardTitle>
                <CardDescription>
                    {type === "UPDATE"
                        ? "Update road information"
                        : "Add a new road to the system with both Burmese and English names"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="burmese_name">Burmese Name</Label>
                            <Input
                                id="burmese_name"
                                {...register("burmese_name")}
                                placeholder="မြန်မာအမည်"
                                className={errors.burmese_name ? "border-destructive" : ""}
                            />
                            {errors.burmese_name && (
                                <p className="text-sm text-destructive">
                                    {errors.burmese_name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="english_name">English Name</Label>
                            <Input
                                id="english_name"
                                {...register("english_name")}
                                placeholder="English Name"
                                className={errors.english_name ? "border-destructive" : ""}
                            />
                            {errors.english_name && (
                                <p className="text-sm text-destructive">
                                    {errors.english_name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Coordinates</Label>
                        <div className="flex gap-2">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="flex-1 justify-between bg-transparent"
                                    >
                                        {selectedLocation || "Select location..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search locations..." />
                                        <CommandList>
                                            <CommandEmpty>No location found.</CommandEmpty>
                                            <CommandGroup>
                                                {availableLocations.map((location) => (
                                                    <CommandItem
                                                        key={location.english_name}
                                                        value={location.english_name}
                                                        onSelect={(currentValue) => {
                                                            setSelectedLocation(
                                                                currentValue === selectedLocation ? "" : currentValue
                                                            );
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedLocation === location.english_name
                                                                    ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {location.english_name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button
                                type="button"
                                onClick={addCoordinatePair}
                                disabled={!selectedLocation}
                                size="icon"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {coordinatePairs.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Selected Coordinates:</Label>
                                <div className="space-y-2">
                                    {coordinatePairs.map((pair, index) => (
                                        <CoordinatePairItem
                                            key={`${pair.name}-${index}`}
                                            pair={pair}
                                            index={index}
                                            onRemove={removeCoordinatePair}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.coordinates && (
                            <p className="text-sm text-destructive">{errors.coordinates.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Select locations from the dropdown and click + to add coordinate pairs
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="length_m">Length (meters)</Label>
                            <Input
                                id="length_m"
                                {...register("length_m")}
                                placeholder="500,300,200"
                                className={errors.length_m ? "border-destructive" : ""}
                            />
                            {errors.length_m && (
                                <p className="text-sm text-destructive">{errors.length_m.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Comma-separated values for multiple segments
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="road_type">Road Type</Label>
                            <Select
                                onValueChange={(value) => setValue("road_type", value)}
                                value={watch("road_type")}
                            >
                                <SelectTrigger className={errors.road_type ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select road type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roadTypes.map((roadType) => (
                                        <SelectItem key={roadType} value={roadType}>
                                            {roadType.charAt(0).toUpperCase() + roadType.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.road_type && (
                                <p className="text-sm text-destructive">{errors.road_type.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_oneway"
                            checked={isOneway}
                            onCheckedChange={(checked) => setValue("is_oneway", checked)}
                        />
                        <Label htmlFor="is_oneway">One-way road</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {type === "UPDATE" ? "Updating Road..." : "Creating Road..."}
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                {type === "UPDATE" ? "Update Road" : "Create Road"}
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}