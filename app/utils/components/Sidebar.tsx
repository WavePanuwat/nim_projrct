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

interface SidebarProps {
  role: 'ADMIN' | 'CUSTOMER';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pages =
    role === 'ADMIN'
      ? [
          { name: 'หน้าเเรก', path: '/admin_home', icon: <HomeIcon /> },
          { name: 'รายชื่อลูกค้า', path: '/admin_listcustomer', icon: <PeopleIcon /> },
          { name: 'เพิ่มห้อง', path: '/admin_addroom', icon: <AddHomeWorkIcon /> },
          { name: 'คำนวณค่าเช่า', path: '/admin_Invoice', icon: <AddHomeWorkIcon /> },
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
          backgroundColor: '#0f172a',
          borderRight: 'none',
          color: '#60A5FA',
          paddingTop: 2,
        },
      }}
    >
      {/* Header */}
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "#60A5FA" }}>
          {role === 'ADMIN' ? 'Admin' : 'Customer'}
        </Typography>
      </Toolbar>

      {/* Menu List */}
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
                    backgroundColor: "#1E40AF", // ฟ้าเข้ม hover
                  },
                  color: '#60A5FA',
                }}
              >
                <ListItemIcon sx={{ color: "#FBBF24", minWidth: "40px" }}>
                  {page.icon}
                </ListItemIcon>
                <ListItemText
                  primary={page.name}
                  primaryTypographyProps={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
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
            background: "linear-gradient(to right, #EF4444, #EF4444)",
            '&:hover': {
              background: "linear-gradient(to right, #e0421eff, #e0421eff)",
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
