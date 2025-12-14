'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

interface UserSession {
  token: string;
  userData: {
    username: string;
    fullname: string;
  };
  role: 'ADMIN' | 'CUSTOMER';
}

const LoginPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'CUSTOMER'>('ADMIN');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const loginUrl =
      role === 'ADMIN'
        ? 'http://localhost:8081/api/auth/admin/login'
        : 'http://localhost:8081/api/auth/customer/login';

    try {
      const response = await axios.post(loginUrl, { username, password });
      const data = response.data;

      if (!data.success) {
        setMessage('เข้าสู่ระบบล้มเหลว! โปรดตรวจสอบข้อมูลอีกครั้ง');
        return;
      }

      // สร้าง session เก็บข้อมูลจาก token
      const sessionData: UserSession = {
        token: data.token,
        userData: {
          username: username,
          fullname: `${data.firstname} ${data.lastname}`,
        },
        role: data.role,
      };

      // เก็บ token + ข้อมูล user ลง sessionStorage
      sessionStorage.setItem('userSession', JSON.stringify(sessionData));

      // ไปหน้า Home ตาม role
      router.push(role === 'ADMIN' ? '/admin_home' : '/customer_home');

    } catch (error: any) {
      if (error.response) {
        setMessage(`Login failed: ${error.response.data.message || 'ข้อมูลไม่ถูกต้อง'}`);
      } else if (error.request) {
        setMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      } else {
        setMessage('เกิดข้อผิดพลาด: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            bgcolor: '#fff'
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: '#111827',
                letterSpacing: '-0.02em',
                mb: 1
              }}
            >
              เข้าสู่ระบบ
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              กรุณาเลือกประเภทผู้ใช้และกรอกข้อมูล
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 4 }}>
              <FormControl fullWidth>
                <RadioGroup
                  row
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'ADMIN' | 'CUSTOMER')}
                  sx={{ 
                    justifyContent: 'center',
                    gap: 3
                  }}
                >
                  <FormControlLabel 
                    value="ADMIN" 
                    control={
                      <Radio 
                        sx={{ 
                          color: '#d1d5db',
                          '&.Mui-checked': { color: '#111827' }
                        }} 
                      />
                    } 
                    label={
                      <Typography sx={{ fontWeight: 500, color: '#374151', fontSize: '1rem' }}>
                        ผู้ดูแลระบบ
                      </Typography>
                    }
                  />
                  <FormControlLabel 
                    value="CUSTOMER" 
                    control={
                      <Radio 
                        sx={{ 
                          color: '#d1d5db',
                          '&.Mui-checked': { color: '#111827' }
                        }} 
                      />
                    } 
                    label={
                      <Typography sx={{ fontWeight: 500, color: '#374151', fontSize: '1rem' }}>
                        ลูกค้า
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500, 
                  color: '#374151' 
                }}
              >
                {role === 'ADMIN' ? 'ชื่อผู้ใช้' : 'เบอร์โทรศัพท์'}
              </Typography>
              <TextField
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === 'ADMIN' ? 'กรอกชื่อผู้ใช้' : 'กรอกเบอร์โทรศัพท์'}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: '#9ca3af' }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa',
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#d1d5db' },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#111827',
                      borderWidth: '1.5px'
                    }
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500, 
                  color: '#374151' 
                }}
              >
                รหัสผ่าน
              </Typography>
              <TextField
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ mr: 1, color: '#9ca3af' }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa',
                    borderRadius: 2,
                    '& fieldset': { borderColor: '#e5e7eb' },
                    '&:hover fieldset': { borderColor: '#d1d5db' },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#111827',
                      borderWidth: '1.5px'
                    }
                  }
                }}
              />
            </Box>

            {message && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: '#fef2f2',
                  color: '#991b1b',
                  '& .MuiAlert-icon': {
                    color: '#dc2626'
                  }
                }}
              >
                {message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.8,
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 2,
                bgcolor: '#111827',
                color: '#fff',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#1f2937',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                },
                '&:disabled': {
                  bgcolor: '#e5e7eb',
                  color: '#9ca3af'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#9ca3af' }} />
              ) : (
                'เข้าสู่ระบบ'
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;