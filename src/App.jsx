import { Calculadoras } from './components/pages/Calculadoras.jsx';
import { EndocrineHub } from './components/pages/EndocrineHub.jsx';
import { Parenterales } from './components/pages/Parenterales.jsx';
import { Enterales } from './components/pages/Enterales.jsx';
import { Suplementos } from './components/pages/Suplementos.jsx';
import { Genericas } from './components/pages/Genericas.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/basic/Navbar.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/MUItheme.js';


export default function App() {
    return (
    <ThemeProvider theme={theme}>
        
    
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <div className='flex flex-col h-screen'>
                    <Navbar />
                    <main className='bg-secondary grow'>
                        <div className='w-full flex items-start md:items-center justify-center p-2 sm:p-4 md:p-8 h-full overflow-auto'>
                            <Routes>
                                <Route path='/' element={<EndocrineHub />} />
                                <Route path='/calculadoras' element={<Calculadoras />} />
                                <Route path='/genericas' element={<Genericas />} />
                                <Route path='/suplementos' element={<Suplementos />} />
                                <Route path='/enterales' element={<Enterales />} />
                                <Route path='/parenterales' element={<Parenterales />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
                    
        
     </ThemeProvider>   
    );

}