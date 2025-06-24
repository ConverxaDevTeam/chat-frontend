import { FC, HTMLAttributes } from "react";

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: FC<TableBodyProps> = ({ children, ...props }) => {
  return (
    <tbody
      className="relative bg-white rounded border border-app-lightGray"
      {...props}
    >
      {children}
    </tbody>
  );
};

export default TableBody;
