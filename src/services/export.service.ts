import { ConversationDetailResponse } from "@interfaces/conversation";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const formatDate = (date: string): string => new Date(date).toLocaleString();

const escapeCSV = (text: string): string => text.replace(/"/g, '""');

const formatCSVRow = (msg: ConversationDetailResponse["messages"][0]): string =>
  `${formatDate(msg.created_at)},"${msg.type}","${escapeCSV(msg.text)}"`;

const formatExcelRow = (
  msg: ConversationDetailResponse["messages"][0]
): [string, string, string] => [formatDate(msg.created_at), msg.type, msg.text];

const formatPDFRow = (msg: ConversationDetailResponse["messages"][0]): string =>
  `${formatDate(msg.created_at)} - ${msg.type}:\n${msg.text}`;

export const exportToCSV = (conversation: ConversationDetailResponse): void => {
  const header = "Timestamp,Sender,Message\n";
  const rows = conversation.messages.map(formatCSVRow).join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `conversation-${conversation.id}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportToExcel = (
  conversation: ConversationDetailResponse
): void => {
  const header = ["Timestamp", "Sender", "Message"];
  const rows = conversation.messages.map(formatExcelRow);

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Conversation");

  XLSX.writeFile(wb, `conversation-${conversation.id}.xlsx`);
};

export const exportToPDF = (conversation: ConversationDetailResponse): void => {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Título
  doc.setFontSize(16);
  doc.text(`Conversation #${conversation.id}`, margin, y);
  y += 10;

  // Mensajes
  doc.setFontSize(12);
  conversation.messages.forEach(msg => {
    const text = formatPDFRow(msg);
    const lines = doc.splitTextToSize(
      text,
      doc.internal.pageSize.width - 2 * margin
    );

    // Agregar nueva página si es necesario
    if (y + lines.length * 7 > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(lines, margin, y);
    y += lines.length * 7 + 5;
  });

  doc.save(`conversation-${conversation.id}.pdf`);
};
