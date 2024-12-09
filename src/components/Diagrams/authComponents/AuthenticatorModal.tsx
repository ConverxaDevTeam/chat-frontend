import Modal from "@components/Modal";
import { useState, useEffect, useCallback } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSweetAlert } from "@/hooks/useSweetAlert";
import { authenticatorService } from "@/services/authenticator.service";
import {
  Autenticador,
  BearerConfig,
  HttpAutenticador,
} from "@interfaces/autenticators.interface";
import AuthenticatorFormModal from "./AuthenticatorFormModal";

type AuthenticatorType = Autenticador<HttpAutenticador<BearerConfig>>;

interface AuthenticatorModalProps {
  show: boolean;
  onClose: () => void;
  organizationId: number;
  functionId?: number;
  selectedAuthenticatorId?: number;
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

const useFetchAuthenticators = (
  organizationId: number,
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>
) => {
  return useCallback(async () => {
    try {
      const data = await authenticatorService.fetchAll(organizationId);
      setAuthenticators(data);
    } catch {
      toast.error("Error al cargar autenticadores");
    }
  }, [organizationId]);
};

const useAuthenticatorSubmit = (
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  onClose: () => void
) => {
  return useCallback(
    async (data: AuthenticatorType) => {
      try {
        const result = data.id
          ? await authenticatorService.update(data.id, data)
          : await authenticatorService.create(data);

        setAuthenticators(prev =>
          data.id
            ? prev.map(auth => (auth.id === data.id ? result : auth))
            : [...prev, result]
        );

        toast.success(
          `Autenticador ${data.id ? "actualizado" : "creado"} exitosamente`
        );
        onClose();
      } catch {
        toast.error("Error al guardar el autenticador");
        throw new Error();
      }
    },
    [onClose]
  );
};

const useAuthenticatorDelete = (
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>
) => {
  return useCallback(async (id: number) => {
    const confirmed = await useSweetAlert().showConfirmation({
      title: "Eliminar Autenticador",
      text: "¿Estás seguro que deseas eliminar este autenticador?",
    });

    if (!confirmed) return;

    try {
      await authenticatorService.remove(id);
      setAuthenticators(prev => prev.filter(auth => auth.id !== id));
      toast.success("Autenticador eliminado exitosamente");
    } catch {
      toast.error("Error al eliminar el autenticador");
    }
  }, []);
};

const useAuthenticatorActions = (
  organizationId: number,
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  onClose: () => void,
  onSelect: (id: number) => void
) => {
  const fetchAuthenticators = useFetchAuthenticators(
    organizationId,
    setAuthenticators
  );
  const handleSubmit = useAuthenticatorSubmit(setAuthenticators, onClose);
  const handleDelete = useAuthenticatorDelete(setAuthenticators);

  const handleSelect = useCallback(
    async (authenticatorId: number) => {
      onSelect(authenticatorId);
    },
    [onSelect]
  );

  return {
    fetchAuthenticators,
    handleSubmit,
    handleDelete,
    handleSelect,
  };
};

interface AuthenticatorTableProps {
  authenticators: AuthenticatorType[];
  onEdit: (auth: AuthenticatorType) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  selectedAuthenticatorId?: number;
}

const AuthenticatorTable = ({
  authenticators,
  onEdit,
  onDelete,
  onSelect,
  selectedAuthenticatorId,
}: AuthenticatorTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Nombre
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            URL
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Acciones
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Seleccionar
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {authenticators.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No hay autenticadores configurados
            </td>
          </tr>
        ) : (
          authenticators.map(auth => (
            <AuthenticatorRow
              key={auth.id}
              auth={auth}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
              isSelected={auth.id === selectedAuthenticatorId}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

interface AuthenticatorRowProps {
  auth: AuthenticatorType;
  onEdit: (auth: AuthenticatorType) => void;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const AuthenticatorRow = ({
  auth,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
}: AuthenticatorRowProps) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[10rem] truncate">
      {auth.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[10rem] truncate">
      {auth.config.url}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button
        type="button"
        className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
        onClick={() => onEdit(auth)}
      >
        <FaEdit className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="text-red-600 hover:text-red-900 inline-flex items-center"
        onClick={() => onDelete(auth.id!)}
      >
        <FaTrash className="h-4 w-4" />
      </button>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <input
        type="radio"
        checked={isSelected}
        onChange={() => onSelect(auth.id!)}
        className="form-radio h-4 w-4 text-blue-600"
      />
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
  functionId,
  selectedAuthenticatorId,
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

  const { fetchAuthenticators, handleSubmit, handleDelete, handleSelect } =
    useAuthenticatorActions(
      organizationId,
      setAuthenticators,
      handleCloseForm,
      id => {
        if (functionId) {
          // TODO: Implement updateEdgeAuthenticator here
          onClose();
        }
      }
    );

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
            onSelect={handleSelect}
            selectedAuthenticatorId={selectedAuthenticatorId}
          />
        </div>
      </Modal>

      <AuthenticatorFormModal
        isShown={showFormModal}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingAuthenticator}
        organizationId={organizationId}
      />
    </>
  );
}
