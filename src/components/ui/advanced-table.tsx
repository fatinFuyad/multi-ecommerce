"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useModal } from "@/providers/modal-provider";
import { FilePlus2, SearchIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";
import CustomModal from "../dashboard/shared/custom-modal";
import { DataTableViewOptions } from "./column-toggle";
import { DataTablePagination } from "./pagination";

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  searchPlaceholder: string;
  modalChildren?: ReactNode;
  heading?: string;
  subheading?: string;
  newTabLink?: string;
  actionButtonContent?: ReactNode;
}

export function AdvancedTable<TData, TValue>({
  columns,
  data,
  filterValue,
  heading,
  subheading,
  modalChildren,
  searchPlaceholder,
  actionButtonContent,
  newTabLink
}: TableProps<TData, TValue>) {
  const { setOpen } = useModal(); // custom modal hook

  // TABLE STATE FOR FILTERING, SORTING AND TOGGLE COLUMN VISIBILITY
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility
    }
  });

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        {/* SEARCH FILTER INPUT WITH ICON */}
        <div className="flex gap-2 items-center mr-auto">
          <label htmlFor="tableFilterInput">
            <SearchIcon />
          </label>
          <Input
            id="tableFilterInput"
            placeholder={searchPlaceholder}
            value={(table.getColumn(filterValue)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(filterValue)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        
        {/* TOGGLE COLUMN VIEW */}
        <DataTableViewOptions table={table} />

        {/* RENDER MODAL CHILDREN IN CUSTOM MODAL */}
        <div className="flex gap-x-2">
          {modalChildren && (
            <Button
              className="flex- gap-2"
              onClick={() => { 
                  setOpen(
                    <CustomModal heading={heading} subheading={subheading}>
                      {modalChildren}
                    </CustomModal>
                  );
              }}
            >
              {actionButtonContent}
            </Button>
          )}

          {/* LINK FOR EXTERNAL PAGE */}
          {newTabLink && (
            <Link href={newTabLink}>
              <Button variant="outline">
                <FilePlus2 className="me-1" /> Create in new page
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div>
        <Table>
          {/* HEADER ROW FOR THE TABLE */}
          <TableHeader className="py-4 px-1 h-20 max-h-28 bg-primary-light/20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* BODY OF THE TABLE */}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* PAGINATION FOR THE TABLE */}
      <DataTablePagination table={table} />
    </div>
  );
}
