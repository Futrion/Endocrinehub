import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input, CalculatorHeader, SectionHeader, PrimaryButton, DropdownInput } from '../basic/Elements.jsx';
import { CalculatorSection } from '../basic/Layout.jsx';
import { ResultDisplay } from '../basic/Elements.jsx';

export function CalculadoraIMC() {
    const methods = useForm();
    const [imc, setImc] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        const heightInMeters = parseFloat(data.height) / 100;
        const calculatedImc = parseFloat(data.weight) / (heightInMeters * heightInMeters);
        const imc = calculatedImc.toFixed(2);
        setImc(imc);
        
    });

    return (
        <CalculatorSection children={
            <>
            <CalculatorHeader title="Calculadora de IMC" />
            <FormProvider {...methods}>
                <form
                onSubmit={e => e.preventDefault()}
                noValidate
                >
                    <div className="grid gap-5 md:grid-cols-1">
                        <Input label="Peso (kg):" type="number" id="weight" placeholder="Introduce un número" />
                        <Input label="Altura (cm):" type="number" id="height" placeholder="Introduce un número" />
                    </div>
                    <div className="mt-5">
                        <PrimaryButton onClick={onSubmit} text="Calcular IMC" />
                    </div>
                    
                </form>
            </FormProvider>
            {imc && <ResultDisplay children={<p className="text-lg font-bold">IMC: {imc}</p>} />}
            </>
        }/>
        
    );
}

export function CalculadoraGET() {
    const methods = useForm();
    const [get, setGet] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        const result = data.gender === 'hombre' ? 
            10*data.weight + 6.25*data.height - 5*data.age + 5
            :
            10*data.weight + 6.25*data.height - 5*data.age - 161;
        setGet(result.toFixed(0));
    });

    return (
        <CalculatorSection children={
            <>
            <CalculatorHeader title="Gasto Energético Total" />
            <FormProvider {...methods}>
                <form
                onSubmit={e => e.preventDefault()}
                noValidate
                >
                    <div className="grid gap-5 md:grid-cols-1">
                        <Input label="Peso (kg):" type="number" id="weight" placeholder="Introduce un número" />
                        <Input label="Altura (cm):" type="number" id="height" placeholder="Introduce un número" />
                        <Input label="Edad (años):" type="number" id="age" placeholder="Introduce un número" />
                        <DropdownInput label="Género:" id="gender" options={[
                            { value: "hombre", label: "Hombre" },
                            { value: "mujer", label: "Mujer" }
                        ]} />
                    </div>
                    <div className="mt-5">
                        <PrimaryButton onClick={onSubmit} text="Calcular GET" />
                    </div>
                    
                </form>
            </FormProvider>
            {get && <ResultDisplay children={<p className="text-lg font-bold">GET (kcal/día): {get}</p>} />}
            </>
        }/>
    );
}

export function CalculadoraNPT() {
    const methods = useForm();
    const [npt, setNpt] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        const peso = parseFloat(data.weight);
        const kcalkg = parseFloat(data.calories);
        const prokg = parseFloat(data.proteins);

        const kcalTot = peso * kcalkg, gAA = peso * prokg, gN2 = gAA / 6.25;
        const kcalAA = gAA * 4, kcalNoProt = Math.max(0, kcalTot - kcalAA);
        const kcalLip = kcalNoProt * 0.4, kcalGlu = kcalNoProt * 0.6;
        const gramosLipidos = Math.round(kcalLip / 10);
        const gramosGlucosa = Math.round(kcalGlu / 4);
        
        setNpt({
            peso: peso,
            aminoacidos: gAA.toFixed(0),
            nitrogeno: gN2.toFixed(0),
            lipidos: gramosLipidos,
            glucosa: gramosGlucosa,
            total: kcalTot.toFixed(0)
        });
    });

    return (
        <CalculatorSection children={
            <>
            <CalculatorHeader title="Calculadora de Nutrición Parenteral" />
            <FormProvider {...methods}>
                <form
                onSubmit={e => e.preventDefault()}
                noValidate
                >
                    <div className="grid gap-5 md:grid-cols-1">
                        <Input label="Peso (kg):" type="number" id="weight" placeholder="Introduce un número" />
                        <Input label="Calorías por kg (kcal/kg):" type="number" id="calories" placeholder="Introduce un número" />
                        <Input label="Proteinas por kg (kcal/kg):" type="number" id="proteins" placeholder="Introduce un número" />
                    </div>
                    <div className="mt-5">
                        <PrimaryButton onClick={onSubmit} text="Calcular NPT" />
                    </div>
                    
                </form>
            </FormProvider>
            {npt && <ResultDisplay children={
                    <>
                        <SectionHeader title="Informe de Formulación NPT" />
                        <div className="grid gap-2 mt-2 ml-4">
                            <p className="text-m"><strong>Peso:</strong> {npt.peso} kg</p>
                            <p className="text-m"><strong>Aminoácidos:</strong> {npt.aminoacidos} g ({npt.nitrogeno} g N2)</p>
                            <p className="text-m"><strong>Lípidos:</strong> {npt.lipidos} g</p>
                            <p className="text-m"><strong>Glucosa:</strong> {npt.glucosa} g</p>
                            <p className="text-m"><strong>Kcal totales:</strong> {npt.total} kcal</p>
                        </div>
                    </>
                    } 
                />}
            </>
        }/>
    );
}

