import { DataGrid, GridActionsCellItem, gridClasses, useGridApiRef } from "@mui/x-data-grid";
import { Stack, Typography, Tooltip, Fab } from "@mui/material";
import { Trash2, Plus, Download, FileUp, RotateCcw } from "lucide-react";
import { esES } from "@mui/x-data-grid/locales";
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useMemo } from 'react';


export function DeleteActionsCellItem({id, onDelete}) {
    return (
            <GridActionsCellItem
                label="Eliminar"
                icon={<Trash2 size={20} className="text-error"/>}
                onClick={() => onDelete(id)}
            />
    );
}

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

export function CatalogGridActions(props){
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

// Añade flex:1 a columnas sin ancho fijo para que rellenen el espacio disponible
function withFlex(columns) {
    const hasFixed = columns.some(c => c.width != null || c.flex != null);
    if (hasFixed) return columns;
    return columns.map((col, i) =>
        i === 0 ? { ...col, flex: 2 } : { ...col, flex: 1 }
    );
}

export function CatalogDataGrid({ rows, columns, hideFooter = false }) {
    const apiRef = useGridApiRef();
    const containerRef = useRef(null);

    const resolvedColumns = useMemo(() => {
        // Si alguna columna tiene width explícito, usamos autosize; si no, flex
        const hasExplicitWidth = columns.some(c => c.width != null);
        if (hasExplicitWidth) return columns;
        return columns.map((col, i) =>
            col.flex != null ? col : { ...col, flex: i === 0 ? 2 : 1 }
        );
    }, [columns]);

    useEffect(() => {
        const autosize = () => {
            if (columns.some(c => c.width != null)) {
                apiRef.current?.autosizeColumns({ expand: true });
            }
        };
        autosize();
        const observer = new ResizeObserver(autosize);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [rows, columns]);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
        <DataGrid
            apiRef={apiRef}
            className="shadow"
            rows={rows}
            columns={resolvedColumns}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            density="compact"
            getRowHeight={() => 'auto'}
            disableRowSelectionOnClick
            hideFooter={hideFooter}
            initialState={
                {pagination:{
                    paginationModel: { pageSize: 15 }
                }}
            }
            pageSizeOptions={[15, 25, 50, 100]}
            slots={{
                noRowsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                    <Typography variant="body1" gutterBottom>
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
        </div>
    );

}