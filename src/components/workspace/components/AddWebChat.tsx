import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { HiOutlineClipboard } from "react-icons/hi";
import Modal from "@components/Modal";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domain: string) => void;
  initialDomain?: string;
}

const schema = yup.object().shape({
  domain: yup
    .string()
    .url("Debe ser una URL válida")
    .required("El dominio es obligatorio"),
});

const AddWebchat: React.FC<AddWebchatProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDomain = "",
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("domain", initialDomain.replace(/^https?:\/\//, ""));
  }, [initialDomain, setValue]);

  const onSubmit = (data: { domain: string }) => {
    onSave(`https://${data.domain}`);
    onClose();
  };

  const generatedScript = (domain: string) =>
    `<script src="https://${domain}/js/min/jquery.min.js"></script>\n<script id="sbinit" src="https://${domain}/js/main.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(generatedScript(watch("domain")))
      .then(() => alert("Script copiado al portapapeles"))
      .catch(error => console.error("Error al copiar:", error));
  };

  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-lg font-semibold text-gray-800">
          Agregar o Editar Webchat
        </h2>
      }
      footer={
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 shadow"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
          >
            Guardar
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Dominio
          </label>
          <div className="flex items-center mt-1 bg-gray-100 px-3 py-2 rounded-md shadow-inner border border-gray-200">
            <span className="text-gray-500">https://</span>
            <input
              {...register("domain")}
              type="text"
              className="ml-1 block w-full max-w-full overflow-ellipsis rounded-md border-none focus:outline-none px-2 py-1 sm:text-sm"
              placeholder="ejemplo.com"
            />
          </div>
          {errors.domain && (
            <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Script de Integración
          </label>
          <div className="grid grid-cols-[1fr_auto] bg-gray-50 p-4 rounded-md border border-gray-200 shadow-inner">
            <div className="text-gray-800 text-sm font-mono leading-tight whitespace-pre-wrap break-all">
              {generatedScript(watch("domain"))}
            </div>
            <button
              onClick={handleCopy}
              type="button"
              className="text-gray-500 hover:text-gray-700 ml-2"
              aria-label="Copiar script"
            >
              <HiOutlineClipboard size={24} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddWebchat;
