import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { IStore } from "@/models/Store";
import { Check, X } from "lucide-react";

export function TableStores({ stores }: { stores: IStore[] }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="capitalize">name</TableHead>
          <TableHead className="capitalize">email</TableHead>
          <TableHead className="capitalize">phone</TableHead>
          <TableHead className="capitalize">featured</TableHead>
          <TableHead className="capitalize">url</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.map((store) => (
          <TableRow key={store._id?.toString()}>
            <TableCell className="font-medium">{store.name}</TableCell>
            <TableCell>{store.email}</TableCell>
            <TableCell>{store.phone}</TableCell>
            <TableCell>
              {store.featured ? (
                <Check className="stroke-green-500" />
              ) : (
                <X className="stroke-red-500" />
              )}
            </TableCell>
            <TableCell>{store.url}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
