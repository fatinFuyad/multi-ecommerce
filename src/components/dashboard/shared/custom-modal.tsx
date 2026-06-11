"use client";

// Provider
import { useModal } from "@/providers/modal-provider";

// UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type Props = {
  heading?: string;
  subheading?: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

const CustomModal = ({ children, defaultOpen, subheading, heading }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className="overflow-y-scroll md:max-h-[600px] md:h-fit h-screen bg-card">
        <DialogHeader className="pt-8 text-left">
          {heading ? (
            <DialogTitle className="text-2xl font-bold">{heading}</DialogTitle>
          ) : (
            <DialogTitle className="text-2xl font-bold"></DialogTitle>
          )}
          {subheading && <DialogDescription>{subheading}</DialogDescription>}

          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
