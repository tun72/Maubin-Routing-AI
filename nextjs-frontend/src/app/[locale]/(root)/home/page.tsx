"use client"
import CurrentLocaltion from '@/components/home/CurrentLocaltion';
import FavouritePlaces from '@/components/home/FavouritePlaces';
import Header from '@/components/home/Header';
import LastVisited from '@/components/home/LastVisited';
import QuickAction from '@/components/home/QuickAction';
import { useAuthStore, useIsHydrated } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


const Page = () => {

    const { isAuthenticated, isAdmin, hasEmailConfig } = useAuthStore()
    const router = useRouter()

    const isHydrated = useIsHydrated()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!isHydrated) {
            return // Wait for hydration before redirecting
        }

        if (!isAuthenticated) {
            router.push("/login")
        } else {
            setIsLoading(false)
        }
    }, [isAuthenticated, hasEmailConfig, router, isHydrated, isAdmin])

    if (isLoading && isHydrated) {
        return null
    }
    return (
        <section>
            <Header />
            {/* <AnimateBackground /> */}
            <div className="min-h-screen mx-auto max-w-7xl py-8">
                <CurrentLocaltion />
                <QuickAction />
                <LastVisited />
                <FavouritePlaces />




            </div>
        </section>
    );
};
export default Page;