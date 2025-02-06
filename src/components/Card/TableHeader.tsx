import { FC } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  hidden?: boolean;
}

interface TableHeaderProps {
  columns: Column[];
  onSort?: (key: string) => void;
}

const TableHeader: FC<TableHeaderProps> = ({ columns, onSort }) => {
  return (
    <thead>
      <tr className="h-[60px] text-[14px] border-b-[1px] bg-gray-50">
        {columns.map(
          column =>
            !column.hidden && (
              <th
                key={column.key}
                className={`${column.width || ""} text-left px-4 font-poppinsMedium text-[#212121]`}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && onSort && (
                    <button onClick={() => onSort(column.key)}>
                      <RiArrowUpDownFill className="text-gray-400" />
                    </button>
                  )}
                </div>
              </th>
            )
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
