import { useState, useMemo } from 'react';
import { CalculatorGrid, CalculatorInnerDivider } from "../basic/Layout";
import { CalculatorSection } from "../basic/Layout";
import { CalculatorHeader, DropdownInput, Input, SectionHeader, ResultGridElement } from "../basic/Elements";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { ChevronDown, ChartNoAxesColumn, Calculator, RotateCcw } from "lucide-react";
import { calcularResultadosParenterales, compararFormulas } from "../../utils/calculatorLogic/parenterales.js";
import { useIsMobile } from "../../utils/useIsMobile.js";
import { CatalogDataGrid } from '../basic/DataGridElements.jsx';
import { CopyableSummary } from '../basic/Elements.jsx';
import formulaciones_data from '../../assets/data/formulaciones_parenterales.json';


//  {
//     "Nombre": "PeriOLIMEL N4 E 2000",
//     "Volumen (mL)": 2000.0,
//     "Via de parenteral": "Periferica",
//     "Nitrógeno (g/bolsa)": 8.0,
//     "Glucosa (g/bolsa)": 150.0,
//     "Lípidos (g/bolsa)": 60.0,
//     "Total Kcal/bolsa": 1400.0,
//     "Kcal np/bolsa": 1200.0,
//     "Kcal np/gr N": 150.0,
//     "Sodio (mmol/bolsa)": 42.0,
//     "Potasio (mmol/bolsa)": 32.0,
//     "Magnesio (mmol/bolsa)": 4.4,
//     "Calcio (mmol/bolsa)": 4.0,
//     "Cloro (mmol/bolsa)": 49.0,
//     "Fosfato orgánico* (mmol/bolsa)": 17.0,
//     "Acetato (mmol/bolsa)": 55.0,
//     "pH": 6.4,
//     "Osmolaridad (mOsm/L)": 760.0
//   },

function renderPCTcell(value, pct){
    return (
        <Typography component="span">
            <Box component="span" className='font-mono'>
                {value} g ·{" "}
            </Box>
            <Box
                component="span"
                className='text-success text-base'
            >
                {pct}%
            </Box>
        </Typography>
    );
}

const comparison_columns_fn = (isMobile) => [
    {
        field: 'nombre',
        headerName: 'Producto',
        type: 'string',
        editable: false,
        width: isMobile ? 150 : 250
    },
    {
        field: 'sp',
        headerName: 'Prot (g/bolsa) · sim%',
        type: 'number',
        editable: false,
        renderCell: (params) => {
            const prot_bag = params.row.prot_bag.toFixed(2);
            const sp = params.row.sp.toFixed(0);

            return (
               renderPCTcell(prot_bag, sp)
            );
        }
    },
    {
        field: 'sc',
        headerName: 'HdC (g/bolsa) · sim%',
        type: 'number',
        editable: false,
        renderCell: (params) => {
            const cho_bag = params.row.cho_bag.toFixed(2);
            const sc = params.row.sc.toFixed(0);

            return (
                renderPCTcell(cho_bag, sc)
            );
        }
    },
    {
        field: 'sf',
        headerName: 'Líp (g/bolsa) · sim%',
        type: 'number',
        editable: false,
        renderCell: (params) => {
            const lip_bag = params.row.lip_bag.toFixed(2);
            const sf = params.row.sf.toFixed(0);

            return (
                renderPCTcell(lip_bag, sf)
            );
        }
    },
    {
        field: 'media',
        headerName: 'Media sim%',
        type: 'number',
        editable: false,
        renderCell: (params) => {
            const media = params.row.media.toFixed(0);
            return (
                <Typography className='text-base font-semibold'>
                    {media}%
                </Typography>
            );
        }
    },
    {
        field: 'covered',
        headerName: 'Cubre objetivo',
        type: 'boolean',
        editable: false,
        renderCell: (params) => {
            return (
                <Typography className='text-base font-semibold'>
                    Sí
                </Typography>
            );
        }
    },
    
]

function imcEstado(imc) {
    if (!isFinite(imc)) return '';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normopeso';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
}

function fmt(v, d = 2) {
    return (v != null && isFinite(v)) ? Number(v).toFixed(d) : '-';
}

