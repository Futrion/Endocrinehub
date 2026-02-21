import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import { Stack, Typography, Tooltip, Fab } from "@mui/material";
import { Trash2, Plus, Download, FileUp, RotateCcw } from "lucide-react";
import { esES } from "@mui/x-data-grid/locales";
import { styled } from '@mui/material/styles';


export function DeleteActionsCellItem({id, onDelete}) {
    return (
            <GridActionsCellItem
                label="Eliminar"
                icon={<Trash2 size={20} className="text-error"/>}
                onClick={() => onDelete(id)}
            />
    );
}

export function CatalogGridActions(props){
    const { setOpenAddDialog, importCatalogue, exportCatalogue, reloadCatalogue } = props;

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

export function CatalogDataGrid({ rows, columns, hideFooter = false }) {8
    return (
        <DataGrid
            className="shadow"
            rows={rows}
            columns={columns}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            density="compact"
            // showToolbar
            getRowHeight={() => 'auto'}
            disableRowSelectionOnClick
            autosizeOnMount
            autosizeOptions={{
                expand: true,
            }}
            hideFooter = {hideFooter}
            initialState={
                {pagination:{
                    paginationModel: { pageSize: 15 }
                }}
            }
            pageSizeOptions={[15, 25, 50, 100]}
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
    );

}