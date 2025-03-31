import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Hidden
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const Layout = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { text: 'Product Selection', path: '/', icon: <DashboardIcon /> },
    { text: 'Product Management', path: '/products', icon: <SettingsIcon /> },
    { text: 'Customer Management', path: '/customers', icon: <PeopleIcon /> },
    { text: 'Staff Management', path: '/staff', icon: <PersonIcon /> },
    { text: 'Quotation Generation', path: '/generate', icon: <DescriptionIcon /> },
    { text: 'Quotation Management', path: '/manage', icon: <HistoryIcon /> },
  ];

  const drawer = (
    <Box sx={{ 
      width: { xs: 220, sm: 250, md: 280 }, 
      textAlign: 'center',
      maxWidth: '90vw' // Ensure drawer doesn't exceed screen width
    }}>
      <Typography variant="h6" sx={{ 
        my: { xs: 1.5, sm: 2 }, 
        px: { xs: 1.5, sm: 2 }, 
        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
      }}>
        Prateek Tiles and Marble
      </Typography>
      <Divider />
      <List sx={{ pt: { xs: 0.5, sm: 1 } }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            selected={location.pathname === item.path}
            onClick={toggleDrawer}
            sx={{
              py: { xs: 0.75, sm: 1, md: 1.5 },
              borderRadius: '4px',
              mx: { xs: 0.5, sm: 1 },
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText'
                },
                '& .MuiListItemText-primary': {
                  color: 'primary.contrastText',
                  fontWeight: 'bold'
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: { xs: 28, sm: 30, md: 40 } }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                noWrap: true
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ 
          px: { xs: 0.5, sm: 1, md: 2 },
          minHeight: { xs: '56px', sm: '64px' } // Smaller toolbar on mobile
        }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: { xs: 0.5, sm: 1, md: 2 } }}
              size={isSmall ? "small" : "medium"}
            >
              <MenuIcon fontSize={isSmall ? "small" : "medium"} />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontSize: { xs: '0.85rem', sm: '1.1rem', md: '1.25rem' },
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ml: { xs: 0.5, sm: 0 } // Add a bit of margin on very small screens
            }}
          >
            Prateek Tiles and Marble
          </Typography>
          <Hidden mdDown>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: { md: 'wrap', lg: 'nowrap' },
              justifyContent: 'flex-end'
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  size={isTablet ? "small" : "medium"}
                  sx={{ 
                    mx: { md: 0.3, lg: 0.5, xl: 1 },
                    my: { md: 0.3, lg: 0 },
                    px: { md: 0.5, lg: 1 },
                    fontSize: { md: '0.7rem', lg: '0.75rem', xl: '0.875rem' },
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          </Hidden>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 1, sm: 2, md: 3 },
          px: { xs: 0.5, sm: 1, md: 2 },
          maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '1200px' },
          overflow: 'hidden' // Prevent horizontal scrolling
        }}
      >
        {children}
      </Container>

      <Box component="footer" sx={{ 
        py: { xs: 1.5, sm: 2, md: 3 }, 
        bgcolor: 'background.paper', 
        mt: 'auto' 
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' } }}
          >
            © {new Date().getFullYear()} Prateek Tiles and Marble. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;