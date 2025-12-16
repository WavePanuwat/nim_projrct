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
import { ArrowBack, Save } from '@mui/icons-material';
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
        bgcolor: '#fafafa'
      }}>
        <CircularProgress sx={{ color: '#1a1a2e' }} size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Sidebar role="ADMIN" />
      
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: '900px', mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 2.5 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/admin_invoices')}
            sx={{
              mb: 1.5,
              color: '#64748b',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8rem',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#1a1a2e'
              }
            }}
          >
            กลับไปหน้ารายการใบแจ้งหนี้
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e', letterSpacing: '-0.02em', fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 0.25 }}>
            สร้างใบแจ้งหนี้ใหม่
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 400, fontSize: '0.8rem' }}>
            เลือกการเช่าและกรอกข้อมูลเพื่อสร้างใบแจ้งหนี้
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 1.5, 
              borderRadius: 1.5,
              border: '1px solid #fecaca',
              bgcolor: '#fef2f2',
              fontSize: '0.8rem',
              py: 0.5,
              '& .MuiAlert-icon': { color: '#dc2626' }
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 1.5, 
              borderRadius: 1.5,
              border: '1px solid #bbf7d0',
              bgcolor: '#f0fdf4',
              fontSize: '0.8rem',
              py: 0.5,
              '& .MuiAlert-icon': { color: '#16a34a' }
            }} 
            onClose={() => setSuccess('')}
          >
            {success}
          </Alert>
        )}

        <Paper sx={{
          p: 2.5,
          borderRadius: 1.5,
          bgcolor: '#ffffff',
          boxShadow: 'none',
          border: '1px solid #f1f5f9'
        }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>
                ข้อมูลการเช่า
              </Typography>
              
              <FormControl fullWidth size="small">
                <InputLabel>เลือกการเช่า *</InputLabel>
                <Select
                  value={formData.rentalId}
                  onChange={(e) => handleRentalChange(e.target.value)}
                  label="เลือกการเช่า *"
                  sx={{
                    borderRadius: 1.5,
                    fontSize: '0.85rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0'
                    }
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                    <em>-- เลือกการเช่า --</em>
                  </MenuItem>
                  {rentals.map((rental) => (
                    <MenuItem key={rental.rentalId} value={rental.rentalId} sx={{ fontSize: '0.85rem' }}>
                      ห้อง {rental.roomNumber} - {rental.customerName} 
                      ({rental.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {selectedRental && (
              <Box sx={{
                mb: 2.5,
                p: 2,
                borderRadius: 1.5,
                bgcolor: '#f8fafc',
                border: '1px solid #f1f5f9'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#1a1a2e', fontSize: '0.8rem' }}>
                  รายละเอียดการเช่า
                </Typography>
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      หมายเลขห้อง
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.8rem' }}>
                      {selectedRental.roomNumber}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ชื่อลูกค้า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.8rem' }}>
                      {selectedRental.customerName}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ประเภทการเช่า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.8rem' }}>
                      {selectedRental.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontSize: '0.7rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      วันที่เช่า
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.8rem' }}>
                      {new Date(selectedRental.checkinDate).toLocaleDateString('th-TH')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {selectedRental && selectedRental.rentType === 'monthly' && (
              <>
                <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />
                
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600, color: '#1a1a2e', fontSize: '0.9rem' }}>
                    มิเตอร์น้ำและไฟ
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2, color: '#64748b', fontSize: '0.8rem' }}>
                    สำหรับการเช่ารายเดือนเท่านั้น
                  </Typography>

                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5
                  }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="หน่วยน้ำ (ยูนิต) *"
                      type="number"
                      value={formData.waterUnit}
                      onChange={(e) => setFormData({ ...formData, waterUnit: e.target.value })}
                      InputProps={{
                        inputProps: { min: 0 },
                        sx: { fontSize: '0.85rem' }
                      }}
                      InputLabelProps={{
                        sx: { fontSize: '0.85rem' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }}
                      helperText="อัตรา: 3 บาท/ยูนิต"
                      FormHelperTextProps={{
                        sx: { fontSize: '0.7rem' }
                      }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label="หน่วยไฟ (ยูนิต) *"
                      type="number"
                      value={formData.electricUnit}
                      onChange={(e) => setFormData({ ...formData, electricUnit: e.target.value })}
                      InputProps={{
                        inputProps: { min: 0 },
                        sx: { fontSize: '0.85rem' }
                      }}
                      InputLabelProps={{
                        sx: { fontSize: '0.85rem' }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5
                        }
                      }}
                      helperText="อัตรา: 5 บาท/ยูนิต"
                      FormHelperTextProps={{
                        sx: { fontSize: '0.7rem' }
                      }}
                    />
                  </Box>
                </Box>
              </>
            )}

            {selectedRental && selectedRental.rentType === 'daily' && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2.5, 
                  borderRadius: 1.5,
                  border: '1px solid #bfdbfe',
                  bgcolor: '#eff6ff',
                  fontSize: '0.8rem',
                  py: 0.5,
                  '& .MuiAlert-icon': { color: '#3b82f6' }
                }}
              >
                การเช่ารายวันไม่มีค่าน้ำและค่าไฟ
              </Alert>
            )}

            <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin_invoices')}
                sx={{
                  py: 0.75,
                  px: 2,
                  borderRadius: 1.5,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f8fafc'
                  }
                }}
              >
                ยกเลิก
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <Save sx={{ fontSize: 16 }} />}
                disabled={submitting || !formData.rentalId}
                sx={{
                  py: 0.75,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: '#1a1a2e',
                  color: '#ffffff',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': {
                    bgcolor: '#0f0f1e'
                  },
                  '&:disabled': {
                    bgcolor: '#cbd5e1',
                    color: '#ffffff'
                  }
                }}
              >
                {submitting ? 'กำลังสร้าง...' : 'สร้างใบแจ้งหนี้'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminCreateInvoice, "ADMIN");