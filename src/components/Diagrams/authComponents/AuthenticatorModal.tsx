import Modal from "@components/Modal";
import axiosInstance from "@config/axios";
import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthenticatorFormModal } from "./AuthenticatorFormModal";
import {
  Autenticador,
  HttpAutenticador,
  BearerConfig,
} from "@interfaces/autenticators.interface";
import { useSweetAlert } from "@hooks/useSweetAlert";

type AuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

interface AuthenticatorModalProps {
  show: boolean;
  onClose: () => void;
  organizationId: number;
}

const useAuthenticatorState = () => {
  const [authenticators, setAuthenticators] = useState<AuthenticatorType[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAuthenticator, setEditingAuthenticator] = useState<
    AuthenticatorType | undefined
  >();

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingAuthenticator(undefined);
  };

  const handleAddNew = () => {
    setEditingAuthenticator(undefined);
    setShowFormModal(true);
  };

  const handleEdit = (authenticator: AuthenticatorType) => {
    setEditingAuthenticator(authenticator);
    setShowFormModal(true);
  };

  return {
    authenticators,
    setAuthenticators,
    showFormModal,
    editingAuthenticator,
    handleCloseForm,
    handleAddNew,
    handleEdit,
  };
};

const useAuthenticatorActions = (
  organizationId: number,
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  onClose: () => void
) => {
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

  const handleSubmit = async (data: AuthenticatorType): Promise<void> => {
    try {
      if (data.id) {
        const response = await axiosInstance.patch(
          `/api/autenticadores/${data.id}`,
          data
        );
        setAuthenticators(prev =>
          prev.map(auth => (auth.id === data.id ? response.data : auth))
        );
        toast.success("Autenticador actualizado exitosamente");
      } else {
        const response = await axiosInstance.post("/api/autenticadores", {
          ...data,
          life_time: 3600,
          value: "",
        });
        setAuthenticators(prev => [...prev, response.data]);
        toast.success("Autenticador creado exitosamente");
      }
      onClose(); // Cerramos el modal después de guardar exitosamente
    } catch (error) {
      toast.error("Error al guardar el autenticador");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (
      await useSweetAlert().showConfirmation({
        title: "Eliminar Autenticador",
        text: "¿Estás seguro que deseas eliminar este autenticador?",
      })
    ) {
      try {
        await axiosInstance.delete(`/api/autenticadores/${id}`);
        setAuthenticators(prev => prev.filter(auth => auth.id !== id));
        toast.success("Autenticador eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el autenticador");
      }
    }
  };

  return {
    fetchAuthenticators,
    handleSubmit,
    handleDelete,
  };
};

interface AuthenticatorTableProps {
  authenticators: AuthenticatorType[];
  onEdit: (auth: AuthenticatorType) => void;
  onDelete: (id: number) => void;
}

const AuthenticatorTable = ({
  authenticators,
  onEdit,
  onDelete,
}: AuthenticatorTableProps) => (
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
          <AuthenticatorRow
            key={auth.id}
            auth={auth}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  </div>
);

interface AuthenticatorRowProps {
  auth: AuthenticatorType;
  onEdit: (auth: AuthenticatorType) => void;
  onDelete: (id: number) => void;
}

const AuthenticatorRow = ({
  auth,
  onEdit,
  onDelete,
}: AuthenticatorRowProps) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">{auth.name}</td>
    <td className="px-6 py-4 whitespace-nowrap">{auth.config.url}</td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <button
        type="button"
        className="text-blue-600 hover:text-blue-800 mr-2"
        onClick={() => onEdit(auth)}
      >
        <FaEdit className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="text-red-600 hover:text-red-800"
        onClick={() => onDelete(auth.id!)}
      >
        <FaTrash className="h-4 w-4" />
      </button>
    </td>
  </tr>
);

interface AddAuthenticatorButtonProps {
  onClick: () => void;
}

const AddAuthenticatorButton = ({ onClick }: AddAuthenticatorButtonProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
  >
    <FaPlus className="mr-2" />
    Agregar Autenticador
  </button>
);

export function AuthenticatorModal({
  show,
  onClose,
  organizationId,
}: AuthenticatorModalProps) {
  const {
    authenticators,
    setAuthenticators,
    showFormModal,
    editingAuthenticator,
    handleCloseForm,
    handleAddNew,
    handleEdit,
  } = useAuthenticatorState();

  const { fetchAuthenticators, handleSubmit, handleDelete } =
    useAuthenticatorActions(organizationId, setAuthenticators, handleCloseForm);

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
          <AddAuthenticatorButton onClick={handleAddNew} />
          <AuthenticatorTable
            authenticators={authenticators}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
