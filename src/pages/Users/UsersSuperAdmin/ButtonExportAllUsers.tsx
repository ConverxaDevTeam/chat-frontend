import { IUserApi } from "../UsersOrganization";
import { getPdfMonthDayYear, getFormattedDate } from "@utils/format";
import pdfMake from "pdfmake/build/pdfmake";

interface PdfCell {
  text: string;
  style: string;
  alignment?: "left" | "center" | "right";
  color?: string;
  fillColor?: string;
}

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

interface ButtonExportAllUsersProps {
  users: IUserApi[];
}

const ButtonExportAllUsers = ({ users }: ButtonExportAllUsersProps) => {
  const generateTablePDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageUrl = "/logo.svg";

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          const base64data = reader.result as string;

          const tableBody: PdfCell[][] = [
            [
              { text: "ID", style: "tableHeader" },
              { text: "Email", style: "tableHeader" },
              { text: "Nombre", style: "tableHeader" },
              { text: "Apellido", style: "tableHeader" },
              { text: "Organizaciones", style: "tableHeader" },
              { text: "Rol", style: "tableHeader" },
              { text: "Verificado", style: "tableHeader" },
              { text: "Último Login", style: "tableHeader" },
            ],
          ];

          const sortedUsers = [...users].sort((a, b) => {
            const orgCountA = a.userOrganizations.filter(
              org => org.organization
            ).length;
            const orgCountB = b.userOrganizations.filter(
              org => org.organization
            ).length;
            return orgCountB - orgCountA;
          });

          sortedUsers.forEach(user => {
            const organizationNames = user.userOrganizations
              .filter(org => org.organization)
              .map(org => org.organization?.name)
              .filter(Boolean)
              .join(", ");

            const uniqueRoles = [
              ...new Set(user.userOrganizations.map(org => org.role)),
            ];
            const rolesString = uniqueRoles.join(", ");

            const verificationStatus = user.email_verified
              ? "Verificado"
              : "No Verificado";

            const lastLogin = user.last_login
              ? new Date(user.last_login).toLocaleDateString()
              : "Nunca";

            tableBody.push([
              { text: user.id.toString(), style: "tableCell" },
              { text: user.email, style: "tableCell" },
              { text: user.first_name || "-", style: "tableCell" },
              { text: user.last_name || "-", style: "tableCell" },
              { text: organizationNames || "-", style: "tableCell" },
              { text: rolesString, style: "tableCell" },
              { text: verificationStatus, style: "tableCell" },
              { text: lastLogin, style: "tableCell" },
            ]);
          });

          const docDefinition = {
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [20, 60, 20, 60],
            defaultStyle: {
              font: "Roboto",
            },
            header: {
              columns: [
                {
                  image: base64data,
                  width: 120,
                  height: 21,
                  margin: [20, 20, 0, 0],
                },
                {
                  text: "SOFIA CHAT",
                  alignment: "right",
                  margin: [0, 20, 20, 0],
                  fontSize: 10,
                  color: "#666",
                },
              ],
            },
            footer: function (currentPage: number, pageCount: number) {
              return {
                columns: [
                  {
                    stack: [
                      {
                        text: "Fecha: " + getFormattedDate(),
                        fontSize: 8,
                        color: "#666",
                      },
                      {
                        text: "Resumen generado por: Sofia Chat",
                        fontSize: 8,
                        color: "#666",
                        margin: [0, 2, 0, 0],
                      },
                    ],
                    margin: [20, 0, 0, 0],
                  },
                  {
                    text:
                      "Página " + currentPage.toString() + " de " + pageCount,
                    alignment: "right",
                    margin: [0, 0, 20, 0],
                    fontSize: 8,
                    color: "#666",
                  },
                ],
              };
            },
            content: [
              {
                text: "Estadística de Usuarios",
                style: "header",
                margin: [0, 10, 0, 10],
              },
              {
                text: `Total de usuarios: ${users.length}`,
                style: "subheader",
                margin: [0, 0, 0, 10],
              },
              {
                table: {
                  headerRows: 1,
                  widths: [
                    "auto",
                    "*",
                    "auto",
                    "auto",
                    "*",
                    "auto",
                    "auto",
                    "auto",
                  ],
                  body: tableBody,
                },
                layout: {
                  hLineWidth: function (
                    i: number,
                    node: { table: { body: unknown[] } }
                  ) {
                    return i === 0 || i === 1 || i === node.table.body.length
                      ? 1
                      : 0.5;
                  },
                  vLineWidth: function (
                    i: number,
                    node: { table: { widths: unknown[] } }
                  ) {
                    return i === 0 || i === node.table.widths.length ? 1 : 0.5;
                  },
                  hLineColor: function (i: number) {
                    return i === 0 || i === 1 ? "#AAAAAA" : "#DDDDDD";
                  },
                  vLineColor: function (
                    i: number,
                    node: { table: { widths: unknown[] } }
                  ) {
                    return i === 0 || i === node.table.widths.length
                      ? "#AAAAAA"
                      : "#DDDDDD";
                  },
                } as {
                  hLineWidth: (
                    i: number,
                    node: { table: { body: unknown[] } }
                  ) => number;
                  vLineWidth: (
                    i: number,
                    node: { table: { widths: unknown[] } }
                  ) => number;
                  hLineColor: (i: number) => string;
                  vLineColor: (
                    i: number,
                    node: { table: { widths: unknown[] } }
                  ) => string;
                },
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                color: "#001130",
              },
              subheader: {
                fontSize: 14,
                bold: true,
                color: "#666",
              },
              tableHeader: {
                bold: true,
                fontSize: 10,
                color: "#001130",
                fillColor: "#F2F2F2",
              },
              tableCell: {
                fontSize: 9,
              },
              footer: {
                fontSize: 8,
                color: "#666",
              },
            },
          };

          pdfMake
            // @ts-expect-error no está definido en el tipo
            .createPdf(docDefinition, undefined, pdfMakeFonts)
            .download(`usuarios_${getPdfMonthDayYear()}.pdf`);
        };
      })
      .catch(error => console.error("Error cargando la imagen:", error));
  };

  return (
    <button
      type="button"
      onClick={generateTablePDF}
      className="flex items-center justify-center gap-1 px-4 w-[135px] h-[41px] text-white rounded leading-[24px] bg-[#001130] hover:bg-opacity-90"
    >
      Exportar PDF
    </button>
  );
};

export default ButtonExportAllUsers;
