import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname ?? '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Correo electrónico"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        fullWidth
                        size="small"
                        autoComplete="current-password"
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
            </div>
        </div>
    );
}
