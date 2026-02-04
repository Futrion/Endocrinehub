import { CalculadoraGET } from './components/pages/Calculadoras.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';


export default function App() {
    return (
        <main>
            <BrowserRouter>
                <Navbar />
                <div className='min-h-screen w-full flex items-center justify-center'>
                    <Routes>
                        {/* <Route path='/' element={<EndocrineHub />} /> */}
                        <Route path='/calculadora-imc' element={<CalculadoraGET />} />
                    </Routes>

                </div>
            </BrowserRouter>
                    
        </main>
    );

}