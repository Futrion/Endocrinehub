import { Calculadoras } from './components/pages/Calculadoras.jsx';
import { EndocrineHub } from './components/pages/EndocrineHub.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/basic/Navbar.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/MUItheme.js';


export default function App() {
    return (
    <ThemeProvider theme={theme}>
        
        <main>
            <BrowserRouter>
                <Navbar />
                <main className='bg-secondary'>
                    <div className='min-h-screen w-full flex items-center justify-center p-8'>
                        <Routes>
                            <Route path='/' element={<EndocrineHub />} />
                            <Route path='/calculadoras' element={<Calculadoras />} />
                        </Routes>
                    </div>
                </main>
            </BrowserRouter>
                    
        </main>
     </ThemeProvider>   
    );

}