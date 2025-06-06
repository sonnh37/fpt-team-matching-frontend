"use client";

import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {type Table} from "@tanstack/react-table";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {Settings2} from "lucide-react";

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
}

export function DataOnlyTableViewOptions<TData>({
                                                    table,
                                                }: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto hidden h-8 lg:flex'
                >
                    <Settings2 className='mr-2 h-4 w-4'/>
                    Xem các cột
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[150px]'>
                <DropdownMenuLabel>Chuyển đổi cột</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className='capitalize'
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}