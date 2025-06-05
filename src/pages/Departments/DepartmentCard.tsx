import { FC } from "react";
import { IDepartment } from "@interfaces/departments";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@store/hooks";
import { toggleDepartmentVisibility } from "@store/reducers/department";
import { RootState } from "@store";

interface DepartmentCardProps {
  department: IDepartment;
  onUpdate: () => void;
  onDelete: (department: IDepartment) => void;
}

const DepartmentCard: FC<DepartmentCardProps> = ({
  department,
  onUpdate,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { hiddenDepartmentIds } = useSelector((state: RootState) => state.department);
  
  const isVisible = !hiddenDepartmentIds.includes(department.id.toString());
  
  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleDepartmentVisibility(department.id.toString()));
  };
  return (
    <div className="min-h-[60px] text-[14px] border-b border-b-app-lightGray hover:bg-gray-50 flex items-center cursor-pointer">
      <div className="pl-[16px] pr-[8px] w-[25%]">
        <p className="text-sofia-superDark text-[14px] font-normal leading-normal truncate max-w-[90%]">
          {department.name}
        </p>
      </div>
      <div className="px-[8px] w-[35%]">
        <p className="text-sofia-superDark text-[14px] font-normal leading-normal truncate max-w-[90%]">
          {department.description || "Sin descripción"}
        </p>
      </div>
      <div className="px-[8px] w-[15%]">
        <p className="text-sofia-superDark text-[14px] font-normal leading-normal truncate max-w-[90%]">
          {department.id}
        </p>
      </div>
      <div className="w-[10%] flex justify-center">
        <button 
          className="p-0" 
          onClick={toggleVisibility}
        >
          <img 
            src={isVisible ? "/mvp/eye.svg" : "/mvp/eye-closed.svg"} 
            alt={isVisible ? "Ocultar" : "Mostrar"} 
            className="w-5 h-5 cursor-pointer p-0" 
            title={isVisible ? "Ocultar departamento" : "Mostrar departamento"}
          />
        </button>
      </div>
      <div className="w-[15%] flex items-center justify-center gap-0">
        <button 
          className="p-0" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(department);
          }}
        >
          <img src="/mvp/trash.svg" alt="Eliminar" className="w-5 h-5 cursor-pointer" />
        </button>
        <button 
          className="p-0 ml-2" 
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
        >
          <img src="/mvp/square-pen.svg" alt="Editar" className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
