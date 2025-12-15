'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Visibility, Add } from '@mui/icons-material';
import Sidebar from '@/app/utils/components/sidebar';
import { useRouter } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface RentalExtraInfo {
  extraName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  chargeType: string;
}

interface Invoice {
  invoiceId: number;
  rentalId: number;
  roomNumber: string;
  customerName: string;
  rentType: string;
  baseRent: number;
  acFee: number;
  waterUnit: number;
  waterRate: number;
  waterFee: number;
  electricUnit: number;
  electricRate: number;
  electricFee: number;
  rentalExtras: RentalExtraInfo[];
  rentalExtrasFee: number;
  totalAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const AdminInvoices: React.FC = () => {
  const [userSession, setUserSession] = useState<{ role: 'ADMIN'; userData: { username: string } } | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
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
    const fetchInvoices = async () => {
      try {
        const response = await axios.get<Invoice[]>('http://localhost:8081/api/invoices/list');
        setInvoices(response.data);
        setFilteredInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        alert('ไม่สามารถดึงข้อมูลใบแจ้งหนี้ได้');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(inv => inv.status === statusFilter));
    }
  }, [statusFilter, invoices]);

  const handleViewDetails = (invoiceId: number) => {
    router.push(`/admin_invoices/${invoiceId}`);
  };

  const handleCreateInvoice = () => {
    router.push('/admin_createinvoice');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`;
  };

  if (!userSession || loading) {
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
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f8fafc'
    }}>
      <Sidebar role="ADMIN" />
      
      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2.5, md: 3.5 },
        maxWidth: '1500px',
        mx: 'auto',
        width: '100%'
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          flexWrap: 'wrap',
          gap: 2
        }}>
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
              ใบแจ้งหนี้
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.8rem'
              }}
            >
              จัดการและติดตามใบแจ้งหนี้ทั้งหมด
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>กรองสถานะ</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="กรองสถานะ"
                sx={{ fontSize: '0.8rem' }}
              >
                <MenuItem value="All" sx={{ fontSize: '0.8rem' }}>ทั้งหมด</MenuItem>
                <MenuItem value="UNPAID" sx={{ fontSize: '0.8rem' }}>ยังไม่ชำระ</MenuItem>
                <MenuItem value="PAID" sx={{ fontSize: '0.8rem' }}>ชำระแล้ว</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Add sx={{ fontSize: '1rem' }} />}
              onClick={handleCreateInvoice}
              sx={{
                py: 0.75,
                px: 1.75,
                borderRadius: 1.5,
                bgcolor: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1e293b',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.2)'
                }
              }}
            >
              สร้างใบแจ้งหนี้
            </Button>
          </Box>
        </Box>

        {filteredInvoices.length === 0 ? (
          <Paper sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: '#ffffff',
            boxShadow: 'none',
            border: '1px solid #e2e8f0'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#94a3b8',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}
            >
              ไม่พบใบแจ้งหนี้
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(auto-fill, minmax(260px, 1fr))'
              },
              gap: 2,
            }}
          >
            {filteredInvoices.map((invoice) => (
              <Paper
                key={invoice.invoiceId}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    borderColor: '#cbd5e1'
                  }
                }}
              >
                <Box sx={{
                  p: 1.75,
                  pb: 1.5,
                  bgcolor: '#ffffff',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.65rem',
                        color: '#94a3b8',
                        mb: 0.25,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      เลขที่
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#0f172a',
                        letterSpacing: '-0.01em',
                        fontSize: '0.95rem'
                      }}
                    >
                      #{invoice.invoiceId}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={invoice.status === 'UNPAID' ? 'ยังไม่ชำระ' : 'ชำระแล้ว'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: invoice.status === 'UNPAID' ? '#ef4444' : '#22c55e',
                      color: '#ffffff',
                      '& .MuiChip-label': { px: 1.25 }
                    }}
                  />
                </Box>

                <Box sx={{ p: 1.75, flexGrow: 1 }}>
                  <Box sx={{ mb: 1.75 }}>
                    <Box sx={{
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: 1.25,
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <Typography 
                        sx={{ 
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          mb: 0.25,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        หมายเลขห้อง
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: '#0f172a',
                          fontSize: '0.85rem'
                        }}
                      >
                        {invoice.roomNumber}
                      </Typography>
                    </Box>

                    <Box sx={{
                      p: 1.5,
                      borderRadius: 1.25,
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      mb: 1.5
                    }}>
                      <Typography 
                        sx={{ 
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          mb: 0.25,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        ชื่อลูกค้า
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: '#0f172a',
                          fontSize: '0.85rem'
                        }}
                      >
                        {invoice.customerName}
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 1.5
                    }}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: 1.25,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography 
                          sx={{ 
                            fontSize: '0.65rem',
                            color: '#94a3b8',
                            mb: 0.25,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          ประเภท
                        </Typography>
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            color: '#0f172a',
                            fontSize: '0.8rem'
                          }}
                        >
                          {invoice.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 1.5,
                        borderRadius: 1.25,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography 
                          sx={{ 
                            fontSize: '0.65rem',
                            color: '#94a3b8',
                            mb: 0.25,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          วันที่สร้าง
                        </Typography>
                        <Typography 
                          sx={{ 
                            fontWeight: 600,
                            color: '#0f172a',
                            fontSize: '0.75rem'
                          }}
                        >
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{
                    p: 1.75,
                    borderRadius: 1.25,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography 
                      sx={{ 
                        color: '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      ยอดรวม
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {formatCurrency(invoice.totalAmount)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 1.75, pt: 0 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewDetails(invoice.invoiceId)}
                    sx={{
                      py: 0.875,
                      borderRadius: 1.25,
                      borderColor: '#3b82f6',
                      bgcolor: '#ffffff',
                      color: '#3b82f6',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#2563eb',
                        bgcolor: '#eff6ff',
                        color: '#2563eb'
                      }
                    }}
                  >
                    ดูรายละเอียด
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withAuth(AdminInvoices, "ADMIN");