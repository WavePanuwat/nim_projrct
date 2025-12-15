'use client';

import * as React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
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
  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    const sessionStr = sessionStorage.getItem('userSession');
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        if (parsed.userData && parsed.userData.fullname) {
          setFullname(parsed.userData.fullname);
        } else if (parsed.userData && parsed.userData.firstname && parsed.userData.lastname) {
          setFullname(`${parsed.userData.firstname} ${parsed.userData.lastname}`);
        } else {
          setFullname('User');
        }
      } catch (err) {
        console.error('Error parsing session:', err);
        setFullname('User');
      }
    }
  }, []);

  const pages =
    role === 'ADMIN'
      ? [
          { name: 'หน้าหลัก', path: '/admin_home', icon: <HomeIcon /> },
          { name: 'รายชื่อลูกค้า', path: '/admin_listcustomer', icon: <PeopleIcon /> },
          { name: 'เพิ่มห้อง', path: '/admin_addroom', icon: <AddHomeWorkIcon /> },
          { name: 'เพิ่มรายการเสริม', path: '/admin_addroomextra', icon: <AddHomeWorkIcon /> },
          { name: 'ใบแจ้งหนี้', path: '/admin_invoices', icon: <ReceiptLongIcon /> },
        ]
      : [
          { name: 'หน้าหลัก', path: '/customer_home', icon: <HomeIcon /> },
          { name: 'ใบแจ้งหนี้', path: '/customer_invoices', icon: <ReceiptIcon /> },
        ];

  const handleLogout = () => {
    sessionStorage.removeItem('userSession');
    window.location.href = '/login';
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 260,
          boxSizing: 'border-box',
          backgroundColor: '#1e293b',
          borderRight: 'none',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          pb: 2.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 0.6,
            borderRadius: 1,
            backgroundColor: role === 'ADMIN' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            border: role === 'ADMIN' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
            mb: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: role === 'ADMIN' ? '#60a5fa' : '#4ade80',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
            }}
          >
            {role === 'ADMIN' ? 'Admin' : 'Customer'}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#f1f5f9',
            letterSpacing: '-0.01em',
            mb: 0.25,
            textAlign: 'center',
          }}
        >
          {fullname}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 400,
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          {role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, pt: 2.5 }}>
        <List sx={{ px: 0 }}>
          {pages.map((page) => {
            const isActive = currentPath === page.path;
            return (
              <Link key={page.name} href={page.path} passHref style={{ textDecoration: 'none' }}>
                <ListItemButton
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.75,
                    py: 1.25,
                    px: 2,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '3px',
                      height: isActive ? '60%' : '0%',
                      backgroundColor: '#60a5fa',
                      borderRadius: '0 2px 2px 0',
                      transition: 'height 0.2s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      '&::before': {
                        height: '60%',
                      },
                      '& .MuiListItemIcon-root': { 
                        color: '#f1f5f9',
                      },
                      '& .MuiListItemText-primary': { 
                        color: '#f1f5f9',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#f1f5f9' : '#94a3b8',
                      minWidth: 36,
                      transition: 'color 0.2s ease',
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.2rem'
                      }
                    }}
                  >
                    {page.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={page.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#f1f5f9' : '#cbd5e1',
                      letterSpacing: '-0.01em',
                    }}
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            py: 1.25,
            textTransform: 'none',
            fontSize: '0.875rem',
            borderRadius: 1.5,
            fontWeight: 600,
            backgroundColor: '#ef4444',
            color: '#ffffff',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#dc2626',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;