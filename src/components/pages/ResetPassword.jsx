import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Input } from '../basic/Elements';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function isRecoverySession(session) {
    return session?.user?.amr?.some((entry) => entry.method === 'recovery') ?? false;
}

export function ResetPassword() {
    const { updatePassword } = useAuth();
    const navigate = useNavigate();
    const methods = useForm();
    const { handleSubmit, getValues } = methods;
    const [ready, setReady] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true);
            } else if (event === 'INITIAL_SESSION' && isRecoverySession(session)) {
                // PKCE exchange completed before this listener registered
                setReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function onSubmit({ password }) {
        setError('');
        setLoading(true);
        const { error } = await updatePassword(password);
        if (error) {
            const msg = error.message?.toLowerCase() ?? '';
            if (msg.includes('same') || msg.includes('different')) {
                setError('La nueva contraseña debe ser diferente a la anterior.');
            } else {
                setError('No se ha podido actualizar la contraseña. Inténtalo de nuevo.');
            }
            setLoading(false);
        } else {
            navigate('/login', {
                state: { message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' },
                replace: true,
            });
        }
    }

    if (!ready) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="bg-tertiary rounded-lg shadow-md p-8 w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-primary mb-1">EndocrineHub</h1>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        El enlace de recuperación no es válido o ha expirado.
                    </Alert>
                    <p className="text-sm text-muted text-center">
                        <Link to="/forgot-password" className="text-primary font-semibold hover:underline">
                            Solicitar un nuevo enlace
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="bg-tertiary rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-2xl font-bold text-primary mb-1">EndocrineHub</h1>
                <p className="text-sm text-muted mb-6">Introduce tu nueva contraseña</p>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                        <Input
                            id="password"
                            label="Nueva contraseña"
                            type="password"
                            rules={{
                                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                            }}
                        />
                        <Input
                            id="passwordConfirm"
                            label="Confirmar contraseña"
                            type="password"
                            rules={{
                                validate: (v) =>
                                    v === getValues('password') || 'Las contraseñas no coinciden',
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
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Guardar contraseña'}
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
