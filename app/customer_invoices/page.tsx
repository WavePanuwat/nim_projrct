'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Divider
} from '@mui/material';
import Sidebar from '@/app/utils/components/sidebar';
import { useRouter } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface UserSession {
  role: 'CUSTOMER';
  token: string;
  userData: {
    customerId: number;
    firstname: string;
    lastname: string;
  };
}

interface RentalExtraInfo {
  extraName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  chargeType: string;
}

interface Invoice {
  invoiceId: number;
  roomNumber: string;
  rentType: string;
  baseRent: number;
  acFee: number;
  waterUnit: number;
  waterRate: number;
  waterFee: number;
  electricUnit: number;
  electricRate: number;
  electricFee: number;
  rentalExtras?: RentalExtraInfo[];
  rentalExtrasFee: number;
  rentalExtrasCount?: number;
  totalAmount: number;
  status: 'PAID' | 'UNPAID';
  createdAt: string;
}

const CustomerInvoices: React.FC = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'PAID' | 'UNPAID'>('All');
  const router = useRouter();

  useEffect(() => {
    const sessionStr = sessionStorage.getItem('userSession');
    if (!sessionStr) {
      router.replace('/login');
      return;
    }

    try {
      const parsed: UserSession = JSON.parse(sessionStr);
      if (parsed.role !== 'CUSTOMER' || !parsed.userData?.customerId) {
        router.replace('/login');
        return;
      }
      setUserSession(parsed);
    } catch (err) {
      console.error('Session parse error', err);
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!userSession) return;

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const customerId = userSession.userData.customerId;
        const res = await axios.get<Invoice[]>(
          `http://localhost:8081/api/invoices/customer/${customerId}`,
          {
            headers: { Authorization: `Bearer ${userSession.token}` }
          }
        );
        setInvoices(res.data);
        setFilteredInvoices(res.data);
      } catch (err) {
        console.error('Fetch invoice error:', err);
        alert('ไม่สามารถดึงข้อมูลใบแจ้งหนี้ได้');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [userSession]);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(inv => inv.status === statusFilter));
    }
  }, [statusFilter, invoices]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const formatCurrency = (amount: number) =>
    `฿${amount.toLocaleString()}`;

  const handlePayment = async (invoiceId: number) => {
    if (!confirm(`ยืนยันการชำระเงินสำหรับใบแจ้งหนี้ #${invoiceId}?`)) return;

    try {
      await axios.put(
        `http://localhost:8081/api/invoices/${invoiceId}/pay`,
        {},
        {
          headers: { Authorization: `Bearer ${userSession?.token}` }
        }
      );
      
      setInvoices(prev => 
        prev.map(inv => 
          inv.invoiceId === invoiceId 
            ? { ...inv, status: 'PAID' as const }
            : inv
        )
      );
      
      alert('ชำระเงินสำเร็จ!');
    } catch (err) {
      console.error('Payment error:', err);
      alert('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
    }
  };

  if (loading || !userSession) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#f8fafc'
      }}>
        <CircularProgress sx={{ color: '#0f172a' }} size={36} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Sidebar role="CUSTOMER" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: '1400px', mx: 'auto', width: '100%' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                mb: 0.5,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              ใบแจ้งหนี้ของฉัน
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              ตรวจสอบและจัดการใบแจ้งหนี้ทั้งหมด
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ fontSize: '0.875rem' }}>กรองสถานะ</InputLabel>
            <Select
              value={statusFilter}
              label="กรองสถานะ"
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'PAID' | 'UNPAID')}
              sx={{ fontSize: '0.875rem' }}
            >
              <MenuItem value="All" sx={{ fontSize: '0.875rem' }}>ทั้งหมด</MenuItem>
              <MenuItem value="UNPAID" sx={{ fontSize: '0.875rem' }}>ยังไม่ชำระ</MenuItem>
              <MenuItem value="PAID" sx={{ fontSize: '0.875rem' }}>ชำระแล้ว</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredInvoices.length === 0 ? (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 2, 
            bgcolor: '#ffffff', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            border: '1px solid #e2e8f0' 
          }}>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
              ไม่พบข้อมูลใบแจ้งหนี้
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(340px, 1fr))' }, 
            gap: 2.5 
          }}>
            {filteredInvoices.map((invoice) => (
              <Paper
                key={invoice.invoiceId}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#fff',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{
                  p: 2.5,
                  pb: 2,
                  bgcolor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        fontSize: '1rem',
                        mb: 0.5
                      }}
                    >
                      ใบแจ้งหนี้ #{invoice.invoiceId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                      ห้อง {invoice.roomNumber}
                    </Typography>
                  </Box>

                  <Chip
                    label={invoice.status === 'UNPAID' ? 'ยังไม่ชำระ' : 'ชำระแล้ว'}
                    sx={{
                      bgcolor: invoice.status === 'UNPAID' ? '#fef2f2' : '#f0fdf4',
                      color: invoice.status === 'UNPAID' ? '#dc2626' : '#16a34a',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 28,
                      px: 1.5
                    }}
                  />
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ mb: 2.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1.5
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        ประเภทการเช่า
                      </Typography>
                      <Chip
                        label={invoice.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                        size="small"
                        sx={{
                          bgcolor: invoice.rentType === 'daily' ? '#eff6ff' : '#fef9c3',
                          color: invoice.rentType === 'daily' ? '#1e40af' : '#a16207',
                          fontWeight: 600,
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1.5
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        วันที่สร้าง
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                        {formatDate(invoice.createdAt)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>ค่าเช่าห้อง</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                          {formatCurrency(invoice.baseRent)}
                        </Typography>
                      </Box>

                      {invoice.acFee > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>ค่าแอร์</Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                            {formatCurrency(invoice.acFee)}
                          </Typography>
                        </Box>
                      )}

                      {invoice.waterFee > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                            ค่าน้ำ ({invoice.waterUnit || 0} หน่วย × ฿{invoice.waterRate || 0})
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                            {formatCurrency(invoice.waterFee)}
                          </Typography>
                        </Box>
                      )}

                      {invoice.electricFee > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                            ค่าไฟ ({invoice.electricUnit || 0} หน่วย × ฿{invoice.electricRate || 0})
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                            {formatCurrency(invoice.electricFee)}
                          </Typography>
                        </Box>
                      )}

                      {invoice.rentalExtrasFee > 0 && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-start' }}>
                            <Box>
                              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 0.5 }}>
                                ค่าใช้จ่ายเพิ่มเติม
                              </Typography>
                              {invoice.rentalExtras && invoice.rentalExtras.length > 0 && (
                                <Box sx={{ pl: 1.5, mt: 0.5 }}>
                                  {invoice.rentalExtras.map((extra, index) => (
                                    <Typography 
                                      key={index} 
                                      sx={{ 
                                        fontSize: '0.75rem', 
                                        color: '#94a3b8',
                                        mb: 0.25
                                      }}
                                    >
                                      • {extra.extraName} ({extra.qty} × ฿{extra.unitPrice.toLocaleString()})
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Box>
                            <Typography sx={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>
                              {formatCurrency(invoice.rentalExtrasFee)}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: '#f8fafc'
                    }}>
                      <Typography sx={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>
                        ยอดรวมทั้งหมด
                      </Typography>
                      <Typography sx={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>
                        {formatCurrency(invoice.totalAmount)}
                      </Typography>
                    </Box>
                  </Box>

                  {invoice.status === 'UNPAID' ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handlePayment(invoice.invoiceId)}
                      sx={{
                        py: 1,
                        borderRadius: 1.5,
                        borderColor: '#16a34a',
                        bgcolor: '#ffffff',
                        color: '#16a34a',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#15803d',
                          bgcolor: '#f0fdf4',
                          color: '#15803d'
                        }
                      }}
                    >
                      ชำระเงิน
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled
                      sx={{
                        py: 1,
                        borderRadius: 1.5,
                        borderColor: '#e2e8f0',
                        color: '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'none'
                      }}
                    >
                      ชำระแล้ว
                    </Button>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withAuth(CustomerInvoices, 'CUSTOMER');