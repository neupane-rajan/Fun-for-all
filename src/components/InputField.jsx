import React from 'react';
import clsx from 'clsx';

const InputField = ({ label, value, onChange, placeholder, type = 'text', className, min }) => {
  return (
    <div className={clsx("flex flex-col gap-1 w-full", className)}>
      {label && <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-gray-800 dark:text-gray-100 backdrop-blur-sm"
      />
    </div>
  );
};

export default InputField;
