import React from "react";
import {
  MoreVertical,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { Checkbox } from "../checkbox";

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
};

export type DataTableAction<T> = {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  icon?: React.ReactNode | ((item: T) => React.ReactNode);
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | ((
        item: T
      ) =>
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link");
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  actions?: DataTableAction<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string, direction: "asc" | "desc") => void;
};

export function DataTable<T>({
  columns,
  data,
  actions,
  keyField,
  isLoading = false,
  selectable = false,
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = React.useState<Set<unknown>>(
    new Set()
  );

  const handleToggleRow = (item: T) => {
    const key = item[keyField];
    const newSelection = new Set(selectedRows);

    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }

    setSelectedRows(newSelection);

    if (onSelectionChange) {
      const selectedItems = data.filter((row) =>
        newSelection.has(row[keyField])
      );
      onSelectionChange(selectedItems);
    }
  };

  const handleToggleAll = () => {
    if (selectedRows.size === data.length) {
      // Deselect all
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      // Select all
      const newSelection = new Set(data.map((item) => item[keyField]));
      setSelectedRows(newSelection);
      if (onSelectionChange) onSelectionChange([...data]);
    }
  };

  const handleSort = (columnId: string) => {
    if (!onSort) return;

    const newDirection =
      sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";

    onSort(columnId, newDirection);
  };

  const renderSortIndicator = (columnId: string) => {
    if (columnId !== sortColumn) return <ChevronsUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  indeterminate={
                    selectedRows.size > 0 && selectedRows.size < data.length
                  }
                  onCheckedChange={handleToggleAll}
                />
              </TableHead>
            )}

            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.sortable ? "cursor-pointer" : ""}
              >
                <div
                  className="flex items-center gap-2"
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  {column.header}
                  {column.sortable && renderSortIndicator(column.id)}
                </div>
              </TableHead>
            ))}

            {actions && actions.length > 0 && (
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={String(item[keyField])}>
              {selectable && (
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item[keyField])}
                    onCheckedChange={() => handleToggleRow(item)}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell key={`${String(item[keyField])}-${column.id}`}>
                  {column.cell(item)}
                </TableCell>
              ))}

              {actions && actions.length > 0 && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => action.onClick(item)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {typeof action.icon === "function"
                            ? action.icon(item)
                            : action.icon}
                          {typeof action.label === "function"
                            ? action.label(item)
                            : action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
