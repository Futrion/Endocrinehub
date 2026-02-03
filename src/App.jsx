import { useForm, FormProvider } from 'react-hook-form';
import { Input } from './components/Input.jsx';

function Form() {
    const methods = useForm();

    const onSubmit = methods.handleSubmit(data => {
        const heightInMeters = parseFloat(data.height) / 100;
        const calculatedImc = parseFloat(data.weight) / (heightInMeters * heightInMeters);
        console.log('IMC:', calculatedImc.toFixed(2));
    });

    return (
        <FormProvider {...methods}>
            <form
            onSubmit={e => e.preventDefault()}
            noValidate
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Input label="Peso" type="number" id="weight" placeholder="Introduce tu peso" />
                    <Input label="Altura" type="number" id="height" placeholder="Introduce tu altura" />
                </div>
                <div className="mt-5">
                    <button 
                        onClick={onSubmit}
                        className='flex items-center gap-1 p-5 font-semibold text-white bg-primary rounded-md hover:bg-secondary'
                    >
                            Calcular IMC
                    </button>
                </div>
                
            </form>
        </FormProvider>
    );
}


export default function App() {
    return (
        <div>
            <h1>Formulario de Validación</h1>
            <Form />
        </div>
    );

}