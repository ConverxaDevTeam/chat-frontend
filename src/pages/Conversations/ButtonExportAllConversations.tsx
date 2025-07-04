import { ConversationListItem, MessageType } from "@interfaces/conversation";
import { IntegrationType } from "@interfaces/integrations";
import { getConversationByOrganizationIdAndById } from "@services/conversations";
import { RootState } from "@store";
import { convertISOToReadable, getPdfMonthDayYear } from "@utils/format";
import { alertConfirm, alertError, alertInfo } from "@utils/alerts";
import pdfMake from "pdfmake/build/pdfmake";
import { useSelector } from "react-redux";
import { useState } from "react";

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

pdfMake.fonts = pdfMakeFonts;

interface ButtonExportAllConversationsProps {
  conversations: ConversationListItem[];
}

const ButtonExportAllConversations = ({
  conversations,
}: ButtonExportAllConversationsProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const [isExporting, setIsExporting] = useState(false);

  async function generatePDF(e: React.MouseEvent) {
    e.stopPropagation();

    if (conversations.length === 0) {
      alertInfo("No hay conversaciones disponibles para exportar");
      return;
    }

    alertInfo("Preparando la exportación de todos los chats...");
    setIsExporting(true); // Deshabilitar el botón mientras se exporta

    try {
      const imageUrl = "/logo.svg";

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async function () {
        if (!selectOrganizationId) return;

        const base64data = reader.result as string;
        interface DocDefinition {
          content: any[];
          styles?: {
            [key: string]: any;
          };
          defaultStyle?: {
            fontSize?: number;
          };
          background?: any;
          footer?: any;
        }

        const docDefinition: DocDefinition = {
          content: [
            {
              image: base64data,
              width: 120,
              alignment: "center",
              margin: [0, 0, 0, 20],
            },
            {
              text: `Reporte de todas las conversaciones`,
              style: "header",
              alignment: "center",
              margin: [0, 0, 0, 10],
            },
            {
              text: `Fecha de generación: ${getPdfMonthDayYear()}`,
              style: "subheader",
              alignment: "center",
              margin: [0, 0, 0, 20],
            },
            {
              text: `Total de conversaciones: ${conversations.length}`,
              style: "subheader",
              margin: [0, 0, 0, 30],
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
            conversationHeader: {
              fontSize: 16,
              bold: true,
              color: "#343E4F",
              margin: [0, 15, 0, 0],
            },
            message: {
              fontSize: 12,
              margin: [10, 0, 0, 0],
            },
          },
          footer: function (currentPage: number, pageCount: number) {
            return {
              text: `Página ${currentPage} de ${pageCount} - Generado por Converxa`,
              alignment: "center",
              style: "footer",
            };
          },
        };

        const conversationPromises = conversations.map(conv =>
          getConversationByOrganizationIdAndById(
            selectOrganizationId,
            conv.id
          ).catch(error => {
            console.error(
              `Error al obtener detalles de conversación ${conv.id}:`,
              error
            );
            return null;
          })
        );

        const conversationDetails = await Promise.all(conversationPromises);

        conversationDetails.forEach((conversationDetail, index) => {
          const conversation = conversations[index];

          if (!conversationDetail) {
            docDefinition.content.push({
              text: `Error al cargar la conversación ID: ${conversation.id}`,
              margin: [0, 0, 0, 10],
            });
            return;
          }

          const messages = conversationDetail?.messages || [];
          let channel = "";

          switch (conversation.type) {
            case IntegrationType.MESSENGER:
              channel = "Messenger";
              break;
            case IntegrationType.WHATSAPP:
              channel = "WhatsApp";
              break;
            case IntegrationType.SLACK:
              channel = "Slack";
              break;
            default:
              channel = "Web";
              break;
          }

          if (docDefinition.content.length > 4 || index > 0) {
            docDefinition.content.push({
              canvas: [
                {
                  type: "line",
                  x1: 0,
                  y1: 0,
                  x2: 515,
                  y2: 0,
                  lineWidth: 1,
                  lineColor: "#DBEAF2",
                },
              ],
              margin: [0, 20, 0, 20],
            });
          }

          docDefinition.content.push({
            text: `Conversación ID: ${conversation.id}`,
            style: "conversationHeader",
          });

          docDefinition.content.push({
            text: [
              { text: "Iniciado: ", bold: true },
              {
                text: `${convertISOToReadable(conversation.created_at, false)}\n`,
                bold: false,
              },
              { text: "Canal: ", bold: true },
              { text: `${channel}\n`, bold: false },
              { text: "Departamento: ", bold: true },
              {
                text: `${conversation.department || "No especificado"}\n`,
                bold: false,
              },
              { text: "Mensajes: ", bold: true },
              { text: `${messages.length}`, bold: false },
            ],
            margin: [0, 0, 0, 10],
          });

          if (messages.length > 0) {
            docDefinition.content.push({
              text: "Mensajes:",
              style: "subheader",
              margin: [0, 5, 0, 5],
            });

            for (const message of messages) {
              const messageText = message.text?.trim() || "";
              const hasImage =
                (message.images && message.images.length > 0) ||
                messageText.includes("<img") ||
                messageText.includes("data:image");
              const displayText =
                messageText || (hasImage ? "[Imagen adjunta]" : "");

              docDefinition.content.push({
                columns: [
                  {
                    width: "auto",
                    text:
                      message.type === MessageType.USER
                        ? "Usuario: "
                        : "Asistente: ",
                    bold: true,
                  },
                  {
                    width: "*",
                    text: displayText || "[Contenido no disponible]",
                    style: "message",
                  },
                ],
                margin: [0, 0, 0, 5],
              });
            }
          } else {
            docDefinition.content.push({
              text: "No hay mensajes disponibles",
              italics: true,
            });
          }
        });

        pdfMake
          .createPdf(docDefinition as any)
          .download(`reporte-todas-conversaciones-${getPdfMonthDayYear()}.pdf`);

        alertConfirm("Exportación completada con éxito");
        setIsExporting(false);
      };
    } catch (error) {
      console.error("Error al exportar las conversaciones:", error);
      alertError("Error al exportar las conversaciones");
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      className="bg-sofia-superDark flex items-center justify-center rounded-[4px] w-[165px] h-[30px] p-2"
      onClick={generatePDF}
      disabled={isExporting}
    >
      <p className="text-[14px] font-medium text-white">
        {isExporting ? "Exportando..." : "Exportar todos los chats"}
      </p>
    </button>
  );
};

export default ButtonExportAllConversations;
