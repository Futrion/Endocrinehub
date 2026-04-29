import { createTheme } from '@mui/material/styles';

// Direct color mapping from Tailwind config
const colors = {
    primary: {
      main: '#28527a',
      light: '#537494',
      dark: '#1F4161',
    },
    secondary: {
      main: '#d8e4f7',
      light: '#dfe9f8',
      dark: '#979fac',
    },
    tertiary: {
      main: '#f1f8ff',
      light: '#f8fcff',
      dark: '#c5d3e8',
    },
    error: {
      main: '#c62828',
      light: '#d15353',
      dark: '#8a1c1c',
      background: '#fdecea',
    },
    warning: {
      main: '#d78f00',
      light: '#ffbb33',
      dark: '#b27700',
    },
    info: {
      main: '#0077b6',
      light: '#3392c4',
      dark: '#00537f',
    },
    accent: {
        main: '#90e0ef',
        light: '#b0e2eb',
        dark: '#70b0c1',
    },
    success: {
      main: '#66bb6a',
      light: '#84c887',
      dark: '#47824a',
    },
    infoLight: {
      main: '#e6f3fb',
    },
    muted: {
      main: '#5b6b7a',
    },
    divider: '#90e0ef',
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: colors.primary.main,
            light: colors.primary.light,
            dark: colors.primary.dark,
        },
        secondary: {
            main: colors.secondary.main,
            light: colors.secondary.light,
            dark: colors.secondary.dark,
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
        accent: {
            main: colors.accent.main,
            light: colors.accent.light,
            dark: colors.accent.dark,
        },
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        divider: colors.divider,
        
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
            color: colors.info.main,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: colors.info.main,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.primary.main,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            color: colors.primary.dark,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.primary.dark,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '6px',
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                },
                outlinedSecondary: {
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    backgroundColor: colors.secondary.main,    
                },
                outlinedError: {
                    borderColor: colors.error.main,
                    color: colors.error.main,
                },
        
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff",
                    borderRadius: '6px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#7fc3d4',
                        },
                        '&:hover fieldset': {
                            borderColor: colors.primary.main,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary.main,
                        },
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    
                    '& .MuiTableCell-root': {
                        fontWeight: 700,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: colors.primary.light,
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    ' &:before': {
                        display: 'none',
                    },
                }
            }
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    '& .MuiAccordionSummary-content': {
                        marginTop: '0',
                        marginBottom: '0',
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-columnHeader': {
                        backgroundColor: colors.secondary.light,
                    },
                    '& .MuiDataGrid-cell': {
                        border: `1px solid ${colors.secondary.light}`,
                        wrap: 'wrap',
                        padding: '2px',
                        alignContent: 'center',
                    },
                },
            },
        }
    },
});

export default theme;