export function CalculadoraREQ() {
    const methods = useForm();
    const [req, setReq] = useState(null);

    const calcularPesoIdeal = (tCM, gen) => {
        return (gen === 'hombre')
            ? 50 + 2.3 * ((tCM / 2.54) - 60)
            : 45.5 + 2.3 * ((tCM / 2.54) - 60);
    };

    const onSubmit = methods.handleSubmit(data => {
        let durs = [12, 16, 20], tasas = [5, 6], tasaL = 0.11;
        const imcCorte = 30;
        const gen = data.gender;
        const ed = +data.age;
        const serv = data.service;
        const ph = +data.normalWeight;
        const pa = +data.currentWeight;
        const tM = +data.height / 100;
        const tCM = +data.height;

        if (!pa) {
            alert('Peso actual inválido');
            return;
        }

        let imc = pa / (tM * tM);
        let perd = ((ph - pa) / ph) * 100;
        let pi = calcularPesoIdeal(tCM, gen);
        let paj = pi + 0.25 * (pa - pi);
        let pcalc = (imc >= imcCorte) ? paj : pa;

        const reqE = { k25: 25 * pcalc, k30: 30 * pcalc };
        const reqP = { p12: 1.2 * pcalc, p15: 1.5 * pcalc };

        let infusionRates = [];
        durs.forEach(d => {
            tasas.forEach(t => {
                infusionRates.push({
                    type: 'glucosa',
                    rate: t,
                    duration: d,
                    amount: (t * 60 * pa * d / 1000).toFixed(2)
                });
            });
            infusionRates.push({
                type: 'lipidos',
                rate: tasaL,
                duration: d,
                amount: (tasaL * pa * d).toFixed(2)
            });
        });

        setReq({
            imc: imc.toFixed(2),
            perd: perd.toFixed(2),
            reqE,
            reqP,
            infusionRates
        });
    });

    return (
        <CalculatorSection children={
            <>
            <CalculatorHeader title="Calculadora de Requerimientos Nutricionales" />
            <FormProvider {...methods}>
                <form
                onSubmit={e => e.preventDefault()}
                noValidate
                >
                    <div className="grid gap-5 md:grid-cols-1">
                        <DropdownInput label="Género:" id="gender" options={[
                            { value: "hombre", label: "Hombre" },
                            { value: "mujer", label: "Mujer" }
                        ]} />
                        <Input label="Edad:" type="number" id="age" placeholder="Introduce un número" />
                        <Input label="Peso habitual (kg):" type="number" id="normalWeight" placeholder="Introduce un número" />
                        <Input label="Peso actual (kg):" type="number" id="currentWeight" placeholder="Introduce un número" />
                        <Input label="Altura (cm):" type="number" id="height" placeholder="Introduce un número" />
                        <Input label="Servicio:" type="text" id="service" placeholder="ej: UCI" required={false} />
                    </div>
                    <div className="mt-5">
                        <PrimaryButton onClick={onSubmit} text="Calcular Requerimientos" />
                    </div>
                    
                </form>
            </FormProvider>
            {req && <ResultDisplay children={
                    <>
                        <SectionHeader title="Resultados" />
                        <div className="grid gap-2 mt-2 ml-4">
                            <p className="text-m"><strong>IMC:</strong> {req.imc} kg/m²</p>
                            <p className="text-m"><strong>% pérdida peso:</strong> {req.perd}%</p>
                            <p className="text-m"><strong>Requerimientos energéticos:</strong></p>
                            <ul className="ml-4">
                                <li className="text-m">25 kcal/kg: {req.reqE.k25.toFixed(0)} kcal</li>
                                <li className="text-m">30 kcal/kg: {req.reqE.k30.toFixed(0)} kcal</li>
                            </ul>
                            <p className="text-m"><strong>Requerimientos proteicos:</strong></p>
                            <ul className="ml-4">
                                <li className="text-m">1.2 g/kg: {req.reqP.p12.toFixed(1)} g</li>
                                <li className="text-m">1.5 g/kg: {req.reqP.p15.toFixed(1)} g</li>
                            </ul>
                            <p className="text-m mt-4"><strong>Tasas máximas de infusión:</strong></p>
                            <div>
                                {req.infusionRates.map((rate, idx) => (
                                    <div key={idx}>
                                        <p className="text-m ml-4">
                                            {rate.type === 'glucosa'
                                                ? `Glucosa ${rate.rate} mg/kg/min, ${rate.duration}h: ${rate.amount} g`
                                                : `Lípidos ${rate.rate} g/kg/h, ${rate.duration}h: ${rate.amount} g`
                                            }
                                        </p>
                                        {(idx + 1) % 3 === 0 && <hr className="my-2" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                    } 
                />}
            </>
        }/>
    );
}