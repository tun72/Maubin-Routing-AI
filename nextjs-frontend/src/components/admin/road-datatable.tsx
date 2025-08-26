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
import { MoreHorizontal, Search, X, ArrowUpDown, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert } from "../Alert"
import { deleteRoads } from "@/lib/admin/roads"
import { useRoadStore } from "@/store/use-roads-store"
import Link from "next/link"

interface Road {
    id: string;
    burmese_name: string;
    english_name: string;
    total_length?: number;
    road_type: string;
    is_oneway?: boolean;
    coordinates?: number[][];
    length_m?: number[];
    geojson?: string;
}

// Memoized delete component to prevent unnecessary re-renders
const RoadDelete = React.memo(({
    row,
    onDataChange
}: {
    row: any;
    onDataChange?: () => void;
}) => {
    const [isDeleting, setIsDeleting] = React.useState(false)
    const { removeRoad } = useRoadStore()

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const roadId = row.getValue("id")
            const result = await deleteRoads(roadId)

            if (!result.success) {
                throw new Error("Error in deleting")
            }

            // Update store immediately for better UX
            removeRoad(roadId)

            // Trigger data refresh if callback provided
            if (onDataChange) {
                onDataChange()
            }

        } catch (error: any) {
            console.error("Delete error:", error)
            // You might want to show a toast notification here
        } finally {
            setIsDeleting(false)
        }
        return null
    }

    return (
        <Alert
            title="Delete Road"
            content="Are you sure you want to delete this road? This action cannot be undone."
            text={isDeleting ? "Deleting..." : "Delete"}
            disabled={isDeleting}
            handler={handleDelete}
        />
    )
})

RoadDelete.displayName = "RoadDelete"

// Memoized action cell to prevent unnecessary re-renders
const ActionCell = React.memo(({
    row,
    onDataChange
}: {
    row: any;
    onDataChange?: () => void;
}) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    href={`/admin/roads/update/${row.getValue("id")}`}
                    className="w-full"
                >
                    Edit Road
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <RoadDelete row={row} onDataChange={onDataChange} />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
))

ActionCell.displayName = "ActionCell"

// Sortable header component
const SortableHeader = ({
    column,
    children
}: {
    column: any;
    children: React.ReactNode;
}) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium hover:bg-transparent"
    >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
)

export const columns: ColumnDef<Road>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <SortableHeader column={column}>ID</SortableHeader>
        ),
        cell: ({ row }) => (
            <div className="font-mono text-sm">
                {row.getValue("id")}
            </div>
        ),
    },
    {
        accessorKey: "english_name",
        header: ({ column }) => (
            <SortableHeader column={column}>English Name</SortableHeader>
        ),
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue("english_name")}
            </div>
        ),
        filterFn: (row, id, value) => {
            const englishName = row.getValue(id) as string
            return englishName.toLowerCase().includes(value.toLowerCase())
        },
    },
    {
        accessorKey: "burmese_name",
        header: ({ column }) => (
            <SortableHeader column={column}>Burmese Name</SortableHeader>
        ),
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue("burmese_name")}
            </div>
        ),
    },
    {
        accessorKey: "total_length",
        header: ({ column }) => (
            <SortableHeader column={column}>Total Length</SortableHeader>
        ),
        cell: ({ row }) => {
            const length = row.getValue("total_length") as number
            return (
                <div className="text-right font-mono">
                    {length ? `${length.toLocaleString()} m` : "N/A"}
                </div>
            )
        },
    },
    {
        accessorKey: "road_type",
        header: ({ column }) => (
            <SortableHeader column={column}>Road Type</SortableHeader>
        ),
        cell: ({ row }) => {
            const roadType = row.getValue("road_type") as string
            const getTypeColor = (type: string) => {
                switch (type.toLowerCase()) {
                    case 'highway': return 'bg-red-100 text-red-800 border-red-300'
                    case 'local': return 'bg-blue-100 text-blue-800 border-blue-300'
                    case 'residential': return 'bg-green-100 text-green-800 border-green-300'
                    case 'service': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    case 'pedestrian': return 'bg-purple-100 text-purple-800 border-purple-300'
                    default: return 'bg-gray-100 text-gray-800 border-gray-300'
                }
            }

            return (
                <Badge
                    variant="outline"
                    className={getTypeColor(roadType)}
                >
                    {roadType.charAt(0).toUpperCase() + roadType.slice(1)}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (value === "all") return true
            return row.getValue(id) === value
        },
    },
    {
        accessorKey: "is_oneway",
        header: "Direction",
        cell: ({ row }) => {
            const isOneway = row.getValue("is_oneway") as boolean
            return (
                <Badge
                    variant={isOneway ? "destructive" : "secondary"}
                >
                    {isOneway ? "One-way" : "Two-way"}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row, table }) => {
            const onDataChange = (table.options.meta as any)?.onDataChange
            return <ActionCell row={row} onDataChange={onDataChange} />
        },
    },
]

interface DataTableProps {
    data: Road[]
    onDataChange?: () => void
}

export default function RoadDataTable({ data, onDataChange }: DataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

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
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        meta: {
            onDataChange,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    // Get unique road types for filter
    const uniqueRoadTypes = React.useMemo(() => {
        const types = Array.from(new Set(data.map(road => road.road_type)))
        return types.sort()
    }, [data])

    // Clear search
    const clearSearch = () => {
        setGlobalFilter("")
        table.getColumn("english_name")?.setFilterValue("")
    }

    return (
        <div className="w-full space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Global Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search roads..."
                            value={globalFilter}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-8"
                        />
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2"
                                onClick={clearSearch}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>


                    {/* Road Type Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Road Type
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => table.getColumn("road_type")?.setFilterValue("")}
                            >
                                All Types
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {uniqueRoadTypes.map((type) => (
                                <DropdownMenuItem
                                    key={type}
                                    onClick={() => table.getColumn("road_type")?.setFilterValue(type)}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Column Visibility */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id.replace('_', ' ')}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    Showing {table.getRowModel().rows.length} of{" "}
                    {table.getPreFilteredRowModel().rows.length} roads
                    {globalFilter && ` (filtered from ${data.length} total)`}
                </div>
                <div>
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className="whitespace-nowrap">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="whitespace-nowrap">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <EyeOff className="h-8 w-8 text-muted-foreground" />
                                            <div>
                                                <p className="text-lg font-medium">No roads found</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {globalFilter
                                                        ? "Try adjusting your search criteria"
                                                        : "No roads have been added yet"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <select
                            className="rounded border border-input bg-background px-3 py-1 text-sm"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value))
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            First
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
                            Last
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}