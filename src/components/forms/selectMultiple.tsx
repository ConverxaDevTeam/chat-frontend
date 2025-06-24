import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";
import ReactDOM from "react-dom";

interface Option {
  value: unknown;
  label: string;
}

interface SelectMultipleProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T, unknown>;
  options: Option[];
  rules?: Record<string, unknown>;
  placeholder?: string;
  modalRef?: React.RefObject<HTMLDivElement>; // Ref para el modal
}

export const SelectMultiple = <T extends FieldValues>({
  name,
  control,
  options,
  rules,
  placeholder,
  modalRef,
}: SelectMultipleProps<T>) => {
  const [highlightedOption, setHighlightedOption] = useState<unknown>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Para controlar la visibilidad del menú
  const selectRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Detect clicks fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectionChange = (
    optionValue: unknown,
    onChange: (value: unknown) => void
  ) => {
    onChange((prevSelected: unknown[]) => {
      const selected = prevSelected || [];
      if (selected.includes(optionValue)) {
        return selected.filter((val: unknown) => val !== optionValue);
      }
      return [...selected, optionValue];
    });
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleMouseEnter = (index: number) => {
    setHighlightedOption(index);
  };

  const handleMouseLeave = () => {
    setHighlightedOption(null);
  };

  useEffect(() => {
    if (selectRef.current && isOpen) {
      const rect = selectRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width, // Obtenemos el ancho del contenedor del select
      });
    }
  }, [isOpen]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {placeholder}
      </label>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange } }) => {
          return (
            <>
              <div
                ref={selectRef} // Ref para obtener la posición y el ancho
                className="relative mt-2"
              >
                <div
                  onClick={toggleDropdown}
                  className="cursor-pointer border border-gray-300 rounded-md py-2 px-3 w-full text-gray-700 flex justify-between items-center"
                >
                  {/* Mostrar los tags dentro del contenedor del select */}
                  <div className="flex flex-wrap gap-2">
                    {(value || []).map((val: string) => {
                      const option = options.find(
                        option => option.value === val
                      );
                      return (
                        <div
                          key={val}
                          className="flex items-center bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs"
                        >
                          {option?.label}
                          <button
                            type="button"
                            onClick={() => handleSelectionChange(val, onChange)}
                            className="ml-1 text-red-600 hover:text-red-800"
                          >
                            x
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Si no hay tags, mostrar la cantidad de opciones seleccionadas */}
                  {(value || []).length === 0 && (
                    <span>{placeholder || "Selecciona opciones"}</span>
                  )}

                  <HiChevronDown className="w-5 h-5 text-gray-500" />
                </div>

                {/* Menú desplegable utilizando Portal dentro del modal */}
                {isOpen &&
                  menuPosition &&
                  ReactDOM.createPortal(
                    <div
                      ref={dropdownRef} // Ref para el dropdown
                      className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300 z-10"
                      style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        width: `${menuPosition.width}px`, // Aplicamos el ancho calculado al menú
                      }}
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {options.map((option, index) => (
                          <div
                            key={`sm-option-${option.value}`}
                            onClick={() =>
                              handleSelectionChange(option.value, onChange)
                            }
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            className={`cursor-pointer select-none relative p-2 hover:bg-gray-100 ${
                              highlightedOption === index ? "bg-gray-200" : ""
                            }`}
                          >
                            <span>{option.label}</span>
                            {(value || ([] as unknown[])).includes(
                              option.value
                            ) && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                ✔
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>,
                    modalRef?.current ?? document.body // Usa document.body si no se pasa modalRef
                  )}
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default SelectMultiple;
