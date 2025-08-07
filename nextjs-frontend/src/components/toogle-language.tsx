import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Languages } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'

function LanguageToogle() {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger> <span className='inline-flex items-center justify-center rounded-md p-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
                <Languages className='w-5 h-5' /></span></DropdownMenuTrigger>
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