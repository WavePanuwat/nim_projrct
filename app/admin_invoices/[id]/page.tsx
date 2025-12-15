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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Sidebar from '@/app/utils/components/sidebar';
import { useRouter, useParams } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface RentalExtraInfo {
  extraName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  chargeType: string;
}

interface InvoiceDetail {
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

const AdminInvoiceDetail: React.FC = () => {
  const [userSession, setUserSession] = useState<{ role: 'ADMIN'; userData: { username: string } } | null>(null);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id;

  useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role !== 'ADMIN') router.push('/login');
      else setUserSession(parsed);
    } else router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      
      try {
        const response = await axios.get<InvoiceDetail>(
          `http://localhost:8081/api/invoices/${invoiceId}`
        );
        setInvoice(response.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setError('ไม่สามารถดึงข้อมูลใบแจ้งหนี้ได้');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [invoiceId]);

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

  const handlePrint = () => {
    window.print();
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

  if (error || !invoice) {
    return (
      <Box sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#f8fafc'
      }}>
        <Sidebar role="ADMIN" />
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Button
            onClick={() => router.push('/admin_invoices')}
            sx={{ mb: 2, color: '#64748b', textTransform: 'none', fontWeight: 500, fontSize: '0.85rem' }}
          >
            ← กลับไปหน้ารายการใบแจ้งหนี้
          </Button>
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ color: '#ef4444', fontSize: '0.95rem' }}>
              {error || 'ไม่พบข้อมูลใบแจ้งหนี้'}
            </Typography>
          </Paper>
        </Box>
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
        p: { xs: 2, md: 3 },
        maxWidth: '900px',
        mx: 'auto',
        width: '100%'
      }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
                ใบแจ้งหนี้ #{invoice.invoiceId}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                รายละเอียดใบแจ้งหนี้และค่าใช้จ่ายทั้งหมด
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={handlePrint}
              sx={{
                py: 0.875,
                px: 2,
                borderRadius: 1.5,
                borderColor: '#e2e8f0',
                color: '#0f172a',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.8rem',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  bgcolor: '#f8fafc'
                }
              }}
            >
              พิมพ์ใบแจ้งหนี้
            </Button>
          </Box>
        </Box>

        <Paper sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: '#fff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          mb: 2.5
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            flexWrap: 'wrap',
            gap: 2
          }}>
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
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
              วันที่สร้าง: {formatDate(invoice.createdAt)}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: '#e2e8f0' }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
              ข้อมูลการเช่า
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5
            }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 600, fontSize: '0.75rem' }}>
                  หมายเลขห้อง
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                  {invoice.roomNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 600, fontSize: '0.75rem' }}>
                  ชื่อลูกค้า
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                  {invoice.customerName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 600, fontSize: '0.75rem' }}>
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
                    fontSize: '0.75rem',
                    mt: 0.5
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 600, fontSize: '0.75rem' }}>
                  ระยะเวลา
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                  {formatDate(invoice.startDate)}
                  {invoice.endDate && ` - ${formatDate(invoice.endDate)}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2.5, borderColor: '#e2e8f0' }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
              รายละเอียดค่าใช้จ่าย
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem', py: 1.25 }}>รายการ</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem', py: 1.25 }}>จำนวน</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem', py: 1.25 }}>ราคา/หน่วย</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.75rem', py: 1.25 }}>ยอดรวม</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1.25 }}>ค่าเช่าห้อง ({invoice.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'})</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>1</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.baseRent)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.baseRent)}</TableCell>
                  </TableRow>

                  {invoice.acFee > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1.25 }}>ค่าเครื่องปรับอากาศ</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>1</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.acFee)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.acFee)}</TableCell>
                    </TableRow>
                  )}

                  {invoice.waterUnit > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1.25 }}>ค่าน้ำประปา</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{invoice.waterUnit} ยูนิต</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.waterRate)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.waterFee)}</TableCell>
                    </TableRow>
                  )}

                  {invoice.electricUnit > 0 && (
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1.25 }}>ค่าไฟฟ้า</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{invoice.electricUnit} ยูนิต</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.electricRate)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(invoice.electricFee)}</TableCell>
                    </TableRow>
                  )}

                  {invoice.rentalExtras && invoice.rentalExtras.length > 0 && (
                    invoice.rentalExtras.map((extra, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '0.8rem', py: 1.25 }}>{extra.extraName} ({extra.chargeType === 'monthly' ? 'รายเดือน' : 'ครั้งเดียว'})</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{extra.qty}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(extra.unitPrice)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8rem', py: 1.25 }}>{formatCurrency(extra.totalPrice)}</TableCell>
                      </TableRow>
                    ))
                  )}

                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      borderTop: '2px solid #e2e8f0',
                      pt: 2,
                      py: 1.5
                    }}>
                      ยอดรวมทั้งหมด
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 700, 
                      fontSize: '1.15rem',
                      color: '#0f172a',
                      borderTop: '2px solid #e2e8f0',
                      pt: 2,
                      py: 1.5
                    }}>
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminInvoiceDetail, "ADMIN");