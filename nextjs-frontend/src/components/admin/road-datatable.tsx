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
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Alert } from "../Alert"
import { deleteRoads } from "@/lib/admin/roads"
import Link from "next/link"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoadDelete = ({ row, onDataChange }: { row: any; onDataChange?: () => void }) => {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = React.useState(false)

    return (
        <Alert
            title="Delete Road"
            content={"Are you sure ?"}
            text={isDeleting ? "Deleting..." : "delete"}
            disabled={isDeleting}
            handler={async () => {
                try {
                    setIsDeleting(true)
                    const result = await deleteRoads(row.getValue("id"))

                    if (!result.success) {
                        throw new Error("Error in deleting")
                    }

                    if (onDataChange) {
                        onDataChange()
                    } else {
                        if (router) {
                            router.push("/admin/roads")
                        }
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.log(error)
                } finally {
                    setIsDeleting(false)
                }
                return null
            }}
        />
    )
}

export const columns: ColumnDef<Road>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "burmese_name",
        header: "Burmese_Name",
        cell: ({ row }) => <div className="lowercase">{row.getValue("burmese_name")}</div>,
    },
    {
        accessorKey: "english_name",
        header: "English_Name",
        cell: ({ row }) => <div className="lowercase">{row.getValue("english_name")}</div>,
    },

    {
        accessorKey: "total_length",
        header: "Total Length",
        cell: ({ row }) => <div className="lowercase">{row.getValue("total_length")}</div>,
    },
    {
        accessorKey: "road_type",
        header: "Road Type",
        cell: ({ row }) => <div className="lowercase">{row.getValue("road_type")}</div>,
    },

    {
        id: "actions",
        accessorKey: "id",
        enableHiding: false,
        cell: ({ row, table }) => {

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const onDataChange = (table.options.meta as any)?.onDataChange
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem >
                            <Link href={`/admin/roads/update/${row.getValue("id")}`}>Update</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <RoadDelete row={row} onDataChange={onDataChange} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

interface Data {
    data: Road[]
    onDataChange?: () => void
}
export default function RoadDataTable({ data, onDataChange }: Data) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

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
        meta: {
            onDataChange,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="max-w-6xl overflow-x-scroll rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2 py-4 px-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                    selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
