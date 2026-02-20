import { Box, Button, Divider, Chip, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Tooltip, Fab, Grid } from "@mui/material";
import { DataGrid, GridActionsCell, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import { CalculatorGrid, CalculatorSection, CalculatorInnerDivider } from "../basic/Layout";
import { CalculatorHeader, DropdownInput, CheckboxInput, SectionHeader, Input, MultiSelectInput } from "../basic/Elements";
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { ArrowRight, ArrowDown, Calculator, Trash2, Plus, Download, FileUp, RotateCcw } from "lucide-react";
import suplementos_data from '../../assets/data/suplementos_orales.json'
import { esES } from "@mui/x-data-grid/locales";
import { recomendarSuplementos } from "../../utils/calculatorLogic/suplementos.js";
import { useState, useCallback, createContext, useContext } from "react";
import { z } from 'zod';
import { importToJSON, exportToJSON } from "../../utils/fileOperations.js";
import { styled } from '@mui/material/styles';

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

const columns_catalog = [
    {
        field: 'name',
        headerName: 'Nombre',
        type: 'string',
        editable: false,
        width: 250
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
        renderCell: (params) => <ActionsCell {...params} />
    },
]

const columns_proposal = [
    {
        field: 'name',
        headerName: 'Nombre',
        type: 'string',
        editable: false,
        width: 250
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

const DeleteActionHandlerContext = createContext(undefined);

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function ActionsCell(props){
    const setActionRowId = useContext(DeleteActionHandlerContext);

    if (!setActionRowId) {
        throw new Error("ActionsCell must be used within a ActionHandlerContextProvider");
    }

    return (
        <GridActionsCell {...props}>
            <GridActionsCellItem
                label="Eliminar"
                icon={<Trash2 size={20} className="text-error"/>}
                onClick={() => setActionRowId(props.id)}
            >
            </GridActionsCellItem>
        </GridActionsCell>
    );
}

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
                            <Controller
                                name="tags"
                                control={methods.control}
                                rules={{
                                    required: "Este campo es obligatorio",
                                    validate: (value) =>
                                        value.length > 0 || "Select at least one tag"
                                }}
                                render={({ field }) => (
                                    <MultiSelectInput controllerField={field} label="Tags" id="tags" options={available_tags} placeholder="Selecciona las categorías" labelOnTop={false}/>    
                                )}    
                            />
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

function SuplementosGridActions(props){
    const { setOpenAddDialog, importCatalogue, exportCatalogue, reloadCatalogue } = props;
    return (
        <Stack direction="row" spacing={1} className="p-2 mb-4">
             <Tooltip title="Añadir producto">
                <Fab
                    size="small"
                    color="primary"
                    onClick={() => setOpenAddDialog(true)}
                >
                    <Plus size={20} className="text-white"/>
                </Fab>
            </Tooltip>
            <Tooltip title="Importar JSON">
                <Fab
                    size="small"
                    component="label"
                >
                    <FileUp size={20} />
                    <VisuallyHiddenInput type="file" onChange={importCatalogue} accept=".json" />
                </Fab>
            </Tooltip>
            <Tooltip title="Exportar JSON" >
                <Fab
                    size="small"
                    onClick={exportCatalogue}
                >
                    <Download size={20} />
                </Fab>
            </Tooltip>
            <Tooltip title="Restaurar catálogo por defecto">
                <Fab
                    size="small"
                    onClick={reloadCatalogue}
                >
                    <RotateCcw size={20} />
                </Fab>
            </Tooltip>
        </Stack>
    );
}


export function Suplementos() {
    const methods = useForm();

    const [suplementos, setSuplementos] = useState(suplementos_data);   // Stores the state of suplementos that will be used as reference for recommendation
    const [actionRowId, setActionRowId] = useState(null);               // Stores the id of the row that is being edited
    const [openAddDialog, setOpenAddDialog] = useState(false);          // Stores the state of the add product dialog

    const [proposal, setProposal] = useState(null);                     // Stores the recommended suplementos

    const onSubmit = methods.handleSubmit(data => {
        setProposal(recomendarSuplementos(data, suplementos));
    });

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
        setSuplementos(suplementos_data);
    }

    const exportCatalogue = () => {
        exportToJSON(suplementos, 'suplementos_orales.json');
    }

    async function importCatalogue(event) {
        console.log(event.target.files);
        const uploadedFile = event.target.files[0];
        try {
            const newCatalogue = await importToJSON(JSONSchemaArray, uploadedFile);
            console.log(newCatalogue);
    
            if (newCatalogue !== false){
                setSuplementos(newCatalogue);
            }
        } catch (error) {
            alert(error);
        }

    }

    return (
        <CalculatorGrid cols={1} className="w-lvh" children={
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
                            <CheckboxInput label="Usar solo productos compatibles con el perfil" id="compatibleOnly" defaultChecked={true} />
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
                                </Box>
                                <Box className="flex justify-center">
                                    <Button variant="contained" color="primary" onClick={onSubmit} className="mt-4" endIcon={<Calculator size={16} />}>Calcular recomendación</Button>
                                </Box>
                            </CalculatorInnerDivider>
                        </Box>
                        {proposal &&
                            <CalculatorInnerDivider className="border-info bg-blue-100 border-2 shadow-xl">
                                <SectionHeader title="Propuesta" />
                                <DataGrid
                                className="shadow"
                                rows={proposal}
                                columns={columns_proposal}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                density="compact"
                                // showToolbar
                                getRowHeight={() => 'auto'}
                                disableRowSelectionOnClick
                                autosizeOnMount
                                autosizeOptions={{
                                    expand: true,
                                }}
                                hideFooter
                                slots={{
                                    noRowsOverlay: () => (
                                        <Stack height="100%" alignItems="center" justifyContent="center">
                                        <Typography variant="p" gutterBottom>
                                            No se encontraron resultados, revise los parámetros.
                                        </Typography>
                                        </Stack>
                                    )
                                }}
                                sx={{
                                    [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                                        outline: 'none',
                                    },
                                    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                                        {
                                        outline: 'none',
                                        },
                                    }}
                            />

                            </CalculatorInnerDivider>
                        }
                        <Divider className="mt-4" variant="middle"/>
                        <CalculatorInnerDivider>
                            <Stack direction="row" justifyContent="space-between" className="items-center">
                                <SectionHeader title="Catálogo de productos" />
                                <SuplementosGridActions setOpenAddDialog={setOpenAddDialog } importCatalogue={importCatalogue} exportCatalogue={exportCatalogue} reloadCatalogue={reloadCatalogue}/>
                            </Stack>
                            <DeleteActionHandlerContext.Provider value={setActionRowId}>
                                <DataGrid
                                    className="shadow"
                                    rows={suplementos}
                                    columns={columns_catalog}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    density="compact"
                                    // showToolbar
                                    getRowHeight={() => 'auto'}
                                    disableRowSelectionOnClick
                                    sx={{
                                        [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                                            outline: 'none',
                                        },
                                        [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                                            {
                                            outline: 'none',
                                            },
                                        }}
                                />
                            </DeleteActionHandlerContext.Provider>
                            <AddProductDialog openAddDialog={openAddDialog} setOpenAddDialog={setOpenAddDialog} suplementos={suplementos} setSuplementos={setSuplementos}/>
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