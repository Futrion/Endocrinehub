import { Calculadoras } from './components/pages/Calculadoras.jsx';
import { EndocrineHub } from './components/pages/EndocrineHub.jsx';
import { Parenterales } from './components/pages/Parenterales.jsx';
import { Enterales } from './components/pages/Enterales.jsx';
import { Suplementos } from './components/pages/Suplementos.jsx';
import { Genericas } from './components/pages/Genericas.jsx';
import { Login } from './components/pages/Login.jsx';
import { ProtectedRoute } from './components/basic/ProtectedRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/basic/Navbar.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/MUItheme.js';


export default function App() {
    return (
    <ThemeProvider theme={theme}>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <AuthProvider>
                    <div className='flex flex-col h-screen'>
                        <Navbar />
                        <main className='bg-secondary grow'>
                            <div className='w-full flex items-start md:items-center justify-center p-2 sm:p-4 md:p-8 h-full overflow-auto'>
                                <Routes>
                                    <Route path='/login' element={<Login />} />
                                    <Route path='/' element={<ProtectedRoute><EndocrineHub /></ProtectedRoute>} />
                                    <Route path='/calculadoras' element={<ProtectedRoute><Calculadoras /></ProtectedRoute>} />
                                    <Route path='/genericas' element={<ProtectedRoute><Genericas /></ProtectedRoute>} />
                                    <Route path='/suplementos' element={<ProtectedRoute><Suplementos /></ProtectedRoute>} />
                                    <Route path='/enterales' element={<ProtectedRoute><Enterales /></ProtectedRoute>} />
                                    <Route path='/parenterales' element={<ProtectedRoute><Parenterales /></ProtectedRoute>} />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </AuthProvider>
            </BrowserRouter>
     </ThemeProvider>
    );

}