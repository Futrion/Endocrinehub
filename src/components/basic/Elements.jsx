import { useFormContext } from 'react-hook-form';
import { AnimatePresence } from 'motion/react';
import { findInputError } from '../../utils/findInputError.js';
import { isFormInvalid } from '../../utils/isFormInvalid.js';
import { InputError } from './InputError.jsx';

export function Input ({ label, type, id, placeholder, required = true }) {
    const { register, formState: { errors } } = useFormContext();

    const inputError = findInputError(errors, id);
    const isInvalid = isFormInvalid(inputError);

    return(
    <div className='flex flex-col w-full gap-2'>
        <div className='flex justify-between'>
            <label htmlFor={id} className='font-semibold capitalize'>
                {label}
            </label>
            <AnimatePresence mode='wait' initial={false}>
                {isInvalid && (
                    <InputError
                        message={inputError.error.message} 
                    />
                )}
            </AnimatePresence>
        </div>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            className="w-full py-1 px-3 border border-primary-border bg-white rounded-md placeholder:opacity-60 focus-visible:border-primary focus-visible:outline-none"
            {...register(id, {
                required: required ? 'Este campo es obligatorio' : false,
            })} 
        />
        
    </div>
    );
}

export function DropdownInput({ label, id, options }) {
    const { register, formState: { errors } } = useFormContext();

    // const inputError = findInputError(errors, id);
    // const isInvalid = isFormInvalid(inputError);

    return (
        <div className='flex flex-col w-full gap-2'>
            <div className='flex justify-between'>
                <label htmlFor={id} className='font-semibold capitalize'>
                    {label}
                </label>
                {/* <AnimatePresence mode='wait' initial={false}>
                    {isInvalid && (
                        <InputError
                            message={inputError.error.message}  
                        />
                    )}
                </AnimatePresence> */}
            </div>
            <select
                id={id}
                defaultValue={options[0]?.value || ''}
                className="w-full py-1 px-3 border border-primary-border bg-white rounded-md placeholder:opacity-60 focus-visible:border-primary focus-visible:outline-none"
                {...register(id, {
                    required: false,
                })}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function CalculatorHeader({ title }) {
    return (
        <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
    );
}

export function SectionHeader({ title }) {
    return (
        <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
    );
}

export function PrimaryButton({ onClick, text }) {
    return (
        <button 
            onClick={onClick}
            className='flex items-center gap-1 py-1 px-4 font-bold text-white bg-primary-bg rounded-md hover:cursor-pointer hover:shadow-md transition-shadow'
        >
            {text}
        </button>
    );
}

export function ResultDisplay({ children }) {
    return (
        <div className='mt-5 pt-4 border-t border-primary-border'>
            {children}
        </div>
    );
}
