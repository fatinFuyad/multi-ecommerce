"use client";

// React, Next.js imports

// Custom components

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import { CopyPlus, FilePenLine, MoreHorizontal, Trash } from "lucide-react";

// Queries
import { deleteProduct } from "@/queries/product";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

import { ProductDetailedType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const columns: ColumnDef<ProductDetailedType>[] = [
  {
    accessorKey: "image",
    header: "Product & Image",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-3">
          {/* PRODUCT NAME*/}
          <h1 className="font-bold truncate pb-3 border-b capitalize">
            {row.original.name}
          </h1>
          {/* PRODUCT VARIANT*/}
          <div className="relative flex flex-wrap gap-2">
            {row.original.variants.map((variant) => (
              <div key={variant._id.toString()} className="flex flex-col gap-y-2 group">
                <div className="relative cursor-pointer">
                  <Image
                    src={variant.images[0].url}
                    alt={`${variant.variantName} image`}
                    width={240}
                    height={240}
                    className="w-40 h-40 rounded-sm object-contain shadow-2xl"
                  />
                  <Link
                    href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original._id}/variants/${variant._id}`}
                  >
                    <div className="w-full h-full absolute inset-0 z-0 rounded-sm bg-black/50 transition-all duration-150 hidden group-hover:block">
                      <FilePenLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    </div>
                  </Link>
                  {/* Info */}
                  <div className="flex mt-2 gap-2 p-1">
                    {/* Colors */}
                    <div className="w-7 flex flex-col gap-2 rounded-md">
                      {variant.colors.map((color, index) => (
                        <span
                          key={index}
                          className="w-5 h-5 rounded-full shadow-2xl"
                          style={{ backgroundColor: color.color }}
                        />
                      ))}
                    </div>
                    <div>
                      {/* Name of variant */}
                      <h1 className="max-w-40 capitalize text-sm">
                        {variant.variantName}
                      </h1>
                      {/* Sizes */}
                      <div className="flex flex-wrap gap-2 max-w-72 mt-1">
                        {variant.sizes.map((size) => (
                          <span
                            key={size.size}
                            className="w-fit p-1 rounded-md text-[11px] font-medium border-2 bg-white/10"
                          >
                            {size.size} - ({size.quantity}) - {size.price}$
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  },
  // {
  //   accessorKey: "name",
  //   header: "Name",
  //   cell: ({ row }) => {
  //     return (
  //       <span className="font-extrabold text-lg capitalize">{row.original.name}</span>
  //     );
  //   }
  // },

  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => {
      return <span>{row.original.brand}</span>;
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.category.name}
        </span>
      );
    }
  },
  {
    accessorKey: "new-variant",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/seller/stores/${row.original.store.url}/products/${row.original._id}/variants/new`}
        >
          <CopyPlus className="hover:text-blue-200" />
        </Link>
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

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: ProductDetailedType;
}

// CellActions component definition
export function CellActions({ rowData }: CellActionsProps) {
  // Hooks
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setClose } = useModal();

  // const { setOpen, setClose } = useModal();
  // const { storeUrl } = useParams<{ storeUrl: string }>();

  // Return null if rowData or rowData._id don't exist
  if (!rowData || !rowData._id) return null;
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="flex gap-2 hover:bg-destructive"
              onClick={() => {}}
            >
              <Trash size={15} /> Delete product
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <DropdownMenuItem className="hover:bg-primary-light">
            <Link
              href={`/dashboard/seller/stores/${rowData.store.url}/products/${rowData._id}/variants/new`}
              className="flex gap-2"
            >
              <CopyPlus size={15} /> <span>New Variant</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the product and
            variants that exist inside product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteProduct(rowData._id);
              toast({
                title: "Deleted product",
                description: "The product has been deleted."
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
