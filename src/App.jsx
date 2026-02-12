import { Calculadoras } from './components/pages/Calculadoras.jsx';
import { EndocrineHub } from './components/pages/EndocrineHub.jsx';
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
        
    
            <BrowserRouter>
                <div className='flex flex-col h-screen'>
                    <Navbar />
                    <main className='bg-secondary grow overflow-y-auto'>
                        <div className='w-full flex items-center justify-center p-8 h-full'>
                            <Routes>
                                <Route path='/' element={<EndocrineHub />} />
                                <Route path='/calculadoras' element={<Calculadoras />} />
                                <Route path='/genericas' element={<Genericas />} />
                                <Route path='/suplementos' element={<Suplementos />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </BrowserRouter>
                    
        
     </ThemeProvider>   
    );

}