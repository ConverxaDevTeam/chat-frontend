import { ConversationListItem } from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { getConversationByOrganizationIdAndById } from "@services/conversations";
import { RootState } from "@store";
import { convertISOToReadable, getPdfMonthDayYear } from "@utils/format";
import pdfMake from "pdfmake/build/pdfmake";
import { useSelector } from "react-redux";

const pdfMakeFonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

// Assign the custom fonts to pdfMake
pdfMake.fonts = pdfMakeFonts;
interface ButtonExportConversationProps {
  conversation: ConversationListItem;
}

const ButtonExportConversation = ({
  conversation,
}: ButtonExportConversationProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  function generatePDF(e: React.MouseEvent) {
    e.stopPropagation();
    const imageUrl = "/logo.svg";

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
          if (!selectOrganizationId) return;
          const conversationDetail =
            await getConversationByOrganizationIdAndById(
              selectOrganizationId,
              conversation.id
            );
          const base64data = reader.result as string; // Asegúrate de que no es null
          const messages = conversationDetail?.messages || [];
          let channel = "";

          switch (conversation.type) {
            case IntegrationType.MESSENGER:
              channel = "Messenger";
              break;
            case IntegrationType.WHATSAPP:
              channel = "WhatsApp";
              break;
            default:
              channel = "Web";
              break;
          }

          const docDefinition = {
            content: [
              {
                image: base64data, // Ahora debería ser un string válido (base64)
                width: 120,
                height: 21,
                alignment: "center",
                marginBottom: 20, // Mueve esto al primer objeto si lo necesitas
              },
              {
                text: `Detalles de la conversación:`,
                style: "header",
              },
              {
                text: `ID de conversación: ${conversation.id}`,
                color: "#666",
                style: "subheader",
              },
              {
                text: `Iniciado: ${convertISOToReadable(conversation.created_at, false)}`,
                color: "#666",
                style: "subheader",
              },
              {
                text: `Canal: ${channel}`,
                color: "#666",
                style: "subheader",
              },
              {
                text: `Mensajes Totales: ${messages.length}`,
                color: "#666",
                style: "subheader",
              },
              {
                text: "Resumen generado por: Converxa",
                style: "footer",
                absolutePosition: { x: 20, y: 750 }, // Ajusta la posición (y para moverlo verticalmente)
              },
            ],
            background: function () {
              return {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 0,
                    w: 595.28,
                    h: 841.89,
                    color: "#F4FAFF",
                  },
                  {
                    type: "rect",
                    x: 20,
                    y: 20,
                    w: 555.28,
                    h: 801.89,
                    color: "#ffffff",
                  },
                ],
              };
            },
            styles: {
              header: {
                fontSize: 18,
                bold: true,
              },
              footer: {
                italics: true,
                alignment: "right",
                fontSize: 12,
              },
              subheader: {
                fontSize: 14,
                bold: true,
              },
            },
          };

          if (messages.length !== 0) {
            // @ts-expect-error No se puede asignar a 'content' porque es de solo lectura
            docDefinition.content.push({
              text: "Mensajes:",
              style: "header",
              marginBottom: 20,
              alignment: "center",
            });
          }

          for (const message of messages) {
            docDefinition.content.push({
              text: `${message.type}: ${message.text}`,
              color: "#666",
              style: "subheader",
            });
          }
          pdfMake
            // @ts-expect-error no exta definido en el tipo
            .createPdf(docDefinition)
            .download(
              `reporte-${getPdfMonthDayYear()}-id-${conversation.id}.pdf`
            );
        };
      })
      .catch(error => console.error("Error cargando la imagen:", error));
  }

  return (
    <button type="button" onClick={generatePDF}>
      <img
        src="/mvp/icon-export.svg"
        alt="Exportar"
        className="w-[18px] h-[18px]"
      />
    </button>
  );
};

export default ButtonExportConversation;
