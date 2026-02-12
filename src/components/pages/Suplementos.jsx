import { Box, Button, Divider } from "@mui/material";
import { CalculatorGrid, CalculatorSection, CalculatorInnerDivider } from "../basic/Layout";
import { CalculatorHeader, DropdownInput, CheckboxInput, SectionHeader, Input } from "../basic/Elements";
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowRight, Calculator } from "lucide-react";
import suplementos_data from '../../assets/data/suplementos_orales.json'


export function Suplementos() {
    const methods = useForm();

    const suplementos = suplementos_data 

    return (
        <CalculatorGrid cols={1} className="w-lvh" children={
            <CalculatorSection>
                <CalculatorHeader title="Recomendador de suplementos orales nutricionales"/>
                <FormProvider {...methods}>
                    <CalculatorInnerDivider>
                        <SectionHeader title="Perfil clínico" />
                        <Box className="flex gap-4 md:flex-row flex-col">
                            <DropdownInput label="Patología / Perfil:" id="patology" options={[
                                {value: 'general', label: 'General'},
                                {value: 'diabetes', label: 'Diabetes'},
                                {value: 'renal', label: 'Renal'},
                                {value: 'hepatopatia', label: 'Hepatopatía'},
                                {value: 'disfagia', label: 'Disfagia'},
                                {value: 'ventilacion', label: 'Ventilación mecánica'},
                                {value: 'bariatrica', label: 'Bariátrica (alta proteína)'},
                            ]}/>
                            <DropdownInput label="Fibra:" id="fiber" options={[
                                {value: 'cualquiera', label: 'Cualquiera'},
                                {value: 'sin_fibra', label: 'Sin fibra'},
                                {value: 'con_fibra', label: 'Con fibra (cualquiera)'},
                                {value: 'soluble', label: 'Fibra soluble'},
                                {value: 'insoluble', label: 'Fibra insoluble'},
                                {value: 'mixta', label: 'Fibra mixta'},
                                {value: 'alta', label: 'Alta en fibra (>5g/envase)'},
                            ]}/>
                        </Box>
                        <CheckboxInput label="Usar solo productos compatibles con el perfil" id="compatible" defaultChecked={true} />
                    </CalculatorInnerDivider>
                    <Box className="flex gap-4 md:flex-row flex-col">
                        <CalculatorInnerDivider>
                            <SectionHeader title="Objetivo por kg/día" />
                            <Box className="grid gap-4">
                                <Input label="Peso (kg):" type="number" id="weight" placeholder="Introduce un número"/>
                                <Input label="Kcal/kg:" type="number" id="kcal_per_kg" placeholder="Introduce un número"/>
                                <Input label="Proteína (g)/kg:" type="number" id="protein_per_kg" placeholder="Introduce un número"/>
                            </Box>
                            <Box className="flex justify-end">
                                <Button variant="contained" color="primary" className="mt-4" endIcon={<ArrowRight size={16} />}>Usar estos objetivos</Button>
                            </Box>
                        </CalculatorInnerDivider>
                        <CalculatorInnerDivider>
                            <SectionHeader title="Objetivo total diario" />
                            <Box className="grid gap-4">
                                <Input label="Kcal/día:" type="number" id="kcal_day" placeholder="Introduce un número"/>
                                <Input label="Proteína (g)/día:" type="number" id="protein_day" placeholder="Introduce un número"/>
                                <Input label="Máx. envases por producto:" type="number" id="max_containers_per_product" placeholder="Introduce un número"/>
                            </Box>
                            <Box className="flex justify-center">
                                <Button variant="contained" color="primary" className="mt-4" endIcon={<Calculator size={16} />}>Calcular recomendación</Button>
                            </Box>
                        </CalculatorInnerDivider>
                    </Box>
                    <Divider className="mt-4" variant="middle"/>
                    <CalculatorInnerDivider>
                        <SectionHeader title="Catálogo de productos" />
                    </CalculatorInnerDivider>
                </FormProvider>
            </CalculatorSection>
        }>

        </CalculatorGrid>
    );
}