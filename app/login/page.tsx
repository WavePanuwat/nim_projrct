'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
} from '@mui/material';

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
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
    >
      <Card sx={{ padding: 4, width: '100%', boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          LOGIN
        </Typography>

        <form onSubmit={handleLogin}>
          <FormControl fullWidth margin="normal">
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value as 'ADMIN' | 'CUSTOMER')}
              sx={{ justifyContent: 'center' }}
            >
              <FormControlLabel value="ADMIN" control={<Radio />} label="Admin" />
              <FormControlLabel value="CUSTOMER" control={<Radio />} label="Customer" />
            </RadioGroup>
          </FormControl>

          <TextField
            label={role === 'ADMIN' ? 'Username' : 'Phone Number'}
            fullWidth
            required
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>

        {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
      </Card>
    </Container>
  );
};

export default LoginPage;
