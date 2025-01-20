import { AxiosError } from "axios";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDateFullString = (timestamp: Date) => {
  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("es", {
    year: "numeric",
    day: "numeric",
    month: "numeric",
  }).format(date);

  return formattedDate.replace(",", "");
};

export const convertISOToReadable = (dateISO: string) => {
  const date = new Date(dateISO);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const readableDate = `${month}/${day}/${year} (${hours12}:${formattedMinutes} ${ampm})`;

  return readableDate;
};

export const convertISOToReadableMonthDayYear = (dateISO: string) => {
  const date = new Date(dateISO);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const readableDate = `${month}/${day}/${year}`;

  return readableDate;
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hours > 0 ? hours + ":" : "";
  const minutesStr =
    hours > 0 ? String(minutes).padStart(2, "0") + ":" : minutes + ":";
  const secondsStr = String(secs).padStart(2, "0");

  return hoursStr + minutesStr + secondsStr;
};

export const formatDateString = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "MMMM d yyyy, HH:mm'h'", { locale: es });
};

export const formatDateStringPrompt = (dateString: string) => {
  const date = parseISO(dateString);
  const text = format(date, "dd/MM/yy");

  return `Prompt ${text}`;
};

export const getInitials = (text: string) => {
  const words = text.split(" ");
  let initials = "";
  for (let i = 0; i < words.length && i < 2; i++) {
    initials += words[i].charAt(0).toUpperCase();
  }
  return initials;
};

export const calculateHoursPassed = (dateString: string) => {
  const pastDate = new Date(dateString);

  const currentDate = new Date();

  if (isNaN(pastDate.getTime())) {
    return "N/A";
  }

  const diffInMilliseconds = currentDate.getTime() - pastDate.getTime();

  const hoursPassed = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

  return `${hoursPassed}hs`;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const formatDateFullStringFile = (timestamp: Date) => {
  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat("es", {
    year: "numeric",
    day: "numeric",
    month: "numeric",
  }).format(date);

  return formattedDate.replace(",", "");
};

export function formatMessage(message: string): string {
  if (message.length > 16) {
    return message.substr(0, 16) + "...";
  }
  return message;
}

export function formatTimestampToHour(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

export function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${month}, ${year}`;
}

export const getErrorResponse = (error: unknown) => {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status || 500,
      data: error.response?.data || error.message,
    };
  }
  return {
    status: 500,
    data: error instanceof Error ? error.message : "Error desconocido",
  };
};

export const formatDateOrTime = (dateISO: string): string => {
  const date = new Date(dateISO);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
