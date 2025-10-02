import type { ReactNode } from "react";

interface Column {
  key: string;
  label: string;
  className?: string;
  align?: "left" | "center" | "right";
  render?: (row: Record<string, any>) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  renderActions?: (row: Record<string, any>) => ReactNode;
  className?: string;
}

export function DataTable({
  columns,
  data,
  renderActions,
  className = "",
}: DataTableProps) {
  return (
    <div className={`card overflow-hidden border-agro-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-agro-200">
          <thead className="bg-agro-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-bold text-agro-700 uppercase tracking-wider border-b border-agro-200 ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                      ? "text-right"
                      : "text-left"
                  } ${column.className || ""}`}
                >
                  {column.label}
                </th>
              ))}
              {renderActions && (
                <th className="px-6 py-3 text-center text-xs font-bold text-agro-700 uppercase tracking-wider border-b border-agro-200">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-agro-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-agro-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    } ${column.className || ""}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
