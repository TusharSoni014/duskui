"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/dusk/table/data-table";

type Payment = {
  id: string;
  customer: string;
  email: string;
  status: "succeeded" | "processing" | "failed" | "refunded";
  amount: number;
};

const payments: Payment[] = [
  { id: "pay_01", customer: "Ava Chen", email: "ava@northwind.dev", status: "succeeded", amount: 316 },
  { id: "pay_02", customer: "Liam Patel", email: "liam@acme.io", status: "processing", amount: 242 },
  { id: "pay_03", customer: "Mia Rossi", email: "mia@lumen.so", status: "succeeded", amount: 837 },
  { id: "pay_04", customer: "Noah Kim", email: "noah@orbit.app", status: "failed", amount: 874 },
  { id: "pay_05", customer: "Zoe Martin", email: "zoe@pixel.co", status: "succeeded", amount: 721 },
  { id: "pay_06", customer: "Ethan Brooks", email: "ethan@vertex.dev", status: "refunded", amount: 129 },
  { id: "pay_07", customer: "Isla Novak", email: "isla@quartz.io", status: "succeeded", amount: 455 },
  { id: "pay_08", customer: "Leo Garcia", email: "leo@ember.sh", status: "processing", amount: 98 },
  { id: "pay_09", customer: "Ruby Silva", email: "ruby@harbor.dev", status: "succeeded", amount: 1290 },
  { id: "pay_10", customer: "Kai Müller", email: "kai@nimbus.app", status: "failed", amount: 64 },
  { id: "pay_11", customer: "Nora Jensen", email: "nora@fjord.co", status: "succeeded", amount: 512 },
  { id: "pay_12", customer: "Omar Haddad", email: "omar@dune.io", status: "succeeded", amount: 388 },
];

const tone = { succeeded: "success", processing: "info", failed: "destructive", refunded: "outline" } as const;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns: DataTableColumn<Payment>[] = [
  {
    id: "customer",
    header: "Customer",
    accessor: (p) => p.customer,
    filterValue: (p) => `${p.customer} ${p.email}`,
    cell: (p) => (
      <div className="flex flex-col">
        <span className="font-medium">{p.customer}</span>
        <span className="text-xs text-muted-foreground">{p.email}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: (p) => p.status,
    cell: (p) => (
      <Badge variant={tone[p.status]} dot className="capitalize">
        {p.status}
      </Badge>
    ),
  },
  { id: "amount", header: "Amount", accessor: (p) => p.amount, cell: (p) => usd.format(p.amount), align: "right" },
];

export default function DataTableDemo() {
  const [selected, setSelected] = React.useState<string[]>(["pay_03"]);

  return (
    <DataTable
      className="max-w-2xl"
      caption="Recent payments"
      data={payments}
      columns={columns}
      getRowId={(p) => p.id}
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      filterPlaceholder="Filter customers, emails, statuses…"
      defaultSort={{ id: "amount", direction: "desc" }}
      pageSize={5}
    />
  );
}
