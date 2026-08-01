import React from "react";
import { FiDollarSign } from "react-icons/fi";

export const RecentTransactions = () => {
  // Mock data for recent transactions
  const transactions = [
    { cusId: "John Doe", sku: "SKU12345", date: "2024-01-18", price: "$120.00", order: 1 },
    { cusId: "Jane Smith", sku: "SKU67890", date: "2024-01-17", price: "$85.50", order: 2 },
    { cusId: "Chris Lee", sku: "SKU11223", date: "2024-01-16", price: "$45.75", order: 3 },
    { cusId: "Sara Johnson", sku: "SKU44556", date: "2024-01-15", price: "$92.30", order: 4 },
    { cusId: "Michael Brown", sku: "SKU77889", date: "2024-01-14", price: "$63.20", order: 5 },
  ];

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 bg-white shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium text-stone-600">
          <FiDollarSign /> Recent Transactions
        </h3>
        <button className="text-sm text-violet-500 hover:underline">View all</button>
      </div>

      <table className="w-full table-auto border-collapse">
        <TableHead />
        <tbody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={index}
              cusId={transaction.cusId}
              sku={transaction.sku}
              date={transaction.date}
              price={transaction.price}
              order={transaction.order}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-medium text-stone-500 border-b border-stone-200">
        <th className="text-start p-2">Customer</th>
        <th className="text-start p-2">SKU</th>
        <th className="text-start p-2">Date</th>
        <th className="text-start p-2">Price</th>
        <th className="w-8"></th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  cusId,
  sku,
  date,
  price,
  order,
}: {
  cusId: string;
  sku: string;
  date: string;
  price: string;
  order: number;
}) => {
  return (
    <tr className="text-sm text-stone-600 hover:bg-stone-50">
      <td className="p-2">{cusId}</td>
      <td className="p-2">{sku}</td>
      <td className="p-2">{date}</td>
      <td className="p-2">{price}</td>
      <td className="p-2 text-right">
        <button className="text-sm text-violet-500 hover:underline">
          View Order #{order}
        </button>
      </td>
    </tr>
  );
};