function buildResumenParenterales(snapshot, r) {
    const lines = [];

    lines.push(
        `Entradas: Peso ${fmt(snapshot.weight, 1)} kg · Talla ${fmt(snapshot.height, 0)} cm · ` +
        `${fmt(snapshot.kcal_kg_desired, 1)} kcal/kg · ${fmt(snapshot.prot_kg_desired, 2)} g prot/kg`
    );

    if (r.imc != null) {
        lines.push(`IMC: ${fmt(r.imc)} kg/m² (${imcEstado(r.imc)})`);
    }

    lines.push(
        `\nMacros totales:\n` +
        `  Proteínas: ${fmt(r.prot_g_total)} g · Nitrógeno: ${fmt(r.nitrogen_g_total)} g\n` +
        `  Kcal totales: ${fmt(r.kcal_total)} · Kcal proteicas: ${fmt(r.kcal_prot)} · Kcal no proteicas: ${fmt(r.kcal_np)}\n` +
        `  Kcal NP/g N: ${fmt(r.kcal_npc)}`
    );

    lines.push(
        `\nReparto calórico (rango óptimo):\n` +
        `  AA: ${fmt(r.pct_aa)}% (>4%) · CHO: ${fmt(r.pct_cho)}% (8–35%) · Líp: ${fmt(r.pct_fat)}% (1,5–5%)`
    );

    if (isFinite(r.gir_mgkgmin)) {
        lines.push(
            `\nTasas de infusión:\n` +
            `  GIR glucosa: ${fmt(r.gir_mgkgmin)} mg/kg/min\n` +
            `  Lípidos: ${fmt(r.fat_gkg_h)} g/kg/h · ${fmt(r.fat_gkg_day_equiv)} g/kg/día`
        );
    }

    return lines.join('\n');
}

