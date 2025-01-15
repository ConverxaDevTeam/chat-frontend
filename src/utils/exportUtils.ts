import { ConversationDetailResponse } from "@interfaces/conversation";

const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const exportToCSV = (conversation: ConversationDetailResponse) => {
  const header = "Timestamp,Sender,Message\n";
  const rows = conversation.messages
    .map(
      msg =>
        `${new Date(msg.created_at).toLocaleString()},"${msg.type}","${msg.text.replace(/"/g, '""')}"`
    )
    .join("\n");

  downloadFile(header + rows, `conversation-${conversation.id}.csv`);
};

export const exportToExcel = (conversation: ConversationDetailResponse) => {
  const header = "Timestamp\tSender\tMessage\n";
  const rows = conversation.messages
    .map(
      msg =>
        `${new Date(msg.created_at).toLocaleString()}\t${msg.type}\t${msg.text}`
    )
    .join("\n");

  downloadFile(header + rows, `conversation-${conversation.id}.xls`);
};

export const exportToPDF = (conversation: ConversationDetailResponse) => {
  const content = conversation.messages
    .map(
      msg =>
        `${new Date(msg.created_at).toLocaleString()} - ${msg.type}:\n${msg.text}\n`
    )
    .join("\n");

  downloadFile(content, `conversation-${conversation.id}.txt`);
};
