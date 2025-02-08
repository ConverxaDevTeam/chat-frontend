import { FC, ReactNode } from "react";

interface CardItemProps {
  label?: string;
  children: ReactNode;
}

const CardItem: FC<CardItemProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col">
      {label && <span className="text-xs font-semibold text-gray-500">{label}</span>}
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
};

export default CardItem;