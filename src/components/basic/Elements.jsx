import { useFormContext } from 'react-hook-form';
import { AnimatePresence } from 'motion/react';
import { findInputError } from '../../utils/findInputError.js';
import { isFormInvalid } from '../../utils/isFormInvalid.js';
import { InputError } from './InputError.jsx';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, Checkbox, Autocomplete } from '@mui/material';

export function Input ({ label, type, id, placeholder, required = true, labelOnTop = true }) {
    const { register, formState: { errors } } = useFormContext();

    const inputError = findInputError(errors, id);
    const isInvalid = isFormInvalid(inputError);

    return(
    <div className='flex flex-col w-full gap-2'>
        <div className='flex justify-between'>
            {labelOnTop && 
            <label htmlFor={id} className='font-semibold capitalize'>
                {label}
            </label>
            }
            <AnimatePresence mode='wait' initial={false}>
                {isInvalid && (
                    <InputError
                        message={inputError.error.message} 
                    />
                )}
            </AnimatePresence>
        </div>
        <TextField
            required={required}
            error={isInvalid}
            size='small'
            type={type}
            id={id}
            label = {labelOnTop === false ? label : ''}
            placeholder={placeholder}
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
            <TextField
                select
                size='small'
                id={id}
                defaultValue={options[0]?.value || ''}
                {...register(id, {
                    required: false,
                })}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
}

export function MultiSelectInput({ controllerField, label, id, options, placeholder, required = true, labelOnTop = true }) {
    const { register } = useFormContext();

    // const inputError = findInputError(errors, id);
    // const isInvalid = isFormInvalid(inputError);

    return (
        <div className='flex flex-col w-full gap-2'>
            <div className='flex justify-between'>
                {labelOnTop && 
                <label htmlFor={id} className='font-semibold capitalize'>
                    {label}
                </label>
                }
            </div>
            <Autocomplete
                {...controllerField}
                multiple
                size='small'
                id={id}
                options={options}
                getOptionLabel={(option) => option.label}
                label = {labelOnTop === false ? label : ''}
                filterSelectedOptions
                onChange={(_, value) => controllerField.onChange(value)}
                value={controllerField.value || []}
                isOptionEqualToValue={(option, selected) => option.value === selected.value}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        placeholder={placeholder}
                    />
                )}
            />

            
        </div>
    );
}

export function CheckboxInput({ label, id, defaultChecked = false }) {
    const { register } = useFormContext();

    return (
        <FormControlLabel control={<Checkbox defaultChecked={defaultChecked} {...register(id, {required: false})} />} label={label} />
    );
}


export function CalculatorHeader({ title }) {
    return (
        <Typography variant="h2" component="h2" className="mb-4">
            {title}
        </Typography>
    );
}

export function SectionHeader({ title, className = '' }) {
    return (
        <Typography variant="h3" component="h3" className={`mb-4 ${className}`}>
            {title}
        </Typography>
    );
}

export function ResultDisplay({ children }) {
    return (
        <div className='mt-5 pt-4 border-t border-primary-border'>
            {children}
        </div>
    );
}
