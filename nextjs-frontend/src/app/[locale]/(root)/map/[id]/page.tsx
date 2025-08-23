import Map from "@/components/map/Map"

type Props = {
    params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
    const param = (await params);
    return (
        <Map id={param.id} />
    )
}

export default page