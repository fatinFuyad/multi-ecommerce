"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import ShippingRateDetails from "@/components/dashboard/forms/shipping-rate-details";
import CustomModal from "@/components/dashboard/shared/custom-modal";
import { DataTableColumnHeader } from "@/components/ui/column-header";
import { Dialog } from "@/components/ui/dialog";
import { CountryWithShippingRates } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useParams } from "next/navigation";

export const columns: ColumnDef<CountryWithShippingRates>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "countryName",
    header: ({ column }) => (
      // enables sorting asc or desc by countryName
      <DataTableColumnHeader column={column} title="Country name" />
    ),
    cell: ({ row }) => {
      return <span>{row.original.countryName}</span>;
    }
  },
  {
    accessorKey: "shippingService",
    header: "Shipping service",
    cell: ({ row }) => {
      return <span>{row.original.shippingRate?.shippingService || "Default"}</span>;
    }
  },
  {
    accessorKey: "shippingFeePerItem",
    header: "Shipping Fee per item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerItem;
      return <span>{value === 0 ? "Free" : value ? value : "Default"}</span>;
    }
  },
  {
    accessorKey: "shippingFeeForAdditionalItem",
    header: "Shipping Fee for additional item",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeForAdditionalItem;

      return (
        <span>
          <span>{value === 0 ? "Free" : value ? value : "Default"}</span>
        </span>
      );
    }
  },
  {
    accessorKey: "shippingFeePerKg",
    header: "Shipping Fee per Kg",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeePerKg;

      return <span>{value === 0 ? "Free" : value ? value : "Default"}</span>;
    }
  },
  {
    accessorKey: "shippingFeeFixed",
    header: "Shipping Fee fixed",
    cell: ({ row }) => {
      const value = row.original.shippingRate?.shippingFeeFixed;

      return <span>{value === 0 ? "Free" : value ? value : "Default"}</span>;
    }
  },
  {
    accessorKey: "deliveryTimeMin",
    header: "Delivery min days",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMin
            ? `${row.original.shippingRate?.deliveryTimeMin}`
            : "Default"}
        </span>
      );
    }
  },
  {
    accessorKey: "deliveryTimeMax",
    header: "Delivery max days",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.deliveryTimeMax
            ? `${row.original.shippingRate?.deliveryTimeMax}`
            : "Default"}
        </span>
      );
    }
  },
  {
    accessorKey: "returnPolicy",
    header: "Return policy",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.shippingRate?.returnPolicy
            ? `${row.original.shippingRate?.returnPolicy}`
            : "Default"}
        </span>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    }
  }
];

interface ActionProps {
  rowData: CountryWithShippingRates;
}

// CELLACTION COMPONENT DEFINATION
function CellActions({ rowData }: ActionProps) {
  const { setOpen } = useModal();
  const params = useParams<{ storeUrl: string }>();

// return null if no rowData exists
  if (!rowData) return null;

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal>
                  <ShippingRateDetails data={rowData} storeUrl={params.storeUrl} />
                </CustomModal>
              );
            }}
          >
            Edit Shipping
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
