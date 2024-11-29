import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaProps {
  placeholder?: string;
  register: UseFormRegisterReturn;
  label?: string;
  error?: string;
  className?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  register,
  error,
  className = '',
  rows = 4,
}) => {
  return (
      <textarea
        className={`w-full rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${className}`}
        placeholder={placeholder}
        rows={rows}
        {...register}
      />
  );
};