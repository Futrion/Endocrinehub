import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider, useWatch, useFormContext } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../basic/Elements';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// Scores the password on 5 criteria; returns a strength level (0–3)
function getPasswordStrength(password) {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: 'Muy débil', colorClass: 'text-error',   segments: 1, hex: '#c62828' };
    if (score === 2) return { label: 'Débil',    colorClass: 'text-warning',  segments: 2, hex: '#d78f00' };
    if (score === 3) return { label: 'Aceptable',colorClass: 'text-info',     segments: 3, hex: '#0077b6' };
    return              { label: 'Fuerte',       colorClass: 'text-success',  segments: 4, hex: '#66bb6a' };
}

// Isolated component so only the bar re-renders on each keystroke, not the whole form
function PasswordStrengthBar() {
    const { control } = useFormContext();
    const password = useWatch({ name: 'password', control });
    const strength = getPasswordStrength(password);

    if (!strength) return null;

    return (
        <div role="status" aria-live="polite" className="-mt-2">
            <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors duration-200"
                        style={{ backgroundColor: i < strength.segments ? strength.hex : '#e5e7eb' }}
                    />
                ))}
            </div>
            <p className={`text-xs ${strength.colorClass}`}>{strength.label}</p>
        </div>
    );
}

// Real-time match feedback — complements the RHF validate rule that blocks submission
function PasswordMatchBadge() {
    const { control } = useFormContext();
    const [password, passwordConfirm] = useWatch({ name: ['password', 'passwordConfirm'], control });

    if (!passwordConfirm) return null;

    const isMatch = password === passwordConfirm;
    return (
        <p
            role="status"
            aria-live="polite"
            className={`-mt-2 text-xs flex items-center gap-1 ${isMatch ? 'text-success' : 'text-error'}`}
        >
            {isMatch
                ? <Check size={12} aria-hidden="true" />
                : <X size={12} aria-hidden="true" />}
            {isMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
        </p>
    );
}

export function Register() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const methods = useForm();
    const { handleSubmit, getValues } = methods;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit({ nombre, apellidos, email, password }) {
        setError('');
        setLoading(true);
        const { error } = await signUp(email, password, nombre, apellidos);
        if (error) {
            setError('No se ha podido completar el registro. Inténtalo de nuevo.');
            setLoading(false);
        } else {
            navigate('/', { replace: true });
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="bg-tertiary rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-primary mb-1">EndocrineHub</h1>
                <p className="text-sm text-muted mb-6">Crea tu cuenta para continuar</p>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <Input id="nombre" label="Nombre" placeholder="Tu nombre" />
                        <Input id="apellidos" label="Apellidos" placeholder="Tus apellidos" />
                        <Input
                            id="email"
                            label="Correo electrónico"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            rules={{
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Introduce un email válido',
                                },
                            }}
                        />
                        <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            rules={{
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                            }}
                        />
                        <PasswordStrengthBar />
                        <Input
                            id="passwordConfirm"
                            label="Confirmar contraseña"
                            type="password"
                            rules={{
                                validate: (v) =>
                                    v === getValues('password') || 'Las contraseñas no coinciden',
                            }}
                        />
                        <PasswordMatchBadge />

                        {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 1 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear cuenta'}
                        </Button>
                    </form>
                </FormProvider>

                <p className="text-sm text-muted text-center mt-4">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
