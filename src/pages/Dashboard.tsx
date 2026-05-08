import React from 'react'
import { Box, Typography, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function Dashboard() {
  const [open, setOpen] = React.useState(false)
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setOpen((s) => !s)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Aerotech Backoffice</Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)} variant="temporary">
        <List sx={{ width: 260 }}>
          <ListItem button>
            <ListItemText primary="Flights" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Bookings" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Passengers" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flex: 1, p: 3, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Typography>Welcome to the Aerotech Backoffice — dashboard coming soon.</Typography>
      </Box>
    </Box>
  )
}
