import React, { useState } from "react";
import { IOrganization } from "@interfaces/organization.interface";
import {
  setOrganizationPlanToCustom,
  updateCustomPlanDetails,
} from "@services/planService";
import Loading from "@components/Loading"; // Assuming a Loading component exists

interface SetCustomPlanModalProps {
  organization: IOrganization;
  onClose: () => void;
  onPlanUpdated: () => void; // To refresh the list of organizations
}

const SetCustomPlanModal: React.FC<SetCustomPlanModalProps> = ({
  organization,
  onClose,
  onPlanUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"confirmChange" | "setDetails">(
    organization.type === "custom" ? "setDetails" : "confirmChange"
  );
  const [conversationCountInput, setConversationCountInput] =
    useState<string>("");

  const handleConfirmChangeToCustom = async () => {
    setIsLoading(true);
    try {
      await setOrganizationPlanToCustom(organization.id);
      // Toast success is handled by the service
      setStep("setDetails");
    } catch (error) {
      // Toast error is handled by the service
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlanDetails = async () => {
    if (
      !conversationCountInput ||
      isNaN(parseInt(conversationCountInput, 10)) ||
      parseInt(conversationCountInput, 10) <= 0
    ) {
      alert(
        "Por favor, ingresa un número válido mayor a cero para el límite de conversaciones."
      );
      return;
    }
    setIsLoading(true);
    try {
      await updateCustomPlanDetails(organization.id, {
        conversationCount: parseInt(conversationCountInput, 10),
      });
      // Toast success is handled by the service
      onPlanUpdated(); // Refresh the organization list
      onClose(); // Close the modal
    } catch (error) {
      // Toast error is handled by the service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg min-w-[400px]">
      {isLoading && <Loading />}
      <h3 className="mt-0 mb-5 text-lg font-medium">
        Plan Personalizado para: {organization.name} (ID: {organization.id})
      </h3>

      {step === "confirmChange" && !isLoading && (
        <div>
          <p className="mb-2 text-sm text-gray-600">
            Esto cambiará el plan de la organización a un{" "}
            <strong>Plan Personalizado</strong>. Podrá establecer límites
            específicos en el siguiente paso.
          </p>
          <p className="mb-4 text-sm text-gray-600">
            Tipo de Plan Actual:{" "}
            <span className="capitalize">{organization.type || "N/A"}</span>
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmChangeToCustom}
              className="px-4 py-2 text-sm text-white bg-[#001130] rounded-md hover:bg-opacity-90"
            >
              Confirmar y Cambiar a Personalizado
            </button>
          </div>
        </div>
      )}

      {step === "setDetails" && !isLoading && (
        <div>
          <p className="mb-4 text-sm text-gray-600">
            {organization.type === "custom" ? (
              <>
                Configure los detalles del <strong>Plan Personalizado</strong>{" "}
                para esta organización.
              </>
            ) : (
              <>
                Plan cambiado exitosamente a <strong>Plan Personalizado</strong>
                .
              </>
            )}
          </p>
          <div className="mb-4">
            <label
              htmlFor="conversationCount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Límite de Conversaciones:
            </label>
            <input
              type="number"
              id="conversationCount"
              value={conversationCountInput}
              onChange={e => setConversationCountInput(e.target.value)}
              placeholder="ej. 1000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#DBEAF2] focus:border-[#DBEAF2]"
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSavePlanDetails}
              className="px-4 py-2 text-sm text-white bg-[#001130] rounded-md hover:bg-opacity-90"
            >
              Guardar Detalles del Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetCustomPlanModal;
