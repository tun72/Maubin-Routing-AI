/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
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
    length_m: z.number().min(0, "Length must be a positive number"),
    road_type: z.string().min(1, "Road type is required"),
    is_oneway: z.boolean().default(false).optional(),
})

type RouteFormData = z.infer<typeof routeSchema>


const roadTypes = ['highway', 'local', 'residential', 'service', 'pedestrian']

export default function RoadForm({ onSubmit }: { onSubmit: (data: Roads) => Promise<{ success: boolean; error?: string }>; }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [coordinatePairs, setCoordinatePairs] = useState<Array<{ name: string; coordinates: [number, number] }>>([])
    const [open, setOpen] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState("")


    const router = useRouter()
    const { addRoad } = useRoadStore()
    const { locations } = useLocationStore()


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RouteFormData>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            burmese_name: "",
            english_name: "",
            coordinates: [],
            length_m: 0,
            road_type: "local",
            is_oneway: false,
        },
    })


    const isOneway = watch("is_oneway")

    const addCoordinatePair = () => {
        const location = locations.find((loc) => loc.english_name === selectedLocation)
        if (location && !coordinatePairs.some((pair) => pair.name === location.english_name)) {
            const newPairs = [
                ...coordinatePairs,
                { name: location.english_name, coordinates: [location.lon, location.lat] as [number, number] },
            ]
            setCoordinatePairs(newPairs)
            setValue(
                "coordinates",
                newPairs.map((pair) => pair.coordinates),
            )
            setSelectedLocation("")
            setOpen(false)
        }
    }

    const removeCoordinatePair = (index: number) => {
        const newPairs = coordinatePairs.filter((_, i) => i !== index)
        setCoordinatePairs(newPairs)
        setValue(
            "coordinates",
            newPairs.map((pair) => pair.coordinates),
        )
    }

    const handelSubmit = async (data: RouteFormData) => {
        setIsSubmitting(true)

        try {
            const transformedData = {
                burmese_name: data.burmese_name,
                english_name: data.english_name,
                coordinates: data.coordinates.map(([lat, lng]) => [lng, lat]), // [longitude, latitude] format
                length_m: [data.length_m],
                road_type: data.road_type,

            }

            const response = await onSubmit(transformedData) as { success: boolean, data: any }
            if (!response.success) {
                throw new Error("Road Insert Error")
            }
            addRoad({ ...response.data, burmese_name: data.burmese_name, english_name: data.english_name, road_type: data.road_type })
            router.push("/admin/roads")
        } catch (error) {
            console.log(error);

            // Error handling
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto py-8">
            <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2">Create New Road</CardTitle>
                <CardDescription>Add a new road to the system with both Burmese and English names</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handelSubmit)} className="space-y-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="burmese_name">Burmese Name</Label>
                            <Input
                                id="burmese_name"
                                {...register("burmese_name")}
                                placeholder="မြန်မာအမည်"
                                className={errors.burmese_name ? "border-destructive" : ""}
                            />
                            {errors.burmese_name && <p className="text-sm text-destructive">{errors.burmese_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="english_name">English Name</Label>
                            <Input
                                id="english_name"
                                {...register("english_name")}
                                placeholder="English Name"
                                className={errors.english_name ? "border-destructive" : ""}
                            />
                            {errors.english_name && <p className="text-sm text-destructive">{errors.english_name.message}</p>}
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
                                                {locations.map((location) => (
                                                    <CommandItem
                                                        key={location.english_name}
                                                        value={location.english_name}
                                                        onSelect={(currentValue) => {
                                                            setSelectedLocation(currentValue === selectedLocation ? "" : currentValue)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedLocation === location.english_name ? "opacity-100" : "opacity-0",
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
                            <Button type="button" onClick={addCoordinatePair} disabled={!selectedLocation} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {coordinatePairs.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Selected Coordinates:</Label>
                                <div className="space-y-2">
                                    {coordinatePairs.map((pair, index) => (
                                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                            <div className="flex-1">
                                                <span className="font-medium">{pair.name}</span>
                                                <span className="text-sm text-muted-foreground ml-2">
                                                    ({pair.coordinates[0]}, {pair.coordinates[1]})
                                                </span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeCoordinatePair(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.coordinates && <p className="text-sm text-destructive">{errors.coordinates.message}</p>}
                        <p className="text-xs text-muted-foreground">
                            Select locations from the dropdown and click + to add coordinate pairs
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="length_m">Length (meters)</Label>
                            <Input
                                id="length_m"
                                type="number"
                                step="0.1"
                                min="0"
                                {...register("length_m", { valueAsNumber: true })}
                                placeholder="500"
                                className={errors.length_m ? "border-destructive" : ""}
                            />
                            {errors.length_m && <p className="text-sm text-destructive">{errors.length_m.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="road_type">Road Type</Label>
                            <Select onValueChange={(value) => setValue("road_type", value)} defaultValue="local">
                                <SelectTrigger className={errors.road_type ? "border-destructive" : ""}>
                                    <SelectValue placeholder="Select road type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roadTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.road_type && <p className="text-sm text-destructive">{errors.road_type.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="is_oneway" checked={isOneway} onCheckedChange={(checked) => setValue("is_oneway", checked)} />
                        <Label htmlFor="is_oneway">One-way road</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Route...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Route
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
