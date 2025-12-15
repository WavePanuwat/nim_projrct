'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper, Chip, Stack, Divider } from '@mui/material';
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
      bgcolor: '#f8fafc'
    }}>
      <CircularProgress sx={{ color: '#1e293b' }} size={40} thickness={4} />
    </Box>
  );

  if (!room) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      bgcolor: '#f8fafc'
    }}>
      <Paper sx={{ 
        p: 4, 
        borderRadius: 2, 
        boxShadow: 'none',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff'
      }}>
        <Typography sx={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
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
      bgcolor: '#f8fafc'
    }}>
      <Sidebar role="ADMIN" />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2.5, md: 4 },
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%'
      }}>
        <Paper sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
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
                ห้อง {room.roomNumber}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 400
                }}
              >
                รายละเอียดการเช่า
              </Typography>
            </Box>
            <Chip
              label={room.status === 'rented' ? 'ให้เช่าแล้ว' : 'ว่าง'}
              sx={{
                px: 2,
                height: 28,
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 1.5,
                bgcolor: room.status === 'rented' ? '#eab308' : '#22c55e',
                color: '#ffffff',
                boxShadow: room.status === 'rented' ? '0 2px 8px rgba(234, 179, 8, 0.3)' : '0 2px 8px rgba(34, 197, 94, 0.3)'
              }}
            />
          </Box>

          <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' },
            gap: 3
          }}>
            <Paper sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              boxShadow: 'none',
              height: 'fit-content'
            }}>
              <Typography sx={{ 
                fontWeight: 700, 
                mb: 2.5, 
                color: '#0f172a',
                fontSize: '0.9rem',
                letterSpacing: '-0.01em'
              }}>
                ข้อมูลห้อง
              </Typography>
              <Stack spacing={2}>
                <Box sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }
                }}>
                  <Typography sx={{ 
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ชั้น
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                    {room.floor}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }
                }}>
                  <Typography sx={{ 
                    fontSize: '0.65rem',
                    color: '#94a3b8',
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    แอร์
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                    {room.hasAc ? 'มี' : 'ไม่มี'}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#dcfce7',
                    borderColor: '#86efac'
                  }
                }}>
                  <Typography sx={{ 
                    fontSize: '0.65rem',
                    color: '#16a34a',
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    รายวัน
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#15803d',
                    letterSpacing: '-0.01em'
                  }}>
                    ฿{room.dailyRate.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: '#fef9c3',
                  border: '1px solid #fde047',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#fef08a',
                    borderColor: '#facc15'
                  }
                }}>
                  <Typography sx={{ 
                    fontSize: '0.65rem',
                    color: '#a16207',
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    รายเดือน
                  </Typography>
                  <Typography sx={{ 
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#ca8a04',
                    letterSpacing: '-0.01em'
                  }}>
                    ฿{room.monthlyRate.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Box>
              {room.rentalInfo ? (
                <>
                  <Typography sx={{ 
                    fontWeight: 700, 
                    mb: 2.5, 
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    letterSpacing: '-0.01em'
                  }}>
                    ข้อมูลผู้เช่า
                  </Typography>

                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 2.5,
                    mb: 3
                  }}>
                    <Stack spacing={2}>
                      <Box sx={{
                        p: 2.5,
                        borderRadius: 1.5,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography sx={{ 
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          mb: 0.5,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          ชื่อผู้เช่า
                        </Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                          {room.rentalInfo.customerName}
                        </Typography>
                      </Box>

                      <Box sx={{
                        p: 2.5,
                        borderRadius: 1.5,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography sx={{ 
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          mb: 0.5,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          ประเภท
                        </Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                          {room.rentalInfo.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                        </Typography>
                      </Box>

                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1.5
                      }}>
                        <Box sx={{
                          p: 2,
                          borderRadius: 1.5,
                          bgcolor: '#f0fdf4',
                          border: '1px solid #bbf7d0'
                        }}>
                          <Typography sx={{ 
                            fontSize: '0.65rem',
                            color: '#16a34a',
                            mb: 0.5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            เข้า
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#15803d' }}>
                            {room.rentalInfo.checkinDate}
                          </Typography>
                        </Box>

                        <Box sx={{
                          p: 2,
                          borderRadius: 1.5,
                          bgcolor: '#fef2f2',
                          border: '1px solid #fecaca'
                        }}>
                          <Typography sx={{ 
                            fontSize: '0.65rem',
                            color: '#dc2626',
                            mb: 0.5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            ออก
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#b91c1c' }}>
                            {room.rentalInfo.checkoutDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>

                    <Box>
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: 1.5,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        height: '100%'
                      }}>
                        <Typography sx={{ 
                          fontSize: '0.65rem',
                          color: '#94a3b8',
                          fontWeight: 600,
                          mb: 2.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          ค่าใช้จ่าย
                        </Typography>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                              ค่าห้อง
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                              ฿{(room.rentalInfo.price - room.rentalInfo.extrasTotal).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                              ค่าแอร์
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                              ฿{room.rentalInfo.acFee.toLocaleString()}
                            </Typography>
                          </Box>
                          {room.rentalInfo.extrasTotal > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                                รายการเสริม
                              </Typography>
                              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                                ฿{room.rentalInfo.extrasTotal.toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                          <Divider sx={{ my: 0.5, borderColor: '#e2e8f0' }} />
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2.5,
                            mt: 1,
                            borderRadius: 1.5,
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
                          }}>
                            <Typography sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                              ยอดรวม
                            </Typography>
                            <Typography sx={{ 
                              fontSize: '1.25rem', 
                              fontWeight: 700,
                              color: '#ffffff',
                              letterSpacing: '-0.02em'
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
                      mt: 3,
                      p: 3,
                      borderRadius: 1.5,
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <Typography sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        color: '#0f172a',
                        fontSize: '0.85rem'
                      }}>
                        รายการเสริม
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5
                      }}>
                        {room.rentalInfo.extras.map((e) => (
                          <Chip
                            key={e.id}
                            label={`${e.name} ×${e.qty} = ฿${e.totalPrice.toLocaleString()}`}
                            sx={{
                              px: 2,
                              height: 30,
                              bgcolor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              fontWeight: 600,
                              color: '#0f172a',
                              borderRadius: 1.5,
                              fontSize: '0.75rem',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                borderColor: '#64748b',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
                  py: 10,
                  color: '#94a3b8'
                }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    ยังไม่มีข้อมูลการเช่า
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminRentalPage, 'ADMIN');