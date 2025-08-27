/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import { MoreHorizontal, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert } from "@/components/Alert"
import { deleteLocations } from "@/lib/admin/locations"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Memoized delete component to prevent unnecessary re-renders
const LocationDelete = React.memo(({ row, onDataChange }: { row: any; onDataChange?: () => void }) => {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = React.useState(false)

    const handleDelete = React.useCallback(async () => {
        try {
            setIsDeleting(true)
            const result = await deleteLocations(row.getValue("id"))

            if (!result.success) {
                throw new Error("Error in deleting")
            }

            if (onDataChange) {
                onDataChange()
            } else {
                router.push("/admin/locations")
            }
        } catch (error: any) {
            console.log(error)
        } finally {
            setIsDeleting(false)
        }
        return null
    }, [row, onDataChange, router])

    return (
        <Alert
            title="Delete Location"
            content="Are you sure?"
            text={isDeleting ? "Deleting..." : "Delete"}
            disabled={isDeleting}
            handler={handleDelete}
        />
    )
})

LocationDelete.displayName = "LocationDelete"



// Custom global filter function for searching by english_name and burmese_name
const globalFilterFn = (row: any, columnId: any, value: any) => {
    const searchValue = value.toLowerCase()
    const englishName = row.getValue("english_name")?.toString().toLowerCase() || ""
    const burmeseName = row.getValue("burmese_name")?.toString().toLowerCase() || ""
    const address = row.getValue("address")?.toString().toLowerCase() || ""

    console.log(columnId);

    return (
        englishName.includes(searchValue) ||
        burmeseName.includes(searchValue) ||
        address.includes(searchValue)
    )
}

// Memoized column definitions
const createColumns = (): ColumnDef<Location>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => <div className="capitalize">{row.getValue("address")}</div>,
    },
    {
        accessorKey: "burmese_name",
        header: "Burmese Name",
        cell: ({ row }) => <div>{row.getValue("burmese_name")}</div>,
    },
    {
        accessorKey: "english_name",
        header: "English Name",
        cell: ({ row }) => <div>{row.getValue("english_name")}</div>,
    },
    {
        accessorKey: "lon",
        header: "Longitude",
        cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("lon")}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: "lat",
        header: "Latitude",
        cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("lat")}</div>,
        enableGlobalFilter: false,
    },
    {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        enableHiding: false,
        enableGlobalFilter: false,
        cell: ({ row, table }) => {
            const onDataChange = (table.options.meta as any)?.onDataChange

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <hr />
                        <DropdownMenuItem className="mb-2 mt-2" asChild>
                            <Link href={`/admin/locations/update/${row.getValue("id")}`}>
                                Update
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <LocationDelete row={row} onDataChange={onDataChange} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

// Search component
const SearchInput = React.memo(({
    value,
    onChange,
    onClear
}: {
    value: string
    onChange: (value: string) => void
    onClear: () => void
}) => {
    return (
        <div className="relative max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by name or address..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-8 pr-8"
            />
            {value && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1.5 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={onClear}
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    )
})

SearchInput.displayName = "SearchInput"

// Main component with memoization and performance optimizations
export default function LocationDataTable({
    data,
    onDataChange
}: {
    data: Location[]
    onDataChange?: () => void
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    // Memoize columns to prevent recreation on every render
    const columns = React.useMemo(() => createColumns(), [])

    // Debounced global filter to improve performance
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState("")

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedGlobalFilter(globalFilter)
        }, 300)

        return () => clearTimeout(timer)
    }, [globalFilter])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setDebouncedGlobalFilter,
        globalFilterFn,
        meta: {
            onDataChange,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: debouncedGlobalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    const handleSearchChange = React.useCallback((value: string) => {
        setGlobalFilter(value)
    }, [])

    const handleSearchClear = React.useCallback(() => {
        setGlobalFilter("")
    }, [])

    // Memoize pagination info to prevent unnecessary recalculations
    const paginationInfo = React.useMemo(() => {
        const selectedCount = table.getFilteredSelectedRowModel().rows.length
        const totalCount = table.getFilteredRowModel().rows.length
        const pageIndex = table.getState().pagination.pageIndex + 1
        const pageCount = table.getPageCount()

        return {
            selectedCount,
            totalCount,
            pageIndex,
            pageCount,
        }
    }, [table])

    return (
        <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex items-center justify-between">
                <SearchInput
                    value={globalFilter}
                    onChange={handleSearchChange}
                    onClear={handleSearchClear}
                />

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {paginationInfo.totalCount > 0 && (
                        <span>
                            Page dawdawd {paginationInfo.pageIndex} of {paginationInfo.pageCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {debouncedGlobalFilter ? "No results found." : "No locations available."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {paginationInfo.selectedCount} of {paginationInfo.totalCount} row(s) selected.
                    {debouncedGlobalFilter && (
                        <span className="ml-2">
                            (filtered from {data.length} total)
                        </span>
                    )}
                </div>

                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <select
                            className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value))
                            }}
                        >
                            {[5, 10, 20, 30, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {"<<"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {">>"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}