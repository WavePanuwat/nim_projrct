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
  ListItemIcon,
  Divider
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
          { name: 'หน้าหลัก', path: '/admin_home', icon: <HomeIcon /> },
          { name: 'รายชื่อลูกค้า', path: '/admin_listcustomer', icon: <PeopleIcon /> },
          { name: 'เพิ่มห้อง', path: '/admin_addroom', icon: <AddHomeWorkIcon /> },
          { name: 'ใบแจ้งหนี้', path: '/admin_Invoice', icon: <ReceiptLongIcon /> },
        ]
      : [
          { name: 'หน้าหลัก', path: '/customer_home', icon: <HomeIcon /> },
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
        width: 280,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #e9ecef',
          color: '#2c3e50',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <Box
        sx={{
          p: 4,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid #f1f3f5',
        }}
      >
        <Box
        >
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {fullname.charAt(0).toUpperCase()}
          </Typography>
        </Box>
        <Box
          sx={{
            px: 2.5,
            py: 0.5,
            borderRadius: 2,
            backgroundColor: role === 'ADMIN' ? '#ecfdf5' : '#dbeafe',
            border: role === 'ADMIN' ? '1px solid #a7f3d0' : '1px solid #93c5fd',
            mb: 1.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: role === 'ADMIN' ? '#047857' : '#1e40af',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {role === 'ADMIN' ? 'Admin' : 'Customer'}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#2c3e50',
            textAlign: 'center',
          }}
        >
          {fullname}
        </Typography>
      </Box>

      {/* Menu */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <List sx={{ px: 1 }}>
          {pages.map((page, index) => (
            <Link key={page.name} href={page.path} passHref style={{ textDecoration: 'none' }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      color: '#2c3e50',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#2c3e50',
                      fontWeight: 600,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#6c757d',
                    minWidth: 40,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {page.icon}
                </ListItemIcon>

                <ListItemText
                  primary={page.name}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: '#495057',
                  }}
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 3,
          borderTop: '1px solid #f1f3f5',
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            py: 1.3,
            textTransform: 'none',
            fontSize: '0.95rem',
            borderRadius: 2,
            fontWeight: 600,
            borderColor: '#dc3545',
            color: '#dc3545',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#dc3545',
              backgroundColor: '#fff5f5',
              color: '#dc3545',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)',
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