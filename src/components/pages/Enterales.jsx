import { Box, Button, Divider, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Tooltip, Fab, Grid } from "@mui/material";
import { CalculatorGrid, CalculatorSection, CalculatorInnerDivider } from "../basic/Layout";
import { CalculatorHeader, DropdownInput, CheckboxInput, SectionHeader, Input, MultiSelectInput } from "../basic/Elements";
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowRight, ArrowDown, Calculator } from "lucide-react";
import enterales_data from '../../assets/data/formulas_enterales.json'
import { recomendarEnterales } from "../../utils/calculatorLogic/enterales.js";
import { useState, useCallback } from "react";
import { z } from 'zod';
import { importToJSON, exportToJSON } from "../../utils/fileOperations.js";
import { DeleteActionsCellItem, CatalogGridActions, CatalogDataGrid } from "../basic/DataGridElements.jsx";
import { useIsMobile } from "../../utils/useIsMobile.js";

const JSONSchemaObject = z.object({
    "name": z.string(),
    "format": z.string(),
    "volume": z.number(),
    "kcal": z.number(),
    "protein_g": z.number(),
    "fiber_g": z.number(),
    "fiber_type": z.string(),
    "tags": z.array(z.string())
});

const JSONSchemaArray = z.array(JSONSchemaObject);


const columns_proposal_fn = (isMobile) => [
    {
        field: 'name',
        headerName: 'Nombre',
        type: 'string',
        editable: false,
        width: isMobile ? 150 : 250
    },
    {
        field: 'units',
        headerName: 'Unidades',
        type: 'number',
        editable: false,
    },
    {
        field: 'kcal_total',
        headerName: 'Kcal',
        type: 'number',
        editable: false,
    },
    {
        field: 'protein_g_total',
        headerName: 'Proteína (g)',
        type: 'number',
        editable: false,
    },
    {
        field: 'volume_ml_total',
        headerName: 'Volumen (ml)',
        type: 'number',
        editable: false,
    },
    
]

const available_tags= [
    {value: 'general', label: 'General'},
    {value: 'diabetes', label: 'Diabetes'},
    {value: 'renal', label: 'Renal'},
    {value: 'hepatopatia', label: 'Hepatopatía'},
    // {value: 'disfagia', label: 'Disfagia'},
    {value: 'ventilacion', label: 'Ventilación mecánica'},
    // {value: 'bariatrica', label: 'Bariátrica (alta proteína)'},
    {value: 'oligomerica', label: 'Oligomérica/peptídica'},
]

const available_fiber_types= [
    {value: 'cualquiera', label: 'Cualquiera'},
    {value: 'sin_fibra', label: 'Sin fibra'},
    {value: 'con_fibra', label: 'Con fibra (cualquiera)'},
    {value: 'soluble', label: 'Fibra soluble'},
    {value: 'insoluble', label: 'Fibra insoluble'},
    {value: 'mixta', label: 'Fibra mixta'},
    {value: 'alta', label: 'Alta en fibra (>5g/envase)'},
]


function AddFormulaDialog(props){
    const { openAddDialog, setOpenAddDialog, formulas, setFormulas } = props;
    const methods = useForm();

    const onSubmit = methods.handleSubmit(data => {
        const formattedTags = data.tags.map(t => t.value);
        const id = formulas.length + 1;
        const newProduct = {id: id, ...data, tags: formattedTags};
        setFormulas(prevSuplementos => [...prevSuplementos, newProduct]);
        setOpenAddDialog(false);
    });

    return (
        <Dialog
            open={openAddDialog !== false}
            onClose={() => setOpenAddDialog(false)}
        >
            <DialogTitle id="add-product-title">Añadir fórmula</DialogTitle>
            <DialogContent className="w-full">
                <FormProvider {...methods}>
                    <form
                    onSubmit={e => e.preventDefault()}
                    noValidate
                    >
                        <Grid columns={2}>
                            <Input label="Nombre" type="text" id="name" placeholder="Introduce el nombre" labelOnTop={false}/>
                            <Input label="Formato" type="text" id="format" placeholder="Introduce el formato" labelOnTop={false}/>
                            <Input label="Volumen" type="number" id="volume" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Kcal" type="number" id="kcal" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Proteína (g)" type="number" id="protein" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Fibra (g)" type="number" id="fiber" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Tipo de fibra" type="text" id="fiber_type" placeholder="Introduce un número" labelOnTop={false}/>
                            <MultiSelectInput controlMethod={methods.control} label="Etiquetas" id="tags" options={available_tags} placeholder="Selecciona las categorías" labelOnTop={false}/>
                        </Grid>                       
                    </form>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
                <Button variant="contained" onClick={onSubmit}>Añadir</Button>
            </DialogActions>
        </Dialog>
    );
}



export function Enterales() {
    const isMobile = useIsMobile();
    const columns_proposal = columns_proposal_fn(isMobile);
    const methods = useForm();

    const [formulas, setFormulas] = useState(enterales_data);           // Stores the state of suplementos that will be used as reference for recommendation
    const [actionRowId, setActionRowId] = useState(null);               // Stores the id of the row that is being edited
    const [openAddDialog, setOpenAddDialog] = useState(false);          // Stores the state of the add product dialog

    const [proposal, setProposal] = useState(null);                     // Stores the recommended suplementos

    const onSubmit = methods.handleSubmit(data => {
        setProposal(recomendarEnterales(data, formulas));
    });

    const deleteActiveRow = useCallback((rowId) => {
        // Set the suplementos array to all the elements with id !== rowId
        setFormulas((prevFormulas) => prevFormulas.filter(s => s.id !== rowId));
    }, []);

    const handleCloseDialog = useCallback(() => {
        setActionRowId(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        deleteActiveRow(actionRowId);
        handleCloseDialog();
    }, [actionRowId, deleteActiveRow, handleCloseDialog]);


    const useTargets = () => {
        const peso = methods.watch('weight');
        const kcal_kg = methods.watch('kcal_per_kg');
        const prot_kg = methods.watch('protein_per_kg');

        if (!peso) {
            return;
        }

        if (kcal_kg){
            const newKcal = kcal_kg * peso;
            methods.setValue('kcal_day', newKcal, { shouldValidate: true });
        }
        
        if (prot_kg){
            const newProt = prot_kg * peso;
            methods.setValue('protein_day', newProt, { shouldValidate: true });
        }
    }

    const reloadCatalogue = () => {
        setFormulas(enterales_data);
    }

    const exportCatalogue = () => {
        exportToJSON(formulas, 'formulas_enterales.json');
    }

    async function importCatalogue(event) {
        console.log(event.target.files);
        const uploadedFile = event.target.files[0];
        try {
            const newCatalogue = await importToJSON(JSONSchemaArray, uploadedFile);
            console.log(newCatalogue);
    
            if (newCatalogue !== false){
                setFormulas(newCatalogue);
            }
        } catch (error) {
            alert(error);
        }

    }

    const columns_catalog = [
        {
            field: 'name',
            headerName: 'Nombre',
            type: 'string',
            editable: false,
            width: isMobile ? 150 : 250
        },
        {
            field: 'format',
            headerName: 'Formato',
            type: 'string',
            editable: false,
        },
        {
            field: 'volume',
            headerName: 'Volumen',
            type: 'number',
            editable: false,
        },
        {
            field: 'kcal',
            headerName: 'Kcal',
            type: 'number',
            editable: false,
        },
        {
            field: 'protein_g',
            headerName: 'Proteína (g)',
            type: 'number',
            editable: false,
        },
        {
            field: 'fiber_g',
            headerName: 'Fibra (g)',
            type: 'number',
            editable: false,
        },
        {
            field: 'fiber_type',
            headerName: 'Tipo de fibra',
            type: 'string',
            editable: false,
        },
        {
            field: 'tags',
            headerName: 'Etiquetas',
            editable: false,
            renderCell: (params) => (
                <div>
                    {params.row.tags.map(t => <Chip key={t} label={t} size="small" className="mr-0.5 bg-tertiary border-secondary border"/>)}
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: 'Acción',
            type: 'actions',
            getActions: (params) => [
                <DeleteActionsCellItem
                    key="delete"
                    id={params.id}
                    onDelete={setActionRowId}
                />
            ]
        },
    ]

    return (
        <CalculatorGrid cols={1} className="w-full" children={
            <CalculatorSection>
                <CalculatorHeader title="Recomendador de suplementos orales nutricionales"/>
                <FormProvider {...methods}>
                    <form
                    onSubmit={e => e.preventDefault()}
                    noValidate
                    >

                        <CalculatorInnerDivider>
                            <SectionHeader title="Perfil clínico" />
                            <Box className="flex gap-4 md:flex-row flex-col">
                                <DropdownInput label="Patología / Perfil:" id="patology" options={available_tags}/>
                                <DropdownInput label="Fibra:" id="fiber" options={available_fiber_types}/>
                            </Box>
                            <CheckboxInput label="Usar solo productos compatibles con el perfil" id="compatible_only" defaultChecked={true} />
                        </CalculatorInnerDivider>
                        
                        
                        
                        <Box className="flex gap-4 md:flex-row flex-col">
                            <CalculatorInnerDivider>
                                <SectionHeader title="Objetivo por kg/día" />
                                <Box className="grid gap-4">
                                    <Input required={false} label="Peso (kg):" type="number" id="weight" placeholder="Introduce un número"/>
                                    <Input required={false} label="Kcal/kg:" type="number" id="kcal_per_kg" placeholder="Introduce un número"/>
                                    <Input required={false} label="Proteína (g)/kg:" type="number" id="protein_per_kg" placeholder="Introduce un número"/>
                                </Box>
                                <Box className="flex justify-center md:justify-end">
                                    <Button variant="contained" color="primary" onClick={useTargets} className="mt-4" endIcon={<><ArrowRight size={16} className="hidden md:block"/> <ArrowDown size={16} className="md:hidden"/></>}>Usar estos objetivos</Button>
                                </Box>
                            </CalculatorInnerDivider>
                            <CalculatorInnerDivider>
                                <SectionHeader title="Objetivo total diario" />
                                <Box className="grid gap-4">
                                    <Input label="Kcal/día:" type="number" id="kcal_day" placeholder="Introduce un número"/>
                                    <Input label="Proteína (g)/día:" type="number" id="protein_day" placeholder="Introduce un número"/>
                                    <Input label="Máx. envases por producto:" type="number" id="max_containers_per_product" placeholder="Introduce un número"/>
                                    <Input label="Horas de perfusión:" type="number" id="perfusion_hours" placeholder="Introduce un número"/>
                                </Box>
                                <Box className="flex justify-center">
                                    <Button variant="contained" color="primary" onClick={onSubmit} className="mt-4" endIcon={<Calculator size={16} />}>Calcular recomendación</Button>
                                </Box>
                            </CalculatorInnerDivider>
                        </Box>
                        
                        
                        
                        {proposal &&
                            <CalculatorInnerDivider className="border-info bg-blue-100 border-2 shadow-xl">
                                <SectionHeader title="Propuesta" />
                                <CatalogDataGrid rows={proposal} columns={columns_proposal} hideFooter/>
                            </CalculatorInnerDivider>
                        }
                        <Divider className="mt-4" variant="middle"/>
                        
                        
                        
                        <CalculatorInnerDivider>
                            <Stack direction="row" justifyContent="space-between" className="items-center">
                                <SectionHeader title="Catálogo de fórmulas" />
                                <CatalogGridActions setOpenAddDialog={setOpenAddDialog} importCatalogue={importCatalogue} exportCatalogue={exportCatalogue} reloadCatalogue={reloadCatalogue}/>
                            </Stack>
                            <CatalogDataGrid rows={formulas} columns={columns_catalog}/>
                            <AddFormulaDialog openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} suplementos={formulas} setSuplementos={setFormulas}/>
                            <Dialog
                                open={actionRowId !== null}
                                onClose={() => setActionRowId(null)}
                            >
                                <DialogTitle id="alert-dialog-title">¿Eliminar esta fórmula?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Está acción no se puede deshacer
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>CANCELAR</Button>
                                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                                        ELIMINAR
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </CalculatorInnerDivider>
                    
                    </form>
                </FormProvider>
            </CalculatorSection>
        }>

        </CalculatorGrid>
    );
}