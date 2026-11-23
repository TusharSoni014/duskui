import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const invoices = [
  { id: "INV-1042", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV-1043", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV-1044", status: "Unpaid", method: "Bank transfer", amount: 350 },
  { id: "INV-1045", status: "Paid", method: "Credit card", amount: 450 },
  { id: "INV-1046", status: "Paid", method: "PayPal", amount: 550 },
] as const;

const tone = { Paid: "success", Pending: "warning", Unpaid: "outline" } as const;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function TableBasicDemo() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <Table containerClassName="max-w-xl rounded-xl border bg-card/40">
      <TableCaption className="mb-3">A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col" className="w-28">Invoice</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Method</TableHead>
          <TableHead scope="col" className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge variant={tone[invoice.status]} dot>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{invoice.method}</TableCell>
            <TableCell className="text-right">{usd.format(invoice.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{usd.format(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
