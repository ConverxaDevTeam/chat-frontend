import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const alertConfirm = (message: string) => {
  toast.success(message, {
    position: "bottom-left",
    autoClose: 2000,
  });
};

export const alertError = (message: string) => {
  toast.error(message, {
    position: "bottom-left",
    autoClose: 2000,
  });
};

export const alertInfo = (message: string) => {
  toast.info(message, {
    position: "bottom-left",
    autoClose: 2000,
  });
};
