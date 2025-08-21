import Map from "@/components/map/Map"

type Props = {
    params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
    const id = (await params).id;


    return (
        <Map accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string} />
    )
}

export default page