import Modal from "@components/Modal";
import { useState, useEffect, useCallback, Fragment } from "react";
import { FaPlus } from "react-icons/fa";
import { useAlertContext } from "../components/AlertContext";
import AuthenticatorFormModal from "./AuthenticatorFormModal";
import { AuthenticatorType } from "@interfaces/autenticators.interface";
import { Button } from "@components/common/Button";
import { DataList } from "@components/common/DataList";
import {
  useFetchAuthenticators,
  useDeleteAuthenticator,
  useAssignAuthenticator,
  useAuthenticatorSuccess,
} from "../hooks/useAuthenticatorActions";

interface AuthenticatorModalProps {
  show: boolean;
  onClose: () => void;
  organizationId: number;
  functionId?: number;
  selectedAuthenticatorId?: number;
  handleAuthenticatorUpdate?: (authenticatorId: number | undefined) => void;
  onAuthenticatorChange?: (functionId: number, authenticatorId: number) => void;
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

const useFetchAuthenticatorsWrapper = (
  organizationId: number,
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>
) => {
  const fetchAuthenticators = useFetchAuthenticators();

  return useCallback(async () => {
    const result = await fetchAuthenticators(organizationId);
    if (result.success && result.data) {
      setAuthenticators(result.data);
    }
  }, [organizationId, fetchAuthenticators, setAuthenticators]);
};

const useAuthenticatorSubmit = (
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  onClose: () => void
) => {
  const success = useAuthenticatorSuccess();

  return {
    onSubmit: async (data: AuthenticatorType, result: AuthenticatorType) => {
      setAuthenticators(prev =>
        data.id
          ? prev.map(auth => (auth.id === data.id ? result : auth))
          : [...prev, result]
      );
      success();
      onClose();
    },
  };
};

const useAuthenticatorDeleteWrapper = (
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  showConfirmation: (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => Promise<boolean>
) => {
  const deleteAuthenticator = useDeleteAuthenticator();

  return useCallback(
    async (id: number) => {
      const confirmed = await showConfirmation({
        title: "Eliminar Autenticador",
        text: "¿Estás seguro que deseas eliminar este autenticador?",
      });

      if (!confirmed) return;

      const result = await deleteAuthenticator(id);
      if (result.success) {
        setAuthenticators(prev => prev.filter(auth => auth.id !== id));
      }
    },
    [setAuthenticators, showConfirmation, deleteAuthenticator]
  );
};

const useAuthenticatorActions = (
  organizationId: number,
  setAuthenticators: React.Dispatch<React.SetStateAction<AuthenticatorType[]>>,
  onClose: () => void,
  onSelect: (id: number) => void,
  showConfirmation: (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => Promise<boolean>
) => {
  const fetchAuthenticators = useFetchAuthenticatorsWrapper(
    organizationId,
    setAuthenticators
  );
  const { onSubmit: handleSubmit } = useAuthenticatorSubmit(
    setAuthenticators,
    onClose
  );
  const handleDelete = useAuthenticatorDeleteWrapper(
    setAuthenticators,
    showConfirmation
  );

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
}: AuthenticatorTableProps) => {
  const items = authenticators.map(auth => ({
    fields: [
      { label: "Nombre", value: auth.name },
      {
        label: "URL",
        value: (auth.config as { url: string })?.url || auth.value,
      },
    ],
    actions: (
      <Fragment>
        <button
          onClick={e => {
            e.stopPropagation();
            onSelect(auth.id!);
          }}
          className={`flex w-5 h-5 p-[2px] justify-center items-center gap-[10px] rounded-[24px] ${
            auth.id === selectedAuthenticatorId
              ? "bg-sofia-electricOlive"
              : "bg-sofia-error"
          }`}
        >
          <img
            src={
              auth.id === selectedAuthenticatorId
                ? "/mvp/check.svg"
                : "/mvp/XIcon.svg"
            }
            alt="Seleccionar"
            className="w-4 h-4"
          />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit(auth);
          }}
          className="p-2 hover:bg-sofia-electricOlive/10 rounded-lg transition-colors"
        >
          <img src="/mvp/square-pen.svg" alt="Editar" className="w-4 h-4" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(auth.id!);
          }}
          className="p-2 hover:bg-sofia-electricOlive/10 rounded-lg transition-colors"
        >
          <img src="/mvp/trash.svg" alt="Eliminar" className="w-4 h-4" />
        </button>
      </Fragment>
    ),
    selected: auth.id === selectedAuthenticatorId,
    onClick: () => onSelect(auth.id!),
  }));

  return (
    <DataList items={items} emptyMessage="No hay autenticadores configurados" />
  );
};

interface AddAuthenticatorButtonProps {
  onClick: () => void;
}

const AddAuthenticatorButton = ({ onClick }: AddAuthenticatorButtonProps) => (
  <Button onClick={onClick} variant="primary" className="w-full">
    <FaPlus className="mr-2" />
    Agregar Autenticador
  </Button>
);

export function AuthenticatorModal({
  show,
  onClose,
  organizationId,
  functionId,
  selectedAuthenticatorId,
  handleAuthenticatorUpdate,
  onAuthenticatorChange,
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

  const { showConfirmation } = useAlertContext();
  const assignAuthenticator = useAssignAuthenticator();

  const { fetchAuthenticators, handleSubmit, handleDelete, handleSelect } =
    useAuthenticatorActions(
      organizationId,
      setAuthenticators,
      handleCloseForm,
      async id => {
        if (functionId) {
          // If the authenticator is already selected, deselect it by sending null
          const newAuthenticatorId = id === selectedAuthenticatorId ? null : id;

          const result = await assignAuthenticator(
            functionId,
            newAuthenticatorId
          );
          if (result.success) {
            handleAuthenticatorUpdate?.(newAuthenticatorId || undefined);
            if (newAuthenticatorId) {
              onAuthenticatorChange?.(functionId, newAuthenticatorId);
            }
            onClose();
          }
        }
      },
      showConfirmation
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
          <div className="flex justify-between items-center w-[518px]">
            <h2 className="text-lg font-semibold">Gestión de Autenticadores</h2>
          </div>
        }
      >
        <div className="space-y-6">
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
