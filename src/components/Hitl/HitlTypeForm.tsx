import React, { useState, useEffect } from "react";
import { HitlTypeFormData, HitlType } from "@interfaces/hitl.interface";
import { Button } from "@components/common/Button";

interface HitlTypeFormProps {
  initialData?: HitlType | null;
  onSubmit: (data: HitlTypeFormData) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export const HitlTypeForm: React.FC<HitlTypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  mode,
}) => {
  const [formData, setFormData] = useState<HitlTypeFormData>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<HitlTypeFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof HitlTypeFormData, boolean>>
  >({});

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      });
    }
  }, [initialData, mode]);

  const validateField = (
    field: keyof HitlTypeFormData,
    value: string
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) {
          return "El nombre es requerido";
        }
        if (value.length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }
        if (value.length > 50) {
          return "El nombre no puede exceder 50 caracteres";
        }
        if (!/^[a-zA-Z0-9\s_-]+$/.test(value)) {
          return "Solo se permiten letras, números, espacios, guiones y guiones bajos";
        }
        return undefined;

      case "description":
        if (!value.trim()) {
          return "La descripción es requerida";
        }
        if (value.length < 10) {
          return "La descripción debe tener al menos 10 caracteres";
        }
        if (value.length > 255) {
          return "La descripción no puede exceder 255 caracteres";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HitlTypeFormData> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof HitlTypeFormData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof HitlTypeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof HitlTypeFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      description: true,
    });

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      // Form will be closed by parent component
    }
  };

  const getFieldError = (field: keyof HitlTypeFormData): string | undefined => {
    return touched[field] ? errors[field] : undefined;
  };

  const isFormValid =
    Object.values(errors).every(error => !error) &&
    formData.name.trim() !== "" &&
    formData.description.trim() !== "";

  return (
    <div className="bg-white rounded p-6 border border-app-lightGray">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            type="button"
          >
            <img src="/mvp/chevron-left.svg" alt="Volver" className="w-5 h-5" />
          </button>
          <h2 className="text-[18px] font-semibold text-app-superDark">
            {mode === "create" ? "Crear nuevo tipo HITL" : "Editar tipo HITL"}
          </h2>
        </div>
        <p className="text-app-superDark text-sm font-normal">
          {mode === "create"
            ? "Define roles personalizados para asignar a usuarios específicos. Estos roles determinan qué tipo de conversaciones o solicitudes podrán atender, recibiendo notificaciones relacionadas."
            : "Modifica la información del tipo HITL"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Nombre del tipo HITL *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={e => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 ${
              getFieldError("name") ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Ej: Soporte Técnico, Escalación Comercial"
            disabled={isSubmitting}
            maxLength={50}
          />
          {getFieldError("name") && (
            <p className="mt-1 text-sm text-red-600">{getFieldError("name")}</p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {formData.name.length}/50 caracteres
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Descripción *
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={e => handleInputChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-0.5 focus:ring-gray-400 focus:border-gray-400 resize-none ${
              getFieldError("description")
                ? "border-red-300"
                : "border-gray-300"
            }`}
            placeholder="Describe cuándo y cómo debe utilizarse este tipo de intervención humana..."
            disabled={isSubmitting}
            maxLength={255}
          />
          {getFieldError("description") && (
            <p className="mt-1 text-sm text-red-600">
              {getFieldError("description")}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-400">
            {formData.description.length}/255 caracteres
          </p>
        </div>

        <div className="bg-[#F4FAFF] border border-app-darkBlue rounded p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-app-superDark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-app-superDark">
                Información importante
              </h3>
              <div className="my-2 text-sm text-app-superDark">
                <ul className="list-disc list-inside space-y-1 font-normal">
                  <li>El nombre debe ser único en tu organización</li>
                  <li>Una vez creado, deberás asignar usuarios con rol HITL</li>
                  <li>
                    Los usuarios asignados recibirán notificaciones de este tipo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-gray-200">
          <Button
            type="button"
            variant="cancel"
            onClick={onCancel}
            disabled={isSubmitting}
            className="!flex-none !w-[120px]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || isSubmitting}
            className="!flex-none !w-[190px]"
          >
            {isSubmitting
              ? mode === "create"
                ? "Creando..."
                : "Guardando..."
              : mode === "create"
                ? "Crear tipo HITL"
                : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
};
