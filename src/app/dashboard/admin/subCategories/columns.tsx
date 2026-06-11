"use client";

// React, Next.js imports

// Custom components
import CustomModal from "@/components/dashboard/shared/custom-modal";

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
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useToast } from "@/hooks/use-toast";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash
} from "lucide-react";

// Queries

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// models
import SubCategoryDetails from "@/components/dashboard/forms/subCategory-details";
import { SubCategoryDataType } from "@/lib/types";
import { CategoryData } from "@/models/Category";
import { getAllCategories } from "@/queries/category";
import { deleteSubCategory, getSubCategory } from "@/queries/subCategory";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const columns: ColumnDef<SubCategoryDataType>[] = [
  {
    accessorKey: "image",
    header: "Subcategory Image",
    cell: ({ row }) => {
      return (
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={row.original.image}
            alt={`${row.original.name} image`}
            width={200}
            height={200}
            className="w-24 h-24 rounded-full object-cover shadow-2xl"
          />
        </div>
      );
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    }
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      return <span>{row.original.url}</span>;
    }
  },
  {
    accessorKey: "category",
    header: "Category name",
    cell: ({ row }) => {
      return <span>{row.original.category.name}</span>;
    }
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
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

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: SubCategoryDataType;
}

// CellActions component definition
export function CellActions({ rowData }: CellActionsProps) {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Get categories
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);
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
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/* Store details component */}
                  <SubCategoryDetails data={rowData} categories={categories} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getSubCategory(rowData._id)
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete subcategory
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            subcategory and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              try {
                await deleteSubCategory(rowData._id);
                toast({
                  title: "Deleted subcategory",
                  description: "The subcategory has been deleted."
                });
                router.refresh();
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.response?.data.message,
                  variant: "destructive"
                });
              } finally {
                setLoading(false);
                setClose();
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
