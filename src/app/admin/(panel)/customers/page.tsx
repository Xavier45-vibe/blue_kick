import { formatMoney } from "@/lib/money";
import { listCustomers } from "@/repositories/admin";

export const metadata = { title: "Customers" };

export default async function CustomersPage() {
  const rows = await listCustomers();
  return (
    <div className="panel overflow-x-auto">
      <table className="admin-table">
        <thead><tr><th>Email</th><th>Orders</th><th>Total spent</th><th>Last order</th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-grey-500">Customers appear here after their first order.</td></tr>}
          {rows.map((c) => (
            <tr key={c.email}>
              <td className="font-semibold">{c.email}</td>
              <td>{c.orders}{c.orders > 1 && <span className="ml-2 sticker sticker-violet">Repeat</span>}</td>
              <td className="font-bold">{formatMoney(c.spent)}</td>
              <td>{c.last?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
