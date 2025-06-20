import { IOrganization } from "@interfaces/organization.interface";
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

pdfMake.fonts = pdfMakeFonts;

interface ButtonExportAllOrganizationsProps {
  organizations: IOrganization[];
}

const ButtonExportAllOrganizations = ({
  organizations,
}: ButtonExportAllOrganizationsProps) => {
  function generateTablePDF(e: React.MouseEvent) {
    e.stopPropagation();
    const imageUrl = "/logo.png";

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
          const base64data = reader.result as string;

          const tableBody: PdfCell[][] = [
            [
              { text: "Código", style: "tableHeader" },
              { text: "Nombre", style: "tableHeader" },
              { text: "Email", style: "tableHeader" },
              { text: "Descripción", style: "tableHeader" },
              { text: "Usuarios", style: "tableHeader" },
              { text: "Departamentos", style: "tableHeader" },
            ],
          ];

          const sortedOrganizations = [...organizations].sort((a, b) => {
            const usersA = a.users || 0;
            const usersB = b.users || 0;
            return usersB - usersA;
          });

          sortedOrganizations.forEach(org => {
            tableBody.push([
              { text: org.id.toString(), style: "tableCell" },
              { text: org.name, style: "tableCell" },
              {
                text: org.email || org.owner?.user.email || "-",
                style: "tableCell",
              },
              { text: org.description || "-", style: "tableCell" },
              {
                text: org.users?.toString() || "0",
                style: "tableCell",
                alignment: "right",
              },
              {
                text:
                  org.departments !== undefined
                    ? org.departments.toString()
                    : "-",
                style: "tableCell",
                alignment: "right",
              },
            ]);
          });

          const docDefinition = {
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [20, 60, 20, 40],
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
                text: "Estadística de Organizaciones",
                style: "header",
                margin: [0, 10, 0, 10],
              },
              {
                text: `Total de organizaciones: ${organizations.length}`,
                style: "subheader",
                margin: [0, 0, 0, 10],
              },
              {
                table: {
                  headerRows: 1,
                  widths: ["auto", "*", "*", "*", "auto", "auto"],
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
                  vLineColor: function (i: number) {
                    return i === 0 || i === 5 ? "#AAAAAA" : "#DDDDDD";
                  },
                },
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                alignment: "center",
              },
              subheader: {
                fontSize: 14,
                bold: true,
              },
              tableHeader: {
                bold: true,
                fontSize: 10,
                color: "#333",
                fillColor: "#f8f8f8",
                alignment: "center",
              },
              tableCell: {
                fontSize: 9,
                color: "#333",
                alignment: "left",
              },
            },
          };

          pdfMake
            // @ts-expect-error no está definido en el tipo
            .createPdf(docDefinition)
            .download(`reporte-organizaciones-${getPdfMonthDayYear()}.pdf`);
        };
      })
      .catch(error => console.error("Error cargando la imagen:", error));
  }

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

export default ButtonExportAllOrganizations;
