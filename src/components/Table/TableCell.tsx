import { FC, ReactNode } from "react";

interface TableCellProps {
  width?: string;
  hidden?: boolean;
  children: ReactNode;
}

const TableCell: FC<TableCellProps> = ({ width, hidden, children }) => {
  if (hidden) return null;

  return (
    <td className={`${width || ""} px-4 font-poppinsRegular text-[#212121]`}>
      {children}
    </td>
  );
};

export default TableCell;
