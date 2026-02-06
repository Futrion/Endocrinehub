import { Calculadoras } from './components/pages/Calculadoras.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/basic/Navbar.jsx';


export default function App() {
    return (
        <main>
            <BrowserRouter>
                <Navbar />
                <main className='bg-main-bg'>
                    <div className='min-h-screen w-full flex items-center justify-center p-8'>
                        <Routes>
                            {/* <Route path='/' element={<EndocrineHub />} /> */}
                            <Route path='/calculadora-imc' element={<Calculadoras />} />
                        </Routes>
                    </div>
                </main>
            </BrowserRouter>
                    
        </main>
    );

}