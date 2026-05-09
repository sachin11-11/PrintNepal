import { orders } from "@/lib/data";
import { StatusBadge } from "./StatusBadge";

export function AdminTable() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead className="bg-mist text-xs uppercase tracking-[0.18em] text-graphite">
          <tr>
            <th className="px-5 py-4 font-semibold">Order</th>
            <th className="px-5 py-4 font-semibold">Customer</th>
            <th className="px-5 py-4 font-semibold">Service</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-5 py-4 font-medium text-ink">{order.id}</td>
              <td className="px-5 py-4 text-graphite">{order.customer}</td>
              <td className="px-5 py-4 text-graphite">{order.service}</td>
              <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
              <td className="px-5 py-4 text-graphite">{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
