import React from "react";

interface DataField {
  label: string;
  value: React.ReactNode;
}

interface DataListItemProps {
  fields: DataField[];
  actions?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export const DataListItem: React.FC<DataListItemProps> = ({
  fields,
  actions,
  selected,
  onClick,
}) => {
  return (
    <div className="grid">
      <div
        className={`border border-sofia-navyBlue rounded-lg cursor-pointer transition-colors ${
          selected
            ? "bg-sofia-electricOlive/10"
            : "hover:bg-sofia-electricOlive/5"
        }`}
        onClick={onClick}
      >
        <div className="p-4 grid">
          {fields.map((field, index) => (
            <div key={index} className="grid">
              <span className="text-[#001126] font-quicksand text-[14px] font-[500] leading-normal">
                {field.label}
              </span>
              <span className="text-[#001126] font-quicksand text-[14px] leading-normal truncate">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {actions && (
        <div className="grid justify-items-end">
          <div className="border border-sofia-navyBlue rounded-lg grid grid-flow-col gap-2 p-2">
            {actions}
          </div>
        </div>
      )}
    </div>
  );
};

interface DataListProps {
  items: DataListItemProps[];
  emptyMessage?: string;
}

export const DataList: React.FC<DataListProps> = ({
  items,
  emptyMessage = "No hay elementos para mostrar",
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-[#001126] font-quicksand text-[14px] py-4">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <DataListItem key={index} {...item} />
      ))}
    </div>
  );
};
