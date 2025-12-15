'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider
} from '@mui/material';
import { ArrowBack, Receipt, Save } from '@mui/icons-material';
import Sidebar from '@/app/utils/components/sidebar';
import { useRouter } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface Rental {
  rentalId: number;
  roomNumber: string;
  customerName: string;
  rentType: string;
  checkinDate: string;
  checkoutDate: string | null;
  status: string;
}

const AdminCreateInvoice: React.FC = () => {
  const [userSession, setUserSession] = useState<{ role: 'ADMIN'; userData: { username: string } } | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState({
    rentalId: '',
    waterUnit: '',
    electricUnit: ''
  });

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role !== 'ADMIN') router.push('/login');
      else setUserSession(parsed);
    } else router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/rentals/list');
        const activeRentals = response.data.filter((r: any) => r.status === 'active');
        
        const mappedRentals: Rental[] = activeRentals.map((r: any) => ({
          rentalId: r.rentalId,
          roomNumber: r.roomNumber,
          customerName: r.customerName,
          rentType: r.rentType,
          checkinDate: r.checkinDate,
          checkoutDate: r.checkoutDate,
          status: r.status
        }));
        
        setRentals(mappedRentals);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        setError('ไม่สามารถดึงข้อมูลการเช่าได้');
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleRentalChange = (rentalId: string) => {
    setFormData({ ...formData, rentalId });
    const rental = rentals.find(r => r.rentalId === parseInt(rentalId));
    setSelectedRental(rental || null);
    
    if (rental && rental.rentType === 'daily') {
      setFormData({
        rentalId,
        waterUnit: '0',
        electricUnit: '0'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.rentalId) {
      setError('กรุณาเลือกการเช่า');
      return;
    }

    if (selectedRental?.rentType === 'monthly') {
      if (!formData.waterUnit || !formData.electricUnit) {
        setError('กรุณากรอกข้อมูลมิเตอร์น้ำและไฟ');
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        rentalId: parseInt(formData.rentalId),
        waterUnit: parseInt(formData.waterUnit) || 0,
        electricUnit: parseInt(formData.electricUnit) || 0
      };

      await axios.post('http://localhost:8081/api/invoices/create', payload);
      
      setSuccess('สร้างใบแจ้งหนี้สำเร็จ!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin_invoices');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างใบแจ้งหนี้');
    } finally {
      setSubmitting(false);
    }
  };

  if (!userSession || loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <CircularProgress sx={{ color: '#2c3e50' }} size={60} thickness={3.5} />
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <Sidebar role="ADMIN" />
      
      <Box component="main" sx={{
        flexGrow: 1,
        p: 5,
        '@media (max-width: 600px)': { p: 3 }
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/admin_invoices')}
            sx={{
              mb: 2,
              color: '#6c757d',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            กลับไปหน้ารายการใบแจ้งหนี้
          </Button>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              letterSpacing: '-0.5px',
              mb: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <Receipt sx={{ fontSize: 35 }} />
            สร้างใบแจ้งหนี้ใหม่
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 400 }}>
            เลือกการเช่าและกรอกข้อมูลเพื่อสร้างใบแจ้งหนี้
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Paper sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          maxWidth: 800
        }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                ข้อมูลการเช่า
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel>เลือกการเช่า *</InputLabel>
                <Select
                  value={formData.rentalId}
                  onChange={(e) => handleRentalChange(e.target.value)}
                  label="เลือกการเช่า *"
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dee2e6'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>-- เลือกการเช่า --</em>
                  </MenuItem>
                  {rentals.map((rental) => (
                    <MenuItem key={rental.rentalId} value={rental.rentalId}>
                      ห้อง {rental.roomNumber} - {rental.customerName} 
                      ({rental.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {selectedRental && (
              <Box sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#2c3e50' }}>
                  รายละเอียดการเช่า
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3 
                }}>
                  <Box sx={{ flex: '1 1 45%', minWidth: 200 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                      หมายเลขห้อง
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {selectedRental.roomNumber}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 45%', minWidth: 200 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                      ชื่อลูกค้า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {selectedRental.customerName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 45%', minWidth: 200 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                      ประเภทการเช่า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {selectedRental.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 45%', minWidth: 200 }}>
                    <Typography variant="body2" sx={{ color: '#6c757d', mb: 0.5 }}>
                      วันที่เช่า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                      {new Date(selectedRental.checkinDate).toLocaleDateString('th-TH')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {selectedRental && selectedRental.rentType === 'monthly' && (
              <>
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#2c3e50' }}>
                    มิเตอร์น้ำและไฟ
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 3, color: '#6c757d' }}>
                    สำหรับการเช่ารายเดือนเท่านั้น
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 3 
                  }}>
                    <Box sx={{ flex: '1 1 45%', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="หน่วยน้ำ (ยูนิต) *"
                        type="number"
                        value={formData.waterUnit}
                        onChange={(e) => setFormData({ ...formData, waterUnit: e.target.value })}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        helperText="อัตรา: 3 บาท/ยูนิต"
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 45%', minWidth: 250 }}>
                      <TextField
                        fullWidth
                        label="หน่วยไฟ (ยูนิต) *"
                        type="number"
                        value={formData.electricUnit}
                        onChange={(e) => setFormData({ ...formData, electricUnit: e.target.value })}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                        helperText="อัตรา: 5 บาท/ยูนิต"
                      />
                    </Box>
                  </Box>
                </Box>
              </>
            )}

            {selectedRental && selectedRental.rentType === 'daily' && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                การเช่ารายวันไม่มีค่าน้ำและค่าไฟ
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin_invoices')}
                sx={{
                  py: 1.3,
                  px: 3,
                  borderRadius: 2,
                  borderColor: '#dee2e6',
                  color: '#6c757d',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#2c3e50',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                ยกเลิก
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={submitting || !formData.rentalId}
                sx={{
                  py: 1.3,
                  px: 3,
                  borderRadius: 2,
                  backgroundColor: '#2c3e50',
                  color: '#fff',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1a252f',
                    boxShadow: '0 6px 16px rgba(44, 62, 80, 0.4)'
                  },
                  '&:disabled': {
                    backgroundColor: '#adb5bd',
                    color: '#fff'
                  }
                }}
              >
                {submitting ? 'กำลังสร้าง...' : 'สร้างใบแจ้งหนี้'}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          maxWidth: 800
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#856404' }}>
            📌 หมายเหตุ
          </Typography>
          <Typography variant="body2" sx={{ color: '#856404' }}>
            • การเช่ารายวัน: ไม่มีค่าน้ำและค่าไฟ<br />
            • การเช่ารายเดือน: ต้องกรอกมิเตอร์น้ำและไฟ (อัตราน้ำ 3 บาท/ยูนิต, อัตราไฟ 5 บาท/ยูนิต)<br />
            • ค่าแอร์จะคิดอัตโนมัติ 200 บาท (ถ้าห้องมีแอร์)<br />
            • ระบบจะคำนวณค่าใช้จ่ายทั้งหมดอัตโนมัติ
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminCreateInvoice, "ADMIN");