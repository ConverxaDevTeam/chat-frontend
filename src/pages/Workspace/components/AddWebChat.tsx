import React from "react";
import Modal from "@components/Modal";
import CustomizeChat from "./CustomizeChat";

interface AddWebchatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddWebchat: React.FC<AddWebchatProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isShown={isOpen}
      onClose={onClose}
      header={
        <h2 className="text-lg font-semibold text-gray-800">
          Agregar o Editar Webchat
        </h2>
      }
    >
      <CustomizeChat onClose={onClose} />
    </Modal>
  );
};

export default AddWebchat;

/*
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Dominio</label>
          <div className="flex items-center mt-1 bg-gray-100 px-3 py-2 rounded-md shadow-inner border border-gray-200">
            <span className="text-gray-500">https://</span>
            <input
              {...register('domain')}
              type="text"
              className="ml-1 block w-full max-w-full overflow-ellipsis rounded-md border-none focus:outline-none px-2 py-1 sm:text-sm"
              placeholder="ejemplo.com"
            />
          </div>
          {errors.domain && <p className="text-red-500 text-sm mt-1">{errors.domain.message}</p>}
        </div>

      </form>
      */
