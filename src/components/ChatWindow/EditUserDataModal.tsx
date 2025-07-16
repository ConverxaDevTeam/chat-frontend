import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getChatUserData,
  bulkUpdateChatUser,
  ChatUserStandardFields,
  ChatUserCustomFields,
  ChatUserBulkUpdateRequest,
} from "@services/chatUserData";
import { alertConfirm, alertError } from "@utils/alerts";

interface EditUserDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onUserUpdated?: () => void;
}

interface FormData {
  standardFields: ChatUserStandardFields;
  customFields: { [key: string]: string };
}

const EditUserDataModal: React.FC<EditUserDataModalProps> = ({
  isOpen,
  onClose,
  userId,
  onUserUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<{
    data: {
      standardInfo: {
        web?: string;
        avatar?: string;
        browser?: string;
        operating_system?: string;
        ip?: string;
      };
    };
  } | null>(null);
  const [customFields, setCustomFields] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [newCustomField, setNewCustomField] = useState({ key: "", value: "" });

  const {
    register,
    handleSubmit,

    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userDataResponse = await getChatUserData(userId);
      if (userDataResponse) {
        setUserData(userDataResponse);
        // Llenar campos estándar
        const standardInfo = userDataResponse.data.standardInfo;
        setValue("standardFields.name", standardInfo.name || "");
        setValue("standardFields.email", standardInfo.email || "");
        setValue("standardFields.phone", standardInfo.phone || "");
        setValue("standardFields.address", standardInfo.address || "");
        setValue("standardFields.avatar", standardInfo.avatar || "");
        // Llenar campos personalizados
        const customData = userDataResponse.data.customData || {};
        const customFieldsArray = Object.entries(customData).map(
          ([key, value]) => ({
            key,
            value: String(value),
          })
        );
        setCustomFields(customFieldsArray);
      }
    } catch (error) {
      alertError("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Preparar datos personalizados
      const customFieldsObject: ChatUserCustomFields = {};
      customFields.forEach(field => {
        if (field.key.trim()) {
          customFieldsObject[field.key] = field.value;
        }
      });

      // Solo enviar campos editables (excluir campos del sistema)
      const editableStandardFields: ChatUserStandardFields = {
        name: data.standardFields.name,
        email: data.standardFields.email,
        phone: data.standardFields.phone,
        address: data.standardFields.address,
      };

      const updateData: ChatUserBulkUpdateRequest = {
        standardFields: editableStandardFields,
        customFields: customFieldsObject,
      };

      const response = await bulkUpdateChatUser(userId, updateData);

      if (response && response.ok) {
        const totalUpdated =
          response.data.standardFields.updated.length +
          response.data.customFields.updated.length;
        const totalErrors =
          response.data.standardFields.errors.length +
          response.data.customFields.errors.length;

        if (totalErrors === 0) {
          alertConfirm(`Se actualizaron ${totalUpdated} campos correctamente`);
        } else {
          alertConfirm(
            `Se actualizaron ${totalUpdated} campos correctamente. ${totalErrors} campos con errores.`
          );

          // Mostrar errores específicos
          response.data.standardFields.errors.forEach(error => {
            alertError(`${error.field}: ${error.error}`);
          });
          response.data.customFields.errors.forEach(error => {
            alertError(`${error.field}: ${error.error}`);
          });
        }

        // Llamar callback para notificar que se actualizó el usuario
        if (onUserUpdated) {
          onUserUpdated();
        }

        onClose();
      } else {
        alertError("Error al actualizar los datos del usuario");
      }
    } catch (error) {
      alertError("Error al actualizar los datos del usuario");
    } finally {
      setSubmitting(false);
    }
  };

  const addCustomField = () => {
    if (newCustomField.key.trim()) {
      setCustomFields([...customFields, { ...newCustomField }]);
      setNewCustomField({ key: "", value: "" });
    }
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-app-superDark">
              Editar datos del usuario
            </h2>
            <button
              onClick={onClose}
              disabled={loading || submitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-superDark mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  Cargando datos del usuario...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campos estándar */}
              <div>
                <h3 className="text-lg font-medium text-app-superDark mb-4">
                  Información básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      {...register("standardFields.name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("standardFields.email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Email inválido",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                    {errors.standardFields?.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.standardFields.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      {...register("standardFields.phone")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      {...register("standardFields.address")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Información del sistema (solo lectura) */}
              <div>
                <h3 className="text-lg font-medium text-app-superDark mb-4">
                  Información del sistema
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Solo lectura)
                  </span>
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sitio web
                      </label>
                      <div className="text-gray-600 text-sm">
                        {userData?.data?.standardInfo?.web || "No especificado"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección IP
                      </label>
                      <div className="text-gray-600 text-sm">
                        {userData?.data?.standardInfo?.ip || "No especificado"}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Avatar (URL)
                      </label>
                      <div className="text-gray-600 text-xs break-all">
                        {userData?.data?.standardInfo?.avatar ||
                          "No especificado"}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Navegador
                      </label>
                      <div className="text-gray-600 text-xs">
                        {userData?.data?.standardInfo?.browser ||
                          "No especificado"}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sistema operativo
                      </label>
                      <div className="text-gray-600 text-xs">
                        {userData?.data?.standardInfo?.operating_system ||
                          "No especificado"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos personalizados */}
              <div>
                <h3 className="text-lg font-medium text-app-superDark mb-4">
                  Campos personalizados
                </h3>

                {customFields.map((field, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Campo"
                      value={field.key}
                      onChange={e =>
                        updateCustomField(index, "key", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Valor"
                      value={field.value}
                      onChange={e =>
                        updateCustomField(index, "value", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomField(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nuevo campo"
                    value={newCustomField.key}
                    onChange={e =>
                      setNewCustomField({
                        ...newCustomField,
                        key: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Valor"
                    value={newCustomField.value}
                    onChange={e =>
                      setNewCustomField({
                        ...newCustomField,
                        value: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-app-darkBlue focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addCustomField}
                    className="bg-app-superDark text-white rounded-[4px] h-[30px] px-3 text-sm hover:bg-opacity-90 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="bg-gray-100 text-gray-600 rounded-[4px] h-[30px] px-4 text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-app-superDark text-white rounded-[4px] h-[30px] px-4 text-sm hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserDataModal;
