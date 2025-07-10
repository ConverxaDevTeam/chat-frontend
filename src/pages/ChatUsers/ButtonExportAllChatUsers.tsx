import {
  IChatUsersFilters,
  IChatUser,
  ChatUserType,
} from "@interfaces/chatUsers";
import { getAllChatUsersForExport } from "@services/chatUsers";
import { RootState } from "@store";
import { convertISOToReadable, getPdfMonthDayYear } from "@utils/format";
import { alertConfirm, alertError, alertInfo } from "@utils/alerts";
import pdfMake from "pdfmake/build/pdfmake";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";

const pdfMakeFonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudfare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

pdfMake.fonts = pdfMakeFonts;

interface ButtonExportAllChatUsersProps {
  appliedFilters?: IChatUsersFilters;
}

const ButtonExportAllChatUsers = ({
  appliedFilters,
}: ButtonExportAllChatUsersProps) => {
  const { selectOrganizationId } = useSelector(
    (state: RootState) => state.auth
  );

  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getChannelName = (type?: ChatUserType): string => {
    switch (type) {
      case ChatUserType.MESSENGER:
        return "Messenger";
      case ChatUserType.WHATSAPP:
        return "WhatsApp";
      case ChatUserType.SLACK:
        return "Slack";
      case ChatUserType.CHAT_WEB:
        return "Chat Web";
      default:
        return "No especificado";
    }
  };

  const getConversationStatus = (chatUser: IChatUser): string => {
    if (chatUser.lastConversation?.assigned_user_id) return "Asignado";
    if (!chatUser.lastConversation?.need_human) return "IA";
    return "Pendiente";
  };

  const generateCSV = async () => {
    if (!selectOrganizationId) {
      alertError("No se ha seleccionado una organización");
      return;
    }

    setIsExporting(true);
    setShowDropdown(false);

    try {
      // Obtener todos los chat users que cumplen con los filtros
      alertInfo("Obteniendo todos los clientes...");
      const filtersWithOrg = {
        ...appliedFilters,
        organizationId: selectOrganizationId,
      };
      const allChatUsers = await getAllChatUsersForExport(filtersWithOrg, true);

      if (allChatUsers.length === 0) {
        alertInfo("No hay clientes disponibles para exportar");
        setIsExporting(false);
        return;
      }

      alertInfo(
        `Preparando la exportación de ${allChatUsers.length} clientes...`
      );

      // Crear CSV
      const headers = [
        "ID",
        "Nombre",
        "Email",
        "Teléfono",
        "Canal",
        "Fecha de registro",
        "Último login",
        "Estado conversación",
        "Mensajes no leídos",
        "Departamento",
        "Última actividad",
        "Último mensaje",
      ];

      const rows = allChatUsers.map(chatUser => {
        const standardInfo = chatUser.standardInfo;
        const lastConversation = chatUser.lastConversation;

        return [
          standardInfo?.id || "",
          standardInfo?.name || "No especificado",
          standardInfo?.email || "No especificado",
          standardInfo?.phone || "No especificado",
          getChannelName(standardInfo?.type),
          standardInfo?.created_at
            ? convertISOToReadable(standardInfo.created_at, false)
            : "No especificado",
          standardInfo?.last_login
            ? convertISOToReadable(standardInfo.last_login, false)
            : "No especificado",
          getConversationStatus(chatUser),
          lastConversation?.unread_messages || 0,
          lastConversation?.department || "No especificado",
          lastConversation?.last_activity
            ? convertISOToReadable(lastConversation.last_activity, false)
            : "No especificado",
          lastConversation?.last_message_text || "No disponible",
        ];
      });

      // Convertir a CSV
      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Descargar archivo
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `reporte-todos-clientes-${getPdfMonthDayYear()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      alertConfirm("Exportación CSV completada con éxito");
    } catch (error) {
      console.error("Error al exportar los clientes:", error);
      alertError("Error al exportar los clientes");
    } finally {
      setIsExporting(false);
    }
  };

  async function generatePDF() {
    if (!selectOrganizationId) {
      alertError("No se ha seleccionado una organización");
      return;
    }

    setIsExporting(true);
    setShowDropdown(false);

    try {
      // Obtener todos los chat users que cumplen con los filtros
      alertInfo("Obteniendo todos los clientes...");
      const filtersWithOrg = {
        ...appliedFilters,
        organizationId: selectOrganizationId,
      };
      const allChatUsers = await getAllChatUsersForExport(filtersWithOrg, true);

      if (allChatUsers.length === 0) {
        alertInfo("No hay clientes disponibles para exportar");
        setIsExporting(false);
        return;
      }

      alertInfo(
        `Preparando la exportación de ${allChatUsers.length} clientes...`
      );
      const imageUrl = "/logo.png";

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async function () {
        const base64data = reader.result as string;
        interface DocDefinition {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: any[];
          styles?: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key: string]: any;
          };
          defaultStyle?: {
            fontSize?: number;
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          background?: any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              text: `Reporte de todos los clientes`,
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
              text: `Total de clientes: ${allChatUsers.length}`,
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
            clientHeader: {
              fontSize: 16,
              bold: true,
              color: "#343E4F",
              margin: [0, 15, 0, 0],
            },
            clientInfo: {
              fontSize: 12,
              margin: [10, 0, 0, 0],
            },
          },
          footer: function (currentPage: number, pageCount: number) {
            return {
              text: `Página ${currentPage} de ${pageCount} - Generado por Sofia Chat`,
              alignment: "center",
              style: "footer",
            };
          },
        };

        allChatUsers.forEach((chatUser, index) => {
          const standardInfo = chatUser.standardInfo;
          const lastConversation = chatUser.lastConversation;

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
            text: `Cliente ID: ${standardInfo?.id || "N/A"}`,
            style: "clientHeader",
          });

          docDefinition.content.push({
            text: [
              { text: "Nombre: ", bold: true },
              {
                text: `${standardInfo?.name || "No especificado"}\n`,
                bold: false,
              },
              { text: "Email: ", bold: true },
              {
                text: `${standardInfo?.email || "No especificado"}\n`,
                bold: false,
              },
              { text: "Teléfono: ", bold: true },
              {
                text: `${standardInfo?.phone || "No especificado"}\n`,
                bold: false,
              },
              { text: "Canal: ", bold: true },
              { text: `${getChannelName(standardInfo?.type)}\n`, bold: false },
              { text: "Registro: ", bold: true },
              {
                text: `${
                  standardInfo?.created_at
                    ? convertISOToReadable(standardInfo.created_at, false)
                    : "No especificado"
                }\n`,
                bold: false,
              },
              { text: "Último login: ", bold: true },
              {
                text: `${
                  standardInfo?.last_login
                    ? convertISOToReadable(standardInfo.last_login, false)
                    : "No especificado"
                }\n`,
                bold: false,
              },
            ],
            margin: [0, 0, 0, 10],
          });

          if (lastConversation) {
            docDefinition.content.push({
              text: "Última conversación:",
              style: "subheader",
              margin: [0, 5, 0, 5],
            });

            docDefinition.content.push({
              text: [
                { text: "Estado: ", bold: true },
                { text: `${getConversationStatus(chatUser)}\n`, bold: false },
                { text: "Mensajes no leídos: ", bold: true },
                {
                  text: `${lastConversation.unread_messages || 0}\n`,
                  bold: false,
                },
                { text: "Departamento: ", bold: true },
                {
                  text: `${lastConversation.department || "No especificado"}\n`,
                  bold: false,
                },
                { text: "Última actividad: ", bold: true },
                {
                  text: `${
                    lastConversation.last_activity
                      ? convertISOToReadable(
                          lastConversation.last_activity,
                          false
                        )
                      : "No especificado"
                  }\n`,
                  bold: false,
                },
                { text: "Último mensaje: ", bold: true },
                {
                  text: `${lastConversation.last_message_text || "No disponible"}`,
                  bold: false,
                },
              ],
              style: "clientInfo",
              margin: [0, 0, 0, 5],
            });
          } else {
            docDefinition.content.push({
              text: "Sin conversaciones registradas",
              italics: true,
              style: "clientInfo",
            });
          }

          // Agregar datos personalizados si existen
          if (
            chatUser.customData &&
            Object.keys(chatUser.customData).length > 0
          ) {
            docDefinition.content.push({
              text: "Datos personalizados:",
              style: "subheader",
              margin: [0, 5, 0, 5],
            });

            const customDataText = Object.entries(chatUser.customData)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");

            docDefinition.content.push({
              text: customDataText,
              style: "clientInfo",
              margin: [0, 0, 0, 5],
            });
          }

          // Agregar mensajes de la conversación si existen
          if (
            lastConversation?.messages &&
            lastConversation.messages.length > 0
          ) {
            docDefinition.content.push({
              text: "Mensajes de la conversación:",
              style: "subheader",
              margin: [0, 10, 0, 5],
            });

            lastConversation.messages.forEach(message => {
              const messageText = message.text?.trim() || "";
              const hasImage =
                (message.images && message.images.length > 0) ||
                messageText.includes("<img") ||
                messageText.includes("data:image");
              const displayText =
                messageText ||
                (hasImage ? "[Imagen adjunta]" : "[Sin contenido]");

              docDefinition.content.push({
                text: [
                  {
                    text: `${convertISOToReadable(message.created_at, false)} - `,
                    fontSize: 10,
                    color: "#666",
                  },
                  {
                    text: message.type === "user" ? "Usuario: " : "Asistente: ",
                    bold: true,
                  },
                  {
                    text: displayText,
                    bold: false,
                  },
                ],
                margin: [10, 0, 0, 3],
              });
            });
          }
        });

        pdfMake
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .createPdf(docDefinition as any)
          .download(`reporte-todos-clientes-${getPdfMonthDayYear()}.pdf`);

        alertConfirm("Exportación completada con éxito");
        setIsExporting(false);
      };
    } catch (error) {
      console.error("Error al exportar los clientes:", error);
      alertError("Error al exportar los clientes");
      setIsExporting(false);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="bg-sofia-superDark flex items-center justify-center rounded-[4px] w-[165px] h-[30px] p-2"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
      >
        <p className="text-[14px] font-medium text-white">
          {isExporting ? "Exportando..." : "Exportar clientes"}
        </p>
        <svg
          className={`ml-2 h-4 w-4 text-white transition-transform ${
            showDropdown ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={generatePDF}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar como PDF
            </button>
            <button
              onClick={generateCSV}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar como CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonExportAllChatUsers;
