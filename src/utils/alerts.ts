import { toast, ToastContent } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

interface ToastDisplayContent {
  message: string;
  description?: string;
}

const buildToastContent = ({
  message,
  description,
}: ToastDisplayContent): ToastContent => {
  if (description) {
    return React.createElement("div", {}, [
      React.createElement(
        "p",
        { className: "font-normal", key: "message" },
        message
      ),
      React.createElement(
        "p",
        { className: "text-[14px] mt-1 opacity-90", key: "description" },
        description
      ),
    ]);
  }
  return message;
};

export const alertConfirm = (message: string, description?: string) => {
  toast.success(buildToastContent({ message, description }), {
    position: "bottom-right",
    autoClose: 2000,
  });
};

export const alertError = (message: string, description?: string) => {
  toast.error(buildToastContent({ message, description }), {
    position: "bottom-right",
    autoClose: 3000,
  });
};

export const alertInfo = (message: string, description?: string) => {
  toast.info(buildToastContent({ message, description }), {
    position: "bottom-right",
    autoClose: 2500,
  });
};
