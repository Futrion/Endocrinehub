import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '../Input.jsx';

export function CalculadoraGET() {
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
                <div className="grid gap-5 md:grid-cols-1">
                    <Input label="Peso" type="number" id="weight" placeholder="Introduce tu peso" />
                    <Input label="Altura" type="number" id="height" placeholder="Introduce tu altura" />
                </div>
                <div className="mt-5">
                    <button 
                        onClick={onSubmit}
                        className='flex items-center gap-1 py-1 px-4 font-bold text-white bg-primary-bg rounded-md hover:bg-primary hover:cursor-pointer'
                    >
                            Calcular IMC
                    </button>
                </div>
                
            </form>
        </FormProvider>
    );
}
