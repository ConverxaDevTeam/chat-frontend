import ChatPreview from "./ChatPreview";
import { Integracion } from "./CustomizeChat";

interface EditTextsProps {
  integration: Integracion;
  setIntegration: (integration: Integracion) => void;
}

const EditTexts = ({ integration, setIntegration }: EditTextsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntegration({
      ...integration,
      config: {
        ...integration.config,
        [e.target.name]: e.target.value,
      },
    });
  };
  return (
    <div className="flex gap-[20px] items-start">
      <div className="flex flex-col flex-1 gap-[10px] items-start">
        <label className="block text-sm font-medium text-gray-600">
          Textos
        </label>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Título</label>
          <input
            type="text"
            name="title"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2"
            placeholder="Título del chat"
            value={integration.config.title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Nombre de chat
          </label>
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-md p-2"
            placeholder="Chat"
            value={integration.config.name}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Subtítulo</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-md p-2"
            value={integration.config.sub_title}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Descripción
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-md p-2 "
            value={integration.config.description}
          />
        </div>
      </div>

      <ChatPreview config={integration.config} />
    </div>
  );
};

export default EditTexts;
