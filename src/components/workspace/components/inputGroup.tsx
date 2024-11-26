
interface InputGroupProps {
  label: string;
  placeholder: string;
  labelColor?: string;
  errors?: {
    message: string;
  };
}
  export const InputGroup = ({ label, placeholder, errors, labelColor='text-gray-600'}: InputGroupProps) => (
    <div >
      <label className={`block text-sm font-medium ${labelColor} text-left mb-1`}>
        {label}
      </label>
      <textarea
        className="w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm"
        placeholder={placeholder}
        rows={4}
      ></textarea>
      {errors && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
    </div>

  );