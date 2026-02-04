import { useFormContext } from 'react-hook-form';
import { AnimatePresence } from 'motion/react';
import { findInputError } from '../utils/findInputError.js';
import { isFormInvalid } from '../utils/isFormInvalid.js';
import { InputError } from './InputError.jsx';

export function Input ({ label, type, id, placeholder }) {
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
            className="w-full py-1 px-3 font-medium border rounded-md border-slate-300 placeholder:opacity-60"
            {...register(id, {
                required: 'Este campo es obligatorio',
            })} 
        />
        
    </div>
    );
}