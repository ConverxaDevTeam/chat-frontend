import { IconCancel } from "@utils/svgs";

interface ModalActionProps {
  close: () => void;
  handleAction: () => void;
  title: string;
  description: string;
  textCancel: string;
  textOk: string;
}

const ModalAction = ({
  close,
  handleAction,
  title,
  description,
  textCancel,
  textOk,
}: ModalActionProps) => {
  return (
    <div className="bg-white w-[calc(100%-20px)] sm:w-[464px] px-[28px] py-[36px] rounded-[20px] relative">
      <IconCancel
        onClick={() => close()}
        className="cursor-pointer text-[30px] text-black absolute top-[26px] right-[30px]"
      />
      <p className="text-sofiaCall-black font-poppinsMedium text-[20px]">
        {title}
      </p>
      <div className="flex flex-col pt-[24px] mt-[24px] border-t-[1px] border-t-sofiaCall-gray">
        <p className="text-[14px] font-poppinsRegular text-[#0C0C0C] text-opacity-70">
          {description}
        </p>
        <div className="flex gap-4 mt-[32px]">
          <button
            type="button"
            onClick={() => close()}
            className="w-[150px] hover:bg-sofiaCall-dark h-[45px] rounded-full border-[1px] border-[#BBBBBB] text-[#BBBBBB] hover:border-sofiaCall-dark hover:text-sofiaCall-electricGreen"
          >
            <p className="font-poppinsSemiBold leading-[27px] text-[18px]">
              {textCancel}
            </p>
          </button>
          <button
            type="button"
            onClick={() => handleAction()}
            className="w-[150px] bg-sofiaCall-dark h-[45px] rounded-full border-[1px] border-sofiaCall-dark"
          >
            <p className="font-poppinsSemiBold text-sofiaCall-electricGreen leading-[27px] text-[18px]">
              {textOk}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAction;
