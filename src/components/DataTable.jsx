// src/components/DataTable.jsx
import { ArrowUpDown } from "lucide-react";

export default function DataTable({ title, columns, data }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    <ArrowUpDown size={14} className="opacity-40" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {Object.values(row).map((cell, j) => (
                  <td key={j} className="px-6 py-3 text-gray-700 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
