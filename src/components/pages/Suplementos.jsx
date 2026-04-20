import { Box, Button, Divider, Chip, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Grid } from "@mui/material";
import { CalculatorGrid, CalculatorSection, CalculatorInnerDivider } from "../basic/Layout";
import { DropdownInput, CheckboxInput, SectionHeader, Input, MultiSelectInput, SimilitudCell } from "../basic/Elements";
import { useForm, FormProvider } from 'react-hook-form';
import { ArrowRight, ArrowDown, Calculator, Trash2, Plus, Download, FileUp, RotateCcw } from "lucide-react";
import suplementos_data from '../../assets/data/suplementos_orales.json'
import { recomendarSuplementos } from "../../utils/calculatorLogic/suplementos.js";
import { useState, useCallback, useMemo } from "react";
import { z } from 'zod';
import { importToJSON, exportToJSON } from "../../utils/fileOperations.js";
import { DeleteActionsCellItem, CatalogGridActions, CatalogDataGrid } from "../basic/DataGridElements.jsx";
import { CopyableSummary } from "../basic/Elements.jsx";
import { useIsMobile } from "../../utils/useIsMobile.js";

const JSONSchemaObject = z.object({
    "name": z.string(),
    "format": z.string(),
    "volume": z.number(),
    "kcal": z.number(),
    "protein_g": z.number(),
    "carbs_g": z.number(),
    "lipids_g": z.number(),
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
        width: isMobile ? 100 : 250
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
        renderCell: (params) => (
            <SimilitudCell
                value={Math.round(params.row.kcal_total)}
                similitud={params.row.sim_kcal}
            />
        ),
    },
    {
        field: 'protein_g_total',
        headerName: 'Proteína (g)',
        type: 'number',
        editable: false,
        renderCell: (params) => (
            <SimilitudCell
                value={params.row.protein_g_total.toFixed(1)}
                similitud={params.row.sim_protein}
            />
        ),
    },
    {
        field: 'carbs_g_total',
        headerName: 'HC (g)',
        type: 'number',
        editable: false,
    },
    {
        field: 'lipids_g_total',
        headerName: 'Lípidos (g)',
        type: 'number',
        editable: false,
    },
    {
        field: 'media',
        headerName: 'Media sim%',
        type: 'number',
        editable: false,
        renderCell: (params) => params.row.media != null ? (
            <Typography className='text-base font-semibold'>
                {params.row.media.toFixed(0)}%
            </Typography>
        ) : null,
    },
]

