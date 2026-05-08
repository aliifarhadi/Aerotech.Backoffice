import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F7941D',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial",
  },
})
