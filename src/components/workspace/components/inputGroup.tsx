
interface InputGroupProps {
  label: string;
  placeholder: string;
  labelColor?: string;
  errors?: {
    message: string;
  };
}
  export const InputGroup = ({ label, placeholder, errors, labelColor='text-gray-600'}: InputGroupProps) => (
    <div>
      <label className={`block text-sm font-medium ${labelColor}`}>{label}</label>
      <div className="flex items-center mt-1 bg-gray-100 px-3 py-2 rounded-md">
        <textarea
          className="ml-1 block w-full max-w-full overflow-ellipsis rounded-md focus:outline-none px-2 py-1 sm:text-sm bg-gray-100"
          placeholder={placeholder}
          rows={4} // Cambia la cantidad de filas
        ></textarea>
      </div>
      {errors && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
    </div>

  );