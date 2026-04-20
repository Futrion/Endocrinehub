import { useFormContext, Controller } from 'react-hook-form';
import { AnimatePresence } from 'motion/react';
import { findInputError } from '../../utils/findInputError.js';
import { isFormInvalid } from '../../utils/isFormInvalid.js';
import { InputError } from './InputError.jsx';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { FormControlLabel, Checkbox, Autocomplete, Stack, Tooltip, Button, Box } from '@mui/material';
import { Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CalculatorInnerDivider } from './Layout.jsx';

export function Input ({ label, type, id, placeholder, defaultValue, required = true, labelOnTop = true }) {
    const { register, formState: { errors } } = useFormContext();

    const inputError = findInputError(errors, id);
    const isInvalid = isFormInvalid(inputError);

    return(
    <div className='flex flex-col w-full gap-2'>
        <div className='flex justify-between'>
            {labelOnTop && 
            <label htmlFor={id} className='font-semibold'>
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
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...register(id, {
                required: required ? 'Este campo es obligatorio' : false,
            })} 
        />
        
    </div>
    );
}

export function DropdownInput({ label, id, options }) {
    const { control } = useFormContext();
    const defaultVal = options[0]?.value ?? '';

    return (
        <div className='flex flex-col w-full gap-2'>
            <div className='flex justify-between'>
                <label htmlFor={id} className='font-semibold'>
                    {label}
                </label>
            </div>
            <Controller
                name={id}
                control={control}
                defaultValue={defaultVal}
                render={({ field }) => (
                    <TextField
                        select
                        size='small'
                        id={id}
                        {...field}
                        value={field.value ?? defaultVal}
                    >
                        {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
        </div>
    );
}

export function MultiSelectInput({ controlMethod, label, id, options, placeholder, required = true, labelOnTop = true }) {

    // const inputError = findInputError(errors, id);
    // const isInvalid = isFormInvalid(inputError);

    return (
      <Controller
        name={id}
        control={controlMethod}
        rules={{
          required: required ? 'Seleccione al menos una etiqueta' : false,
          validate: (value) => value.length > 0 || "Seleccione al menos una etiqueta",
        }}
        render={({ field }) => (
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between">
              {labelOnTop && (
                <label htmlFor={id} className="font-semibold capitalize">
                  {label}
                </label>
              )}
            </div>
            <Autocomplete
              {...field}
              multiple
              size="small"
              id={id}
              options={options}
              getOptionLabel={(option) => option.label}
              label={labelOnTop === false ? label : ""}
              filterSelectedOptions
              onChange={(_, value) => field.onChange(value)}
              value={field.value || []}
              isOptionEqualToValue={(option, selected) =>
                option.value === selected.value
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                />
              )}
            />
          </div>
        )}
      />
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

export function ResultGridElement( { label, subtitle = '', value, valueClassName = '' } ) {
    return (
        <Stack direction="column" spacing={0.2}>
            <Typography variant='body1' className='font-semibold'>{label}</Typography>
            <Typography variant='body1' className={`font-bold font-mono ${valueClassName}`}>{value}</Typography>
            <Typography variant='subtitle2' className='text-gray-500'><i>{subtitle}</i></Typography>
        </Stack>
    );
}

export function SimilitudCell({ value, similitud }) {
    if (!similitud) {
        return (
            <Typography component="span" className="font-mono">
                {value}
            </Typography>
        );
    }
    const colorClass = similitud.inRange ? 'text-success' : 'text-warning';
    const label = similitud.direction
        ? `${similitud.deviationPct.toFixed(0)}% ${similitud.direction}`
        : 'en objetivo';
    return (
        <Typography component="span">
            <Box component="span" className="font-mono">{value} · </Box>
            <Box component="span" className={`${colorClass} text-base`}>{label}</Box>
        </Typography>
    );
}

export function CopyableSummary({ title = 'Resumen para historia clínica', text }) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        }).catch(() => {});
    };

    return (
        <CalculatorInnerDivider className="mt-4">
            <SectionHeader title={title} />
            <Typography variant="body2" className="whitespace-pre-line font-mono text-sm bg-gray-50 rounded p-3 border">
                {text}
            </Typography>
            <Box className="flex justify-end mt-2">
                <span aria-live="polite" className="sr-only">
                    {copied ? 'Copiado al portapapeles' : ''}
                </span>
                <Tooltip title={copied ? '¡Copiado!' : 'Copiar al portapapeles'} placement="top">
                    <Button
                        variant="outlined"
                        color={copied ? 'success' : 'secondary'}
                        size="small"
                        onClick={handleCopy}
                        startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                        className="motion-reduce:transition-none"
                    >
                        {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                </Tooltip>
            </Box>
        </CalculatorInnerDivider>
    );
}