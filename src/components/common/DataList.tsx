import React from "react";

interface DataField {
  label: string | React.ReactNode;
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
    <div className="grid w-full sm:w-[470px]">
      <div
        className={`flex flex-col items-start gap-4 p-[16px] self-stretch rounded-t-lg rounded-bl-lg border border-sofia-darkBlue cursor-pointer transition-colors ${
          selected
            ? "bg-sofia-electricOlive/10"
            : "hover:bg-sofia-electricOlive/5"
        }`}
        onClick={onClick}
      >
        <div className="p-0 grid gap-[8px]">
          {fields.map((field, index) => (
            <div key={index} className="grid gap-[8px]">
              {typeof field.label === "string" ? (
                <span className="text-sofia-superDark text-[14px] font-semibold leading-[16px]">
                  {field.label}
                </span>
              ) : (
                field.label
              )}
              <span className="text-sofia-superDark text-[14px] font-normal leading-normal truncate">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {actions && (
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-b-lg border-x border-b border-sofia-darkBlue bg-[#FCFCFC]">
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
      <div className="text-center text-sofia-superDark text-[14px] py-4">
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
