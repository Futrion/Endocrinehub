import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../basic/Elements';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname ?? '/';
    const successMessage = location.state?.message ?? '';

    const methods = useForm();
    const { handleSubmit } = methods;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit({ email, password }) {
        setError('');
        setLoading(true);
        const { error } = await signIn(email, password);
        if (error) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
            setLoading(false);
        } else {
            navigate(from, { replace: true });
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="bg-tertiary rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-primary mb-1">EndocrineHub</h1>
                <p className="text-sm text-muted mb-6">Inicia sesión para continuar</p>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2, py: 0 }}>{successMessage}</Alert>
                )}

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
                        <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            rules={{
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                            }}
                        />

                        {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 1 }}
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Entrar'}
                        </Button>
                    </form>
                </FormProvider>

                <div className="flex flex-col items-center gap-2 mt-4 text-sm text-muted">
                    <Link to="/forgot-password" className="text-primary hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <span>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-primary font-semibold hover:underline">
                            Crea una
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
