'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

interface UserSession {
  token: string;
  userData: any;
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

      let sessionData: UserSession;

      if (role === 'ADMIN') {
        sessionData = {
          token: data.token,
          userData: {
            userId: data.userId,
            username: username,
            fullname: `${data.firstname} ${data.lastname}`,
          },
          role: 'ADMIN'
        };
      } else {
        sessionData = {
          token: data.token,
          userData: {
            customerId: data.userId,
            firstname: data.firstname,
            lastname: data.lastname,
          },
          role: 'CUSTOMER'
        };
      }

      sessionStorage.setItem('userSession', JSON.stringify(sessionData));
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
        bgcolor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            borderRadius: 2,
            bgcolor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#0f172a',
                letterSpacing: '-0.01em',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '1.75rem' }
              }}
            >
              เข้าสู่ระบบ
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.875rem'
              }}
            >
              กรุณากรอกข้อมูลเพื่อเข้าใช้งาน
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            {/* Role Selection */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <RadioGroup
                  row
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'ADMIN' | 'CUSTOMER')}
                  sx={{ 
                    justifyContent: 'center',
                    gap: 1.5
                  }}
                >
                  <FormControlLabel
                    value="ADMIN"
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          color: role === 'ADMIN' ? '#0f172a' : '#64748b',
                          fontSize: '0.875rem'
                        }}
                      >
                        ผู้ดูแลระบบ
                      </Typography>
                    }
                    sx={{
                      bgcolor: role === 'ADMIN' ? '#f1f5f9' : 'transparent',
                      px: 2.5,
                      py: 1,
                      borderRadius: 1.5,
                      border: role === 'ADMIN' ? '1.5px solid #cbd5e1' : '1.5px solid transparent',
                      m: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                        borderColor: '#cbd5e1'
                      }
                    }}
                  />
                  <FormControlLabel
                    value="CUSTOMER"
                    control={<Radio sx={{ display: 'none' }} />}
                    label={
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          color: role === 'CUSTOMER' ? '#0f172a' : '#64748b',
                          fontSize: '0.875rem'
                        }}
                      >
                        ลูกค้า
                      </Typography>
                    }
                    sx={{
                      bgcolor: role === 'CUSTOMER' ? '#f1f5f9' : 'transparent',
                      px: 2.5,
                      py: 1,
                      borderRadius: 1.5,
                      border: role === 'CUSTOMER' ? '1.5px solid #cbd5e1' : '1.5px solid transparent',
                      m: 0,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: '#f8fafc',
                        borderColor: '#cbd5e1'
                      }
                    }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Username Field */}
            <Box sx={{ mb: 2.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  fontWeight: 500,
                  color: '#334155',
                  fontSize: '0.875rem'
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
                    <PersonIcon sx={{ mr: 1.5, color: '#94a3b8', fontSize: 20 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#ffffff',
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                    '& fieldset': { 
                      borderColor: '#e2e8f0'
                    },
                    '&:hover fieldset': { 
                      borderColor: '#cbd5e1'
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#0f172a',
                      borderWidth: '1.5px'
                    }
                  }
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1,
                  fontWeight: 500,
                  color: '#334155',
                  fontSize: '0.875rem'
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
                    <LockIcon sx={{ mr: 1.5, color: '#94a3b8', fontSize: 20 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#ffffff',
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                    '& fieldset': { 
                      borderColor: '#e2e8f0'
                    },
                    '&:hover fieldset': { 
                      borderColor: '#cbd5e1'
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: '#0f172a',
                      borderWidth: '1.5px'
                    }
                  }
                }}
              />
            </Box>

            {/* Error Message */}
            {message && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 1.5,
                  bgcolor: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                  fontSize: '0.875rem',
                  '& .MuiAlert-icon': { 
                    color: '#dc2626'
                  }
                }}
              >
                {message}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: 1.5,
                bgcolor: '#0f172a',
                color: '#ffffff',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { 
                  bgcolor: '#1e293b',
                  boxShadow: 'none'
                },
                '&:disabled': { 
                  bgcolor: '#e2e8f0',
                  color: '#94a3b8'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#94a3b8' }} />
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