import React from "react";
import { StepComponentProps } from "../types";
import { Button } from "@components/common/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { setSelectedDepartmentId } from "@store/reducers/department";

const FinalStep: React.FC<StepComponentProps> = ({
  onComplete,
  onClose,
  departmentId,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoToDashboard = async () => {
    // Marcar wizard como completado primero
    if (onComplete) {
      await onComplete();
    }
    // Cerrar wizard
    if (onClose) {
      onClose();
    }
    // Luego navegar
    navigate("/dashboard");
  };

  const handleGoToWorkspace = async () => {
    // Marcar wizard como completado primero
    if (onComplete) {
      await onComplete();
    }

    // Cerrar wizard
    if (onClose) {
      onClose();
    }

    // Establecer el departmentId antes de navegar al workspace
    if (departmentId) {
      dispatch(setSelectedDepartmentId(departmentId));
    }

    // Luego navegar
    navigate("/workspace");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-sofia-blancoPuro">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
        {/* Icono de éxito */}
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <img
            src="/mvp/check-circle.svg"
            alt="Completado"
            className="w-8 h-8"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(52%) sepia(81%) saturate(2878%) hue-rotate(142deg) brightness(87%) contrast(88%)",
            }}
          />
        </div>

        {/* Mensaje principal */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-sofia-superDark">
            ¡Haz completado la configuración inicial!
          </h2>
          <p className="text-sofia-navyBlue text-sm">
            Si deseas algún cambio en línea, podrás completar tu agente más
            adelante desde el menú principal.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3 w-full pt-4">
          <Button
            onClick={handleGoToDashboard}
            variant="primary"
            className="w-full py-3"
            type="button"
          >
            Ir al Dashboard
          </Button>
          <Button
            onClick={handleGoToWorkspace}
            variant="default"
            className="w-full py-3"
            type="button"
          >
            Modificar agente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalStep;
