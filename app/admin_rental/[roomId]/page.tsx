'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, Chip, Stack, Divider, Button } from '@mui/material';
import Sidebar from '@/app/utils/components/sidebar';
import withAuth from "@/app/utils/hocs/withAuth";

interface RentalExtra {
  id: number;
  extraId: number;
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

interface RentalInfo {
  rentalId: number;
  customerName: string;
  rentType: string;
  checkinDate: string;
  checkoutDate: string;
  price: number;
  acFee: number;
  dailyRate: number;
  monthlyRate: number;
  hasAc: boolean;
  extras: RentalExtra[];
  extrasTotal: number;
}

interface RoomRental {
  roomId: number;
  roomNumber: string;
  floor: number;
  hasAc: boolean;
  dailyRate: number;
  monthlyRate: number;
  status: string;
  rentalInfo: RentalInfo | null;
}

const AdminRentalPage: React.FC = () => {
  const { roomId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomRental | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomRental = async () => {
      try {
        const response = await axios.get<RoomRental>(`http://localhost:8081/api/rentals/${roomId}`);
        setRoom(response.data);
      } catch (error: any) {
        console.error(error);
        alert(error?.response?.data?.message || 'ไม่สามารถดึงข้อมูลการเช่าได้');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchRoomRental();
  }, [roomId, router]);

  if (loading) return (
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

  if (!room) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <Paper sx={{ 
        p: 6, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <Typography sx={{ fontSize: 16, color: '#6c757d', fontWeight: 500 }}>
          ไม่พบข้อมูลการเช่า
        </Typography>
      </Paper>
    </Box>
  );

  const calculateTotal = () => {
    if (!room.rentalInfo) return 0;
    const roomPrice = (room.rentalInfo.price - room.rentalInfo.extrasTotal) || 0;
    const acFee = room.rentalInfo.acFee || 0;
    const extrasTotal = room.rentalInfo.extrasTotal || 0;
    return roomPrice + acFee + extrasTotal;
  };

  const totalAmount = calculateTotal();

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
        <Paper sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
          backgroundColor: '#fff'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 5,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  color: '#2c3e50',
                  letterSpacing: '-0.5px',
                  mb: 0.5
                }}
              >
                ห้อง {room.roomNumber}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 400 }}>
                รายละเอียดการเช่า
              </Typography>
            </Box>
            <Chip
              label={room.status === 'rented' ? 'ให้เช่าแล้ว' : 'ว่าง'}
              sx={{
                px: 3,
                py: 3,
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: room.status === 'rented' ? '#f59e0b' : '#10b981',
                color: '#fff',
                boxShadow: room.status === 'rented' 
                  ? '0 2px 8px rgba(245, 158, 11, 0.3)' 
                  : '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            />
          </Box>

          <Divider sx={{ mb: 5, borderColor: '#e9ecef' }} />

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' },
            gap: 4
          }}>
            <Paper sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: '#f8f9fa',
              border: '1px solid #e9ecef',
              boxShadow: 'none'
            }}>
              <Typography sx={{ 
                fontWeight: 600, 
                mb: 4, 
                color: '#2c3e50',
                fontSize: '1.1rem',
                letterSpacing: '-0.3px'
              }}>
                ข้อมูลห้อง
              </Typography>
              <Stack spacing={3}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderColor: '#dee2e6'
                  }
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ชั้น
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#2c3e50' }}>
                    {room.floor}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderColor: '#dee2e6'
                  }
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    เครื่องปรับอากาศ
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#2c3e50' }}>
                    {room.hasAc ? 'มี' : 'ไม่มี'}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderColor: '#10b981'
                  }
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ราคารายวัน
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#10b981', letterSpacing: '-0.5px' }}>
                    ฿{room.dailyRate.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderColor: '#f59e0b'
                  }
                }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ราคารายเดือน
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#f59e0b', letterSpacing: '-0.5px' }}>
                    ฿{room.monthlyRate.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{
              p: { xs: 4, md: 5 },
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.04)'
            }}>
              {room.rentalInfo ? (
                <>
                  <Typography sx={{ 
                    fontWeight: 600, 
                    mb: 4, 
                    fontSize: '1.1rem',
                    color: '#2c3e50',
                    letterSpacing: '-0.3px'
                  }}>
                    ข้อมูลผู้เช่า
                  </Typography>

                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 4,
                    mb: 5
                  }}>
                    <Stack spacing={3}>
                      <Box sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef'
                      }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ชื่อผู้เช่า
                        </Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: '#2c3e50' }}>
                          {room.rentalInfo.customerName}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef'
                      }}>
                        <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ประเภทการเช่า
                        </Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: '#2c3e50' }}>
                          {room.rentalInfo.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                        </Typography>
                      </Box>

                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 2
                      }}>
                        <Box sx={{
                          p: 2.5,
                          borderRadius: 2,
                          backgroundColor: '#ecfdf5',
                          border: '1px solid #a7f3d0'
                        }}>
                          <Typography sx={{ fontSize: '0.7rem', color: '#059669', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            วันที่เข้า
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857' }}>
                            {room.rentalInfo.checkinDate}
                          </Typography>
                        </Box>

                        <Box sx={{
                          p: 2.5,
                          borderRadius: 2,
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca'
                        }}>
                          <Typography sx={{ fontSize: '0.7rem', color: '#dc2626', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            วันที่ออก
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#b91c1c' }}>
                            {room.rentalInfo.checkoutDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                    <Box>
                      <Box sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef'
                      }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: 600, mb: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          รายละเอียดค่าใช้จ่าย
                        </Typography>
                        <Stack spacing={2.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ color: '#6c757d', fontSize: '0.95rem', fontWeight: 500 }}>ค่าห้อง</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>
                              ฿{(room.rentalInfo.price - room.rentalInfo.extrasTotal).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ color: '#6c757d', fontSize: '0.95rem', fontWeight: 500 }}>ค่าแอร์</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>
                              ฿{room.rentalInfo.acFee.toLocaleString()}
                            </Typography>
                          </Box>
                          {room.rentalInfo.extrasTotal > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography sx={{ color: '#6c757d', fontSize: '0.95rem', fontWeight: 500 }}>รายการเสริม</Typography>
                              <Typography sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '1rem' }}>
                                ฿{room.rentalInfo.extrasTotal.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                          <Divider sx={{ my: 1.5, borderColor: '#dee2e6' }} />
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2.5,
                            mt: 1,
                            borderRadius: 2,
                            backgroundColor: '#2c3e50'
                          }}>
                            <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                              ยอดรวมทั้งหมด
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '1.6rem', 
                              fontWeight: 700,
                              color: '#fff',
                              letterSpacing: '-0.5px'
                            }}>
                              ฿{totalAmount.toLocaleString()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>

                  {room.rentalInfo.extras && room.rentalInfo.extras.length > 0 && (
                    <Box sx={{ 
                      mt: 5,
                      p: 4,
                      borderRadius: 3,
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography sx={{ 
                        fontWeight: 600, 
                        mb: 3, 
                        color: '#2c3e50',
                        fontSize: '1rem'
                      }}>
                        รายการเสริม
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2
                      }}>
                        {room.rentalInfo.extras.map((e) => (
                          <Chip
                            key={e.id}
                            label={`${e.name} ×${e.qty} = ฿${e.totalPrice.toLocaleString()}`}
                            sx={{
                              px: 2.5,
                              py: 3,
                              backgroundColor: '#fff',
                              border: '1px solid #dee2e6',
                              fontWeight: 600,
                              color: '#2c3e50',
                              borderRadius: 2,
                              fontSize: '0.875rem',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: '#2c3e50',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  color: '#adb5bd'
                }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                    ยังไม่มีข้อมูลการเช่า
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminRentalPage, 'ADMIN');