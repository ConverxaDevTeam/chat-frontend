import { FC, ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

const Table: FC<TableProps> = ({ children, className = "" }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

export default Table;
