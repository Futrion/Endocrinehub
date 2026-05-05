import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../basic/Elements';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export function ForgotPassword() {
    const { resetPassword } = useAuth();
    const methods = useForm();
    const { handleSubmit } = methods;
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit({ email }) {
        setLoading(true);
        await resetPassword(email);
        setLoading(false);
        setSent(true);
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="bg-tertiary rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-primary mb-1">EndocrineHub</h1>
                <p className="text-sm text-muted mb-6">Recupera el acceso a tu cuenta</p>

                {sent ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Si el email está registrado, recibirás un enlace para restablecer tu contraseña en breve.
                    </Alert>
                ) : (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 1 }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Enviar enlace'}
                            </Button>
                        </form>
                    </FormProvider>
                )}

                <p className="text-sm text-muted text-center mt-4">
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
