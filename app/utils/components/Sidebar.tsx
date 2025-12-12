'use client';

import * as React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Button,
  ListItemIcon
} from '@mui/material';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

interface SidebarProps {
  role: 'ADMIN' | 'CUSTOMER';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [fullname, setFullname] = React.useState<string>('User');

  React.useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const parsed = JSON.parse(session);
      setFullname(parsed.userData?.fullname || 'User');
    }
  }, []);

  const pages =
    role === 'ADMIN'
      ? [
          { name: 'หน้าเเรก', path: '/admin_home', icon: <HomeIcon /> },
          { name: 'รายชื่อลูกค้า', path: '/admin_listcustomer', icon: <PeopleIcon /> },
          { name: 'เพิ่มห้อง', path: '/admin_addroom', icon: <AddHomeWorkIcon /> },
          { name: 'ใบเเจ้งหนี้', path: '/admin_Invoice', icon: <ReceiptLongIcon /> },
        ]
      : [
          { name: 'หน้าเเรก', path: '/customer_home', icon: <HomeIcon /> },
          { name: 'ใบแจ้งหนี้', path: '/customer_invoice', icon: <ReceiptIcon /> },
        ];

  const handleLogout = () => {
    sessionStorage.removeItem('userSession');
    window.location.href = '/login';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1E2A47',   
          borderRight: 'none',
          color: '#D8E6FF',            
          paddingTop: 2,

           boxShadow: "4px 0 12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      {/* Header */}
      <Toolbar
        sx={{
          justifyContent: "center",
          py: 3,
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#FFFFFF", fontSize: "1.15rem" }}
        >
          {role === 'ADMIN' ? 'Admin' : 'Customer'}
        </Typography>

        {/* Fullname */}
        <Typography
          variant="body2"
          sx={{
            mt: 0.3,
            fontSize: "0.9rem",
            color: "#F9D977", 
          }}
        >
          {fullname}
        </Typography>
      </Toolbar>

      {/* Menu */}
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {pages.map((page) => (
            <Link key={page.name} href={page.path} passHref>
              <ListItemButton
                sx={{
                  borderRadius: "8px",
                  mx: 1,
                  mb: 0.5,
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "#2F3C5C",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#F9D977",
                    minWidth: "40px",
                  }}
                >
                  {page.icon}
                </ListItemIcon>

                <ListItemText
                  primary={page.name}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#D8E6FF", 
                  }}
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>

      {/* Logout */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          width: '100%',
          px: 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            py: 1,
            textTransform: 'none',
            fontSize: "0.95rem",
            borderRadius: "10px",
            backgroundColor: "#EF4444",
            '&:hover': {
              backgroundColor: "#DC2626",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
