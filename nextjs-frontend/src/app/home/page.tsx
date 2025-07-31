import CurrentLocaltion from '@/components/home/CurrentLocaltion';
import FavouritePlaces from '@/components/home/FavouritePlaces';
import Header from '@/components/home/Header';
import LastVisited from '@/components/home/LastVisited';
import QuickAction from '@/components/home/QuickAction';





const Page = () => {
    return (
        <section>
            <Header />
            {/* <AnimateBackground /> */}
            <div className="min-h-screen mx-auto max-w-7xl py-8">
                <CurrentLocaltion />
                <QuickAction />
                <FavouritePlaces />
                <LastVisited />

            </div>
        </section>
    );
};
export default Page;