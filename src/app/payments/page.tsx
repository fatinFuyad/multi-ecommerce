"use client";
import axios from "axios";
import { columns, Payment } from "./culumns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Payments() {
  const [data, setData] = useState<Payment[]>([]);
  const [curPage, setCurPage] = useState(1);
  useEffect(() => {
    async function getData(page: number = 1) {
      const response = await axios.get<{ data: Payment[] }>(
        `https://fakeapi.net/orders?page=${page}`
      );
      setData(response.data.data);
    }
    getData(curPage);
  }, [curPage]);
  return (
    <div className="container mx-auto p-10">
      <DataTable columns={columns} data={data} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurPage(curPage - 1)}
          disabled={curPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurPage(curPage + 1)}
          disabled={data.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
