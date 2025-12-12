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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  if (!room) return <Typography sx={{ p: 4, textAlign: 'center', fontSize: 18 }}>ไม่พบข้อมูลการเช่า</Typography>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <Sidebar role="ADMIN" />
      <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
        <Paper sx={{
          p: 5,
          borderRadius: 4,
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
        }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f2f5f' }}>
              รายละเอียดการเช่าห้อง {room.roomNumber}
            </Typography>
            <Chip
              label={room.status.toUpperCase()}
              color={room.status === 'rented' ? 'warning' : 'success'}
              sx={{ fontWeight: 600, py: 0.5, px: 2, borderRadius: 2 }}
            />
          </Box>

          <Divider sx={{ mb: 5 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Room Info */}
            <Paper sx={{
              flex: 1,
              p: 4,
              borderRadius: 3,
              backgroundColor: '#f5f8ff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
            }}>
              <Typography sx={{ fontWeight: 700, mb: 3, color: '#0f2f5f' }}>ข้อมูลห้อง</Typography>
              <Stack spacing={2}>
                <Typography><strong>ชั้น:</strong> {room.floor}</Typography>
                <Typography><strong>แอร์:</strong> {room.hasAc ? '✅' : '❌'}</Typography>
                <Typography><strong>ราคา/วัน:</strong> {room.dailyRate} บาท</Typography>
                <Typography><strong>ราคา/เดือน:</strong> {room.monthlyRate} บาท</Typography>
              </Stack>
            </Paper>

            {/* Rental Info */}
            <Paper sx={{
              flex: 2,
              p: 5,
              borderRadius: 3,
              backgroundColor: '#f1f7ff',
              boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
            }}>
              {room.rentalInfo ? (
                <>
                  <Typography sx={{ fontWeight: 700, mb: 4, color: '#0f2f5f' }}>ข้อมูลผู้เช่า</Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="space-between">
                    <Stack spacing={1.5}>
                      <Typography><strong>ชื่อ:</strong> {room.rentalInfo.customerName}</Typography>
                      <Typography><strong>ประเภทเช่า:</strong> {room.rentalInfo.rentType}</Typography>
                      <Typography><strong>เข้า:</strong> {room.rentalInfo.checkinDate}</Typography>
                      <Typography><strong>ออก:</strong> {room.rentalInfo.checkoutDate}</Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                      <Typography><strong>ราคา:</strong> {room.rentalInfo.price} บาท</Typography>
                      <Typography><strong>ค่าแอร์:</strong> {room.rentalInfo.acFee} บาท</Typography>
                    </Stack>
                  </Stack>

                  {/* Extras */}
                  {room.rentalInfo.extras && room.rentalInfo.extras.length > 0 && (
                    <Box sx={{ mt: 5 }}>
                      <Typography sx={{ fontWeight: 600, mb: 2, color: '#0f2f5f' }}>รายการเสริม</Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        {room.rentalInfo.extras.map((e) => (
                          <Chip
                            key={e.id}
                            label={`${e.name} x${e.qty} = ${e.totalPrice} บาท`}
                            sx={{
                              backgroundColor: '#e8f4fd',
                              fontWeight: 500,
                              color: '#0f2f5f',
                              borderRadius: 2,
                              mb: 1
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </>
              ) : (
                <Typography sx={{ fontSize: 16, color: '#555' }}>ยังไม่มีข้อมูลการเช่า</Typography>
              )}
            </Paper>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(AdminRentalPage, 'ADMIN');
