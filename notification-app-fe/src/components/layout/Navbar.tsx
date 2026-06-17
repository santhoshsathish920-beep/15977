import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';

export const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          Notifications Center
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<NotificationsIcon />}
            sx={{
              opacity: location.pathname === '/' ? 1 : 0.7,
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            All Notifications
          </Button>
          <Button
            component={Link}
            to="/priority"
            color="inherit"
            startIcon={<InboxIcon />}
            sx={{
              opacity: location.pathname === '/priority' ? 1 : 0.7,
              borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none',
              borderRadius: 0,
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
