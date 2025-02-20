import { FC, HTMLAttributes } from "react";

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: FC<TableBodyProps> = ({ children, ...props }) => {
  return (
    <tbody
      className="relative before:content-[''] before:absolute before:-z-10 before:inset-0 before:bg-custom-gradient before:rounded-[8px] before:border-[2px] before:border-[#B8CCE0] before:border-inherit before:bg-app-c2"
      {...props}
    >
      {children}
    </tbody>
  );
};

export default TableBody;
