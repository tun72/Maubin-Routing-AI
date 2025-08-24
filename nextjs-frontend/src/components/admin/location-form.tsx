/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocationStore } from "@/store/use-location-store"

const locationSchema = z.object({
    burmese_name: z.string().min(1, "Burmese name is required"),
    english_name: z.string().min(1, "English name is required"),
    address: z.string().min(1, "Address is required"),
    description: z.string().min(1, "Description is required"),
    lon: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
    lat: z.number().min(-180).max(180, "Latitude must be between -180 and 180"),
    type: z.string().min(1, "Location type is required"),
})

type LocationFormData = z.infer<typeof locationSchema>

const locationTypes = [
    'bank',
    'gas_station',
    'hospital',
    'hotel',
    'intersection',
    'landmark',
    'library',
    'museum',
    'office',
    'pagoda',
    'park',
    'pharmacy',
    'restaurant',
    'school',
    'store',
    'university',
    'other'

]

export default function LocationForm({
    type = "CREATE",
    onSubmit,
    defaultLocations,
    id
}: { onSubmit: (data: LocationFormData) => Promise<{ success: boolean; error?: string }>, type: "UPDATE" | "CREATE", defaultLocations: LocationFormData, id?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: defaultLocations,
    })

    console.log(defaultLocations);

    const { addLocation, updateLocation } = useLocationStore()

    const submitHandler = async (data: LocationFormData) => {
        setIsSubmitting(true)

        try {

            const submitData = { ...data } as Locations
            if (type === "UPDATE") {
                submitData.id = id
            }
            const response = await onSubmit(submitData) as { success: boolean, result: any }



            if (!response.success) {
                throw new Error("Error in loading response.")
            }
            if (type === "CREATE") {
                addLocation({ ...response.result, lat: data.lat, lon: data.lon })
            } else {
                // console.log(submitDat);

                updateLocation(id as string, { burmese_name: submitData.burmese_name, english_name: submitData.english_name, lat: data.lat, lon: data.lon, address: submitData.address, type: submitData.type })
                console.log("updated");

            }
            router.push("/admin/locations")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto py-8">
            <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2">Create New Location</CardTitle>
                <CardDescription>Add a new location to the system with both Burmese and English names</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
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

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            {...register("address")}
                            placeholder="Enter the full address"
                            rows={2}
                            className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Describe this location"
                            rows={3}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="lon">Longitude</Label>
                            <Input
                                id="lon"
                                type="number"
                                step="00.0000000000000001"
                                min="-180"
                                max="180"
                                {...register("lon", { valueAsNumber: true })}
                                placeholder="96.1951"
                                className={errors.lon ? "border-destructive" : ""}
                            />
                            {errors.lon && <p className="text-sm text-destructive">{errors.lon.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input
                                id="lat"
                                type="number"
                                step="0.00000000000000001"
                                min="-90"
                                max="180"
                                {...register("lat", { valueAsNumber: true })}
                                placeholder="16.8661"
                                className={errors.lat ? "border-destructive" : ""}
                            />
                            {errors.lat && <p className="text-sm text-destructive">{errors.lat.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Location Type</Label>
                        <Select onValueChange={(value) => setValue("type", value)} defaultValue={defaultLocations.type ? defaultLocations.type : "other"}>
                            <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select location type" />
                            </SelectTrigger>
                            <SelectContent defaultValue={"other"}>
                                {locationTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Location...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                {type === "CREATE" ? "Create Location" : "Update Location"}
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
