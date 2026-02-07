import { createTheme } from '@mui/material/styles';

// Direct color mapping from Tailwind config
const colors = {
    primary: {
      main: '#28527a',
      light: '#537494',
      dark: '#1c3955',
    },
    secondary: {
      main: '#d8e4f7',
      light: '#dfe9f8',
      dark: '#979fac',
    },
    error: {
      main: '#c62828',
      light: '#d15353',
      dark: '#8a1c1c',
      background: '#fdecea',
    },
    warning: {
      main: '#ffab00',
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
      main: 'rgba(102,187,106,0.9)',
      light: 'rgba(132,200,135,0.9)',
      dark: 'rgba(71,130,74,0.9)',
    },
    divider: '#90beef',
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
        background: {
            default: colors['main-bg'],
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        fontSize: 16,
        h2: {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: colors.primary,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: colors.primary,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                },
                outlinedSecondary: {
                    borderColor: colors['primary-border'],
                    color: colors.primary.main,
                    backgroundColor: colors.secondary.main,    
                },
                outlinedError: {
                    borderColor: colors.error.main,
                    color: colors.error.main,
                    backgroundColor: colors.error.background,
                },
        
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff",
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        '& fieldset': {
                            borderColor: colors.accent.main,
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
    },
});

export default theme;