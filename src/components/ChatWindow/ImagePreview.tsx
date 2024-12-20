import { IoClose } from "react-icons/io5";

interface ImagePreviewProps {
  images: { url: string }[];
  onRemove: (index: number) => void;
}

export const ImagePreview = ({ images, onRemove }: ImagePreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="absolute bottom-full mb-2 left-0">
      <div className="flex gap-2 overflow-x-auto max-w-[300px] p-1">
        {images.map((img, index) => (
          <div key={index} className="relative flex-shrink-0">
            <img
              src={img.url}
              alt={`Preview ${index + 1}`}
              className="w-[100px] h-[100px] object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <IoClose className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
