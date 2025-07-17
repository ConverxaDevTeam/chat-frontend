import { FC, HTMLAttributes } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  hidden?: boolean;
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  columns: Column[];
  onSort?: (key: string) => void;
}

const TableHeader: FC<TableHeaderProps> = ({ columns, onSort, ...props }) => {
  return (
    <thead {...props}>
      <tr className="h-[36px] text-[16px]">
        {columns.map(
          column =>
            !column.hidden && (
              <th
                key={column.key}
                className={`${column.width || ""} text-left px-4 text-app-superDark font-normal`}
              >
                <div className="flex gap-[10px] items-center">
                  <p>{column.label}</p>
                  {column.sortable && onSort && (
                    <button onClick={() => onSort(column.key)}>
                      <RiArrowUpDownFill className="text-[#A6A8AB] cursor-pointer hover:text-app-superDark" />
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
