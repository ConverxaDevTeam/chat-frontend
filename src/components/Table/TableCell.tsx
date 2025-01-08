import { FC, ReactNode } from "react";

interface TableCellProps {
  width?: string;
  hidden?: boolean;
  children: ReactNode;
}

const TableCell: FC<TableCellProps> = ({ width, hidden, children }) => {
  if (hidden) return null;

  return (
    <td className={`${width || ""} px-4`}>
      <p className="font-poppinsRegular text-[#212121]">{children}</p>
    </td>
  );
};

export default TableCell;
