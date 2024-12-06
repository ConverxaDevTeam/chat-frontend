import Modal from "@components/Modal";
import axiosInstance from "@config/axios";
import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthenticatorFormModal } from "./AuthenticatorFormModal";
import {
  AutenticadorType,
  injectPlaces,
} from "@interfaces/autenticators.interface";
import { HttpMethod } from "@interfaces/functions.interface";

interface AuthenticatorFormData {
  id?: number;
  name: string;
  organizationId: number;
  type: AutenticadorType;
  config: {
    url: string;
    method: HttpMethod;
    params: Record<string, string>;
    injectPlace: injectPlaces;
    injectConfig: {
      tokenPath: string;
      refreshPath: string;
    };
  };
}

interface AuthenticatorModalProps {
  show: boolean;
  onClose: () => void;
  organizationId: number;
}

export function AuthenticatorModal({
  show,
  onClose,
  organizationId,
}: AuthenticatorModalProps) {
  const [authenticators, setAuthenticators] = useState<AuthenticatorFormData[]>(
    []
  );
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAuthenticator, setEditingAuthenticator] = useState<
    AuthenticatorFormData | undefined
  >();

  const fetchAuthenticators = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/autenticadores/${organizationId}`
      );
      setAuthenticators(response.data);
    } catch (error) {
      toast.error("Error al cargar autenticadores");
    }
  };

  const handleSubmit = async (data: AuthenticatorFormData) => {
    try {
      if (editingAuthenticator?.id) {
        const response = await axiosInstance.patch(
          `/api/autenticadores/${editingAuthenticator.id}`,
          data
        );
        setAuthenticators(prev =>
          prev.map(auth =>
            auth.id === editingAuthenticator.id ? response.data : auth
          )
        );
        toast.success("Autenticador actualizado exitosamente");
      } else {
        const response = await axiosInstance.post("/api/autenticadores", data);
        setAuthenticators(prev => [...prev, response.data]);
        toast.success("Autenticador creado exitosamente");
      }
      handleCloseForm();
    } catch (error) {
      toast.error("Error al guardar el autenticador");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este autenticador?")) {
      try {
        await axiosInstance.delete(`/api/autenticadores/${id}`);
        setAuthenticators(prev => prev.filter(auth => auth.id !== id));
        toast.success("Autenticador eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el autenticador");
      }
    }
  };

  const handleEdit = (authenticator: AuthenticatorFormData) => {
    setEditingAuthenticator(authenticator);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingAuthenticator(undefined);
  };

  const handleAddNew = () => {
    setEditingAuthenticator(undefined);
    setShowFormModal(true);
  };

  useEffect(() => {
    if (show) {
      fetchAuthenticators();
    }
  }, [show, organizationId]);

  return (
    <>
      <Modal
        isShown={show}
        onClose={onClose}
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Gestión de Autenticadores</h2>
          </div>
        }
      >
        <div className="space-y-4">
          <button
            onClick={handleAddNew}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Agregar Autenticador
          </button>

          <div className="border rounded-lg overflow-hidden mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authenticators.map(auth => (
                  <tr key={auth.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{auth.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {auth.config.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleEdit(auth)}
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(auth.id!)}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      <AuthenticatorFormModal
        show={showFormModal}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingAuthenticator}
        organizationId={organizationId}
      />
    </>
  );
}
