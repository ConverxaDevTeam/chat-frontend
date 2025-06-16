import { ToastContainerProps } from "react-toastify";

const baseClasses =
  "relative flex w-[434px] font-medium rounded-[4px] shadow-lg mb-3 p-3";

export const toastConfig: ToastContainerProps = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeButton: false,
  className: "!max-w-[500px] !w-[434px] !mb-3",
  bodyClassName: "p-4",
  toastClassName: ({
    type,
  }: {
    type?: string;
    defaultClassName?: string;
    position?: string;
    rtl?: boolean;
  } = {}) => {
    const classes = `${baseClasses}`;
    switch (type) {
      case "success":
        return `${classes} !bg-[#EEFDE3] !text-[#1E4620]`;
      case "error":
        return `${classes} !bg-[#FDEDED] !text-[#1E4620]`;
      case "info":
        return `${classes} !bg-[#E5F6FD] !text-[#1E4620]`;
      default:
        return classes;
    }
  },
};
