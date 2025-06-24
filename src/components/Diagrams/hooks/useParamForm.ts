import { useState, useEffect } from "react";
import {
  FunctionParam,
  ParamType,
  CreateFunctionParamDto,
} from "@interfaces/function-params.interface";

export const useParamForm = (initialParam?: FunctionParam | null) => {
  const [formData, setFormData] = useState<CreateFunctionParamDto>({
    name: "",
    type: ParamType.STRING,
    description: "",
    required: false,
  });

  useEffect(() => {
    if (initialParam) {
      setFormData({
        name: initialParam.name,
        type: initialParam.type,
        description: initialParam.description || "",
        required: initialParam.required || false,
      });
    } else {
      setFormData({
        name: "",
        type: ParamType.STRING,
        description: "",
        required: false,
      });
    }
  }, [initialParam]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: ParamType.STRING,
      description: "",
      required: false,
    });
  };

  return {
    formData,
    handleInputChange,
    resetForm,
  };
};