export function Parenterales() {
    const isMobile = useIsMobile();
    const comparison_columns = comparison_columns_fn(isMobile);
    const methods = useForm({ defaultValues: { np_preset: '50_50' } });

    const [results, setResults] = useState(null);
    const [formSnapshot, setFormSnapshot] = useState(null);
    const [resetOpen, setResetOpen] = useState(false);

    const [comparison, setComparison] = useState(null);
    const [cmpInfo, setCmpInfo] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setFormSnapshot(data);
        setResults(calcularResultadosParenterales(data));
    });

    const handleReset = () => {
        const umbralVal = methods.getValues('umbral_sim');
        methods.reset();
        methods.setValue('umbral_sim', umbralVal);
        setResults(null);
        setFormSnapshot(null);
        setComparison(null);
        setCmpInfo(null);
        setResetOpen(false);
    };

    const resumen = useMemo(
        () => (results && formSnapshot) ? buildResumenParenterales(formSnapshot, results) : '',
        [results, formSnapshot]
    );

    const handleCompare = () => {
        const data = methods.getValues();
        const { info, recs } = compararFormulas(data, formulaciones_data);
        
        setCmpInfo(info);
        setComparison(recs);
    };

    return (
        <CalculatorGrid cols={1} className="w-full" children={
            <CalculatorSection>
                <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <Typography variant="h2" component="h2">Calculadora de Fórmulas Nutricionales</Typography>
                    <Button variant='outlined' color="error" onClick={() => setResetOpen(true)} startIcon={<RotateCcw size={16} />} className="self-end sm:self-auto shrink-0">Reiniciar Campos</Button>
                </Box>
                <FormProvider {...methods}>
                    <form
                    onSubmit={e => e.preventDefault()}
                    noValidate
                    >
                        <CalculatorInnerDivider>
                             <SectionHeader title="Entradas" />
                             <Box className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <Input label="Peso (kg)" type="number" id="weight" placeholder="Introduce un número"/>
                                <Input label="Talla (cm)" type="number" id="height" placeholder="Introduce un número"/>
                                <Input label="Kcal/Kg deseadas" type="number" id="kcal_kg_desired" placeholder="Introduce un número"/>
                                <Input label="Proteínas (g/kg) deseadas" type="number" id="prot_kg_desired" placeholder="Introduce un número"/>
                            </Box>
                        </CalculatorInnerDivider>


                        <CalculatorInnerDivider>
                             <SectionHeader title="Ajustes avanzados" />
                             <Box className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                <Input label="Reparto NP a CHO (%)" type="number" id="carb_npc_pct" placeholder="Introduce un número"/>
                                <DropdownInput label="Preset NP" type="number" id="np_preset" options={[
                                    {value: "50_50", label: "50/50"},
                                    {value: "60_40", label: "60/40"},
                                    {value: "70_30", label: "70/30"},
                                
                                ]}/>
                                <Input label="GIR máx (mg/kg/min)" type="number" id="gir_max" placeholder="Introduce un número"/>
                                <Input label="Lípidos máx (g/kg/día)" type="number" id="lip_max_day" placeholder="Introduce un número"/>
                                <Input label="kcal/g AA" type="number" id="kcal_aa" placeholder="Introduce un número"/>
                                <Input label="kcal/g CHO" type="number" id="kcal_cho" placeholder="Introduce un número"/>
                                <Input label="kcal/g Lípidos" type="number" id="kcal_lipids" placeholder="Introduce un número"/>
                            </Box>
                            <Accordion defaultExpanded className="mt-4 bg-secondary">
                                <AccordionSummary expandIcon= {<ChevronDown />}>
                                    <Typography component="h3" className='font-bold'>Opcional: volumen y horas de infusión</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                        <Input label="Volumen total (ml)" type="number" id="volume_total_ml" placeholder="Introduce un número" required={false}/>
                                        <Input label="Horas de infusión" type="number" id="infusion_hours" placeholder="Introduce un número" required={false}/>
                                        <Typography variant="subtitle"><i>No afecta al comparador, solo a información contextual.</i></Typography>
                                        <Typography variant="subtitle"><i>Si se deja en blanco, no se calculan tasas de infusión.</i></Typography>
                                    </Box>
                                
                                </AccordionDetails>
                            </Accordion>
                            <Box className="flex justify-center">
                                <Button variant="contained" type="submit" size="large" onClick={onSubmit} endIcon={<Calculator />}>Calcular Resultados</Button>
                            </Box>
                            <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
                                <DialogTitle>¿Borrar todos los datos?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Se eliminarán los campos de entrada y los resultados. El comparador de formulaciones no se verá afectado. Esta acción no se puede deshacer.</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setResetOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleReset} color="error" variant="contained">Borrar</Button>
                                </DialogActions>
                            </Dialog>
                        </CalculatorInnerDivider>

                        {results &&
                        <CalculatorInnerDivider className="border-info bg-blue-100 border-2 shadow-xl">
                            <SectionHeader title="Resultados" />
                            <Box className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-4">
                                <ResultGridElement label="IMC" value={results.imc ? results.imc.toFixed(2) : null} subtitle={isFinite(results.imc) ? results.imc < 18.5 ? "Bajo peso" : results.imc < 25 ? "Normopeso" : results.imc < 30 ? "Sobrepeso" : "Obesidad" : null} />
                                <ResultGridElement label="Proteínas totales (g)" value={results.prot_g_total ? results.prot_g_total.toFixed(2) : null} />
                                <ResultGridElement label="Nitrógeno (g)" value={results.nitrogen_g_total ? results.nitrogen_g_total.toFixed(2) : null} />
                                <ResultGridElement label="Kcal totales" value={results.kcal_total ? results.kcal_total.toFixed(2) : null} />
                                <ResultGridElement label="Kcal proteicas" value={results.kcal_prot ? results.kcal_prot.toFixed(2) : null} />
                                <ResultGridElement label="Kcal no proteicas" value={results.kcal_np ? results.kcal_np.toFixed(2) : null} />
                                <ResultGridElement label="Kcal NP / g N" value={results.kcal_npc ? results.kcal_npc.toFixed(2) : null} />
                            </Box>
                            <Divider className='mb-4'/>
                            <Box className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
                                <ResultGridElement label="% Aminoácidos (kcal)" value={`${results.pct_aa ? results.pct_aa.toFixed(2) : null}%`} subtitle='Rango óptimo: > 4%' valueClassName={results.pct_aa_class}/>
                                <ResultGridElement label="% Hidratos de carbono (kcal)" value={`${results.pct_cho ? results.pct_cho.toFixed(2) : null}%`} subtitle='Rango óptimo: 8–35%' valueClassName={results.pct_cho_class}/>
                                <ResultGridElement label="% Lípidos (kcal)" value={`${results.pct_fat ? results.pct_fat.toFixed(2) : null}%`} subtitle='Rango óptimo: 1.5–5%' valueClassName={results.pct_fat_class}/>
                            </Box>
                            <Divider className='mb-4'/>
                            <Box className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <ResultGridElement label="Tasa de infusión de glucosa" value={results.gir_mgkgmin ? results.gir_mgkgmin.toFixed(2) : '-'} subtitle='mg/kg/min (máx configurable)' valueClassName={results.gir_mgkgmin_class}/>
                                <ResultGridElement label="Tasa de infusión de lípidos" value={results.fat_gkg_h && results.fat_gkg_day_equiv ? `${results.fat_gkg_h.toFixed(2)} · ${results.fat_gkg_day_equiv.toFixed(2)}` : '-'} subtitle='g/kg/h y g/kg/día' valueClassName={results.fat_gkg_day_equiv_class}/>
                            </Box>

                        </CalculatorInnerDivider>
                        }
                        {resumen && <CopyableSummary text={resumen} />}

                        
                        <CalculatorInnerDivider>
                            <SectionHeader title="Comparador de formulaciones" />
                            <Stack direction="row" spacing={2} className="w-full md:w-1/2 items-end">
                                <Input label="Porcentaje de similitud (%)" type="number" id="umbral_sim" defaultValue="85" ></Input>
                                <Button onClick={handleCompare} variant='outlined' color='secondary' size='large' className='w-2xs' endIcon={<ChartNoAxesColumn />} >Comparar</Button>
                            </Stack>
                        </CalculatorInnerDivider>


                        {comparison &&
                        <CalculatorInnerDivider className="border-info bg-blue-100 border-2 shadow-xl">
                            {cmpInfo && <Box className="text-center mb-4"><Typography variant="body1" className='text-primary underline'>{cmpInfo}</Typography></Box>}
                            <CatalogDataGrid rows={comparison} columns={comparison_columns} />
                        </CalculatorInnerDivider>
                        }

                    </form>
                </FormProvider>
            </CalculatorSection>
        }></CalculatorGrid>
    );
}