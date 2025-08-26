"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface Location {
    id: string
    address: string
    burmese_name: string
    english_name: string
    lat: number
    lon: number
    type: string
}

interface ComboboxProps {
    locations: Location[]
    value?: string
    onValueChange?: (value: string) => void
}

export function LocationCombobox({ locations, value, onValueChange }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const selected = locations.find((loc) => loc.english_name === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-transparent"
                >
                    {selected ? selected.english_name : "Select location..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search location..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((loc) => (
                                <CommandItem
                                    key={loc.id}
                                    value={loc.english_name}
                                    onSelect={(currentValue) => {
                                        const newValue = currentValue === value ? "" : currentValue
                                        onValueChange?.(newValue)
                                        setOpen(false)
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span>{loc.english_name}</span>
                                        <span className="text-sm text-muted-foreground">{loc.burmese_name}</span>
                                    </div>
                                    <Check className={cn("ml-auto", value === loc.id ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
