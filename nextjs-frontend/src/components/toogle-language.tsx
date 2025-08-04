import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Globe } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

function LanguageToogle() {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger className='py-2 px-2 bg-white/70 shadow dark:bg-white/30 border  border-white/20 dark:border-gray-200/50 rounded-md text-md'> <span className='flex items-center gap-2'>
                <Globe className='w-6 h-6 inline' />Language</span></DropdownMenuTrigger>
            <DropdownMenuContent className='bg-white/80  dark:bg-white/10'>
                <DropdownMenuItem>
                    <Link href={"mm"}>Myanmar</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={"en"}>English</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LanguageToogle