const available_tags= [
    {value: 'general', label: 'General'},
    {value: 'diabetes', label: 'Diabetes'},
    {value: 'renal', label: 'Renal'},
    {value: 'hepatopatia', label: 'Hepatopatía'},
    {value: 'disfagia', label: 'Disfagia'},
    {value: 'ventilacion', label: 'Ventilación mecánica'},
    {value: 'bariatrica', label: 'Bariátrica (alta proteína)'},
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

function AddProductDialog(props){
    const { openAddDialog, setOpenAddDialog, suplementos, setSuplementos } = props;
    const methods = useForm();

    const onSubmit = methods.handleSubmit(data => {
        const formattedTags = data.tags.map(t => t.value);
        const id = suplementos.length + 1;
        const newProduct = {id: id, ...data, tags: formattedTags};
        setSuplementos(prevSuplementos => [...prevSuplementos, newProduct]);
        setOpenAddDialog(false);
    });

    return (
        <Dialog
            open={openAddDialog !== false}
            onClose={() => setOpenAddDialog(false)}
        >
            <DialogTitle id="add-product-title">Añadir producto</DialogTitle>
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
                            <Input label="Carbohidratos (g)" type="number" id="carbs" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Lípidos (g)" type="number" id="lipids" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Fibra (g)" type="number" id="fiber" placeholder="Introduce un número" labelOnTop={false}/>
                            <Input label="Tipo de fibra" type="text" id="fiber_type" placeholder="Introduce un número" labelOnTop={false}/>
                            <MultiSelectInput controlMethod={methods.control} label="Tags" id="tags" options={available_tags} placeholder="Selecciona las categorías" labelOnTop={false}/>    
                            
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


function buildResumenSuplementos(snapshot, proposal) {
    const patologyLabel = available_tags.find(t => t.value === snapshot.patology)?.label ?? snapshot.patology;
    const fiberLabel = available_fiber_types.find(t => t.value === snapshot.fiber)?.label ?? snapshot.fiber;

    const lines = [
        `Perfil clínico: ${patologyLabel} · Fibra: ${fiberLabel}`,
    ];

    const objetivos = [];
    if (snapshot.kcal_day) objetivos.push(`${snapshot.kcal_day} kcal/día`);
    if (snapshot.protein_day) objetivos.push(`${snapshot.protein_day} g prot/día`);
    if (snapshot.max_containers_per_product) objetivos.push(`máx. ${snapshot.max_containers_per_product} env/producto`);
    if (objetivos.length) lines.push(`Objetivos: ${objetivos.join(' · ')}`);

    const top3 = proposal.slice(0, 3);
    if (top3.length) {
        lines.push(`\nRecomendación (${proposal.length} producto${proposal.length !== 1 ? 's' : ''}${proposal.length > 3 ? ', mostrando los 3 primeros' : ''}):`);
        top3.forEach(p => {
            lines.push(`  - ${p.name}: ${p.units} env · ${p.kcal_total} kcal · ${p.protein_g_total} g prot · ${p.carbs_g_total} g HC · ${p.lipids_g_total} g líp`);
        });
    }

    return lines.join('\n');
}

export function Suplementos() {
    const isMobile = useIsMobile();
    const columns_proposal = columns_proposal_fn(isMobile);
    const methods = useForm({ defaultValues: { patology: 'general', fiber: 'cualquiera', compatible_only: true } });

    const [suplementos, setSuplementos] = useState(suplementos_data);   // Stores the state of suplementos that will be used as reference for recommendation
    const [actionRowId, setActionRowId] = useState(null);               // Stores the id of the row that is being edited
    const [openAddDialog, setOpenAddDialog] = useState(false);          // Stores the state of the add product dialog
    const [resetOpen, setResetOpen] = useState(false);

    const [proposal, setProposal] = useState(null);                     // Stores the recommended suplementos
    const [formSnapshot, setFormSnapshot] = useState(null);

    const onSubmit = methods.handleSubmit(data => {
        setFormSnapshot(data);
        setProposal(recomendarSuplementos(data, suplementos));
    });

    const handleReset = () => {
        methods.reset();
        setProposal(null);
        setFormSnapshot(null);
        setResetOpen(false);
    };

    const resumen = useMemo(
        () => (proposal && formSnapshot) ? buildResumenSuplementos(formSnapshot, proposal) : '',
        [proposal, formSnapshot]
    );

    const deleteActiveRow = useCallback((rowId) => {
        // Set the suplementos array to all the elements with id !== rowId
        setSuplementos((prevSuplementos) => prevSuplementos.filter(s => s.id !== rowId));
    }, []);

    const handleCloseDialog = useCallback(() => {
        setActionRowId(null);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        deleteActiveRow(actionRowId);
        handleCloseDialog();
    }, [actionRowId, deleteActiveRow, handleCloseDialog]);


    const handleUseTargets = () => {
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
        setSuplementos(suplementos_data);
    }

    const exportCatalogue = () => {
        exportToJSON(suplementos, 'suplementos_orales.json');
    }

    async function importCatalogue(event) {
        const uploadedFile = event.target.files[0];
        try {
            const newCatalogue = await importToJSON(JSONSchemaArray, uploadedFile);
            if (newCatalogue !== false){
                setSuplementos(newCatalogue);
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
            field: 'carbs_g',
            headerName: 'Carbohidratos (g)',
            type: 'number',
            editable: false,
        },
        {
            field: 'lipids_g',
            headerName: 'Lípidos (g)',
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
            headerName: 'Tags',
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
                <Box className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <Typography variant="h2" component="h2">Recomendador de suplementos orales nutricionales</Typography>
                    <Button variant="outlined" color="error" onClick={() => setResetOpen(true)} startIcon={<RotateCcw size={16} />} className="self-end sm:self-auto shrink-0">Reiniciar Campos</Button>
                </Box>
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
                                    <Button variant="contained" color="primary" onClick={handleUseTargets} className="mt-4" endIcon={<><ArrowRight size={16} className="hidden md:block"/> <ArrowDown size={16} className="md:hidden"/></>}>Usar estos objetivos</Button>
                                </Box>
                            </CalculatorInnerDivider>
                            <CalculatorInnerDivider>
                                <SectionHeader title="Objetivo total diario" />
                                <Box className="grid gap-4">
                                    <Input label="Kcal/día:" type="number" id="kcal_day" placeholder="Introduce un número" required={false}/>
                                    <Input label="Proteína (g)/día:" type="number" id="protein_day" placeholder="Introduce un número" required={false}/>
                                    <Input label="Máx. envases por producto:" type="number" id="max_containers_per_product" placeholder="Introduce un número"/>
                                </Box>
                                <Box className="flex justify-center">
                                    <Button variant="contained" color="primary" onClick={onSubmit} className="mt-4" endIcon={<Calculator size={16} />}>Calcular recomendación</Button>
                                </Box>
                            </CalculatorInnerDivider>
                        </Box>



                        {proposal &&
                            <CalculatorInnerDivider className="border-info bg-blue-100 border-2 shadow-xl">
                                <SectionHeader title="Propuesta" />
                                <CatalogDataGrid rows={proposal} columns={columns_proposal} hideFooter={true}/>
                            </CalculatorInnerDivider>
                        }
                        {resumen && <CopyableSummary text={resumen} />}
                        <Divider className="mt-4" variant="middle"/>
                        
                        
                        
                        <CalculatorInnerDivider>
                            <Stack direction="row" justifyContent="space-between" className="items-center">
                                <SectionHeader title="Catálogo de productos" />
                                <CatalogGridActions setOpenAddDialog={setOpenAddDialog } importCatalogue={importCatalogue} exportCatalogue={exportCatalogue} reloadCatalogue={reloadCatalogue}/>
                            </Stack>
                            <CatalogDataGrid rows={suplementos} columns={columns_catalog}/>
                            <AddProductDialog openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} suplementos={suplementos} setSuplementos={setSuplementos}/>
                            <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
                                <DialogTitle>¿Borrar todos los datos?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Se eliminarán todos los campos introducidos y la propuesta actual. Esta acción no se puede deshacer.</DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setResetOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleReset} color="error" variant="contained">Borrar</Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={actionRowId !== null}
                                onClose={() => setActionRowId(null)}
                            >
                                <DialogTitle id="alert-dialog-title">¿Eliminar este suplemento?</DialogTitle>
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