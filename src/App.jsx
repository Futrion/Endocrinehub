import { lazy, Suspense } from 'react';
import { EndocrineHub } from './components/pages/EndocrineHub.jsx';
import { Login } from './components/pages/Login.jsx';
import { ProtectedRoute } from './components/basic/ProtectedRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/basic/Navbar.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/MUItheme.js';
import { CircularProgress } from '@mui/material';

const Calculadoras = lazy(() => import('./components/pages/Calculadoras.jsx').then(m => ({ default: m.Calculadoras })));
const Parenterales = lazy(() => import('./components/pages/Parenterales.jsx').then(m => ({ default: m.Parenterales })));
const Enterales = lazy(() => import('./components/pages/Enterales.jsx').then(m => ({ default: m.Enterales })));
const Suplementos = lazy(() => import('./components/pages/Suplementos.jsx').then(m => ({ default: m.Suplementos })));
const Genericas = lazy(() => import('./components/pages/Genericas.jsx').then(m => ({ default: m.Genericas })));


export default function App() {
    return (
    <ThemeProvider theme={theme}>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <AuthProvider>
                    <div className='flex flex-col h-screen'>
                        <Navbar />
                        <main className='bg-secondary grow'>
                            <div className='w-full flex items-start md:items-center justify-center p-2 sm:p-4 md:p-8 h-full overflow-auto'>
                                <Suspense fallback={
                                    <div className='flex items-center justify-center w-full h-full'>
                                        <CircularProgress />
                                    </div>
                                }>
                                    <Routes>
                                        <Route path='/login' element={<Login />} />
                                        <Route path='/' element={<ProtectedRoute><EndocrineHub /></ProtectedRoute>} />
                                        <Route path='/calculadoras' element={<ProtectedRoute><Calculadoras /></ProtectedRoute>} />
                                        <Route path='/genericas' element={<ProtectedRoute><Genericas /></ProtectedRoute>} />
                                        <Route path='/suplementos' element={<ProtectedRoute><Suplementos /></ProtectedRoute>} />
                                        <Route path='/enterales' element={<ProtectedRoute><Enterales /></ProtectedRoute>} />
                                        <Route path='/parenterales' element={<ProtectedRoute><Parenterales /></ProtectedRoute>} />
                                    </Routes>
                                </Suspense>
                            </div>
                        </main>
                    </div>
                </AuthProvider>
            </BrowserRouter>
     </ThemeProvider>
    );

}