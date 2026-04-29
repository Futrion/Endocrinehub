import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Input, CalculatorHeader, SectionHeader, DropdownInput, ResultDisplay, ResultGridElement, CopyableSummary } from '../basic/Elements.jsx';
import { CalculatorGrid, CalculatorSection, CalculatorInnerDivider } from '../basic/Layout.jsx';
import { Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Typography, Tooltip } from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { calcularIMC, calcularGET, calcularNPT, calcularREQ } from '../../utils/calculatorLogic/genericas.js';

export function Genericas() {
    return (
        <CalculatorGrid cols={2} 
            children={
                <>
                <CalculadoraIMC />
                <CalculadoraGET />
                <CalculadoraNPT />
                <CalculadoraREQ />
                </>
            }>
        </CalculatorGrid>
    );
}


function CalculadoraIMC() {
    const methods = useForm();
    const [imc, setImc] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setImc(calcularIMC(data));
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
                        <Button variant="contained" color="primary" className="font-bold" onClick={onSubmit}>
                            Calcular IMC
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {imc && <ResultDisplay children={<ResultGridElement label="IMC" value={imc} />} />}
            </>
        }/>
        
    );
}

function CalculadoraGET() {
    const methods = useForm();
    const [get, setGet] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setGet(calcularGET(data));
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
                        <Button variant="contained" color="primary" className="font-bold" onClick={onSubmit}>
                            Calcular GET
                        </Button>
                    </div>
                    
                </form>
            </FormProvider>
            {get && <ResultDisplay children={<ResultGridElement label="GET (kcal/día)" value={get} />} />}
            </>
        }/>
    );
}

function CalculadoraNPT() {
    const methods = useForm();
    const [npt, setNpt] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setNpt(calcularNPT(data));
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
                        <Button variant="contained" color="primary" className="font-bold" onClick={onSubmit}>
                            Calcular NPT
                        </Button>
                    </div>
                    
                </form>
            </FormProvider>
            {npt && <ResultDisplay children={
                    <>
                        <SectionHeader title="Informe de Formulación NPT" />
                        <Table size="small" >
                            <TableBody>
                                <TableRow>
                                    <TableCell><strong>Peso</strong></TableCell>
                                    <TableCell align='right'>{npt.peso} kg</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Aminoácidos </strong></TableCell>
                                    <TableCell align='right'>{npt.aminoacidos} g ({npt.nitrogeno} g N2)</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Lípidos</strong></TableCell>
                                    <TableCell align='right'>{npt.lipidos} g</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Glucosa</strong></TableCell>
                                    <TableCell align='right'>{npt.glucosa} g</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Kcal totales</strong></TableCell>
                                    <TableCell align='right'>{npt.total} kcal</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                    } 
                />}
            </>
        }/>
    );
}

function buildResumenREQ(r) {
    const infusionLines = r.infusionRates.map(group => {
        const rates = group.rates.map(rt => `${rt.type} ${rt.rate} mg/kg/min → ${rt.amount} g`).join(' | ');
        return `  ${group.duration} h: ${rates}`;
    });
    return [
        `IMC: ${r.imc} kg/m². Pérdida de peso: ${r.perd}%.`,
        `Requerimientos energéticos: 25 kcal/kg → ${r.reqE.k25.toFixed(0)} kcal/día | 30 kcal/kg → ${r.reqE.k30.toFixed(0)} kcal/día.`,
        `Requerimientos proteicos: 1,2 g/kg → ${r.reqP.p12.toFixed(1)} g/día | 1,5 g/kg → ${r.reqP.p15.toFixed(1)} g/día.`,
        `Tasas máximas de infusión:`,
        infusionLines.join('\n'),
    ].join('\n\n');
}

function CalculadoraREQ() {
    const methods = useForm();
    const [req, setReq] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setReq(calcularREQ(data));
    });

    const resumen = useMemo(() => req ? buildResumenREQ(req) : '', [req]);

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
                        <Button variant="contained" color="primary" className="font-bold" onClick={onSubmit}>
                            Calcular Requerimientos
                        </Button>
                    </div>
                </form>
            </FormProvider>
            {req && <ResultDisplay children={
                    <>
                        <SectionHeader title="Resultados" />
                        <div className="grid gap-2 mt-2 ml-4">
                            <Typography className="text-m"><strong>IMC:</strong> {req.imc} kg/m²</Typography>
                            <Typography className="text-m"><strong>% pérdida peso:</strong> {req.perd}%</Typography>
                            <Typography variant="h4">Requerimientos energéticos:</Typography>
                            <ul className="ml-4">
                                <li className="text-m"><strong className='font-semibold'>25 kcal/kg:</strong> {req.reqE.k25.toFixed(0)} kcal</li>
                                <li className="text-m"><strong className='font-semibold'>30 kcal/kg:</strong> {req.reqE.k30.toFixed(0)} kcal</li>
                            </ul>
                            <Typography variant='h4'>Requerimientos proteicos:</Typography>
                            <ul className="ml-4">
                                <li className="text-m"><strong className='font-semibold'>1.2 g/kg:</strong> {req.reqP.p12.toFixed(1)} g</li>
                                <li className="text-m"><strong className='font-semibold'>1.5 g/kg:</strong> {req.reqP.p15.toFixed(1)} g</li>
                            </ul>
                            <Typography variant='h4'>Tasas máximas de infusión:</Typography>
                            <div>
                                {req.infusionRates.map((durationGroup, idx) => (
                                    <Accordion key={idx} className="mb-1 bg-secondary">
                                        <AccordionSummary expandIcon= {<ChevronDown />}>
                                            <Typography component="h3" className='font-bold'>{durationGroup.duration} horas</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Table size="small" padding='none'>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tipo</TableCell>
                                                        <TableCell align='right'>Ratio</TableCell>
                                                        <TableCell align='right'>Cantidad</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {durationGroup.rates.map((rate, rIdx) => (
                                                        <TableRow key={rIdx}>
                                                            <TableCell>{rate.type}</TableCell>
                                                            <TableCell align='right'>{rate.rate} mg/kg/min</TableCell>
                                                            <TableCell align='right'>{rate.amount} g</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </div>
                        </div>
                        <CopyableSummary text={resumen} />
                    </>
                    }
                />}
            </>
        }/>
    );
}