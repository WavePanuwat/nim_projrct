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
import Sidebar from '@/app/utils/components/sidebar';
import { useRouter } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface RentalInfo {
  customerName: string;
  rentType: string;
  checkinDate: string;
  checkoutDate: string;
}

interface Room {
  roomId: number;
  roomNumber: string;
  floor: number;
  hasAc: boolean;
  dailyRate: number;
  monthlyRate: number;
  status: string;
  rentalInfo?: RentalInfo | null;
}

const AdminHome: React.FC = () => {
  const [userSession, setUserSession] = useState<{ role: 'ADMIN'; userData: { username: string } } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const router = useRouter();

  const formatThaiDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role !== 'ADMIN') router.push('/login');
      else setUserSession(parsed);
    } else router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<Room[]>('http://localhost:8081/api/rooms/list');
        setRooms(response.data);
        setFilteredRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('ไม่สามารถดึงข้อมูลห้องได้');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (statusFilter === 'All') setFilteredRooms(rooms);
    else setFilteredRooms(rooms.filter(r => r.status === statusFilter));
  }, [statusFilter, rooms]);

  const handleEditClick = (roomId: number) => router.push(`/admin_editroom/${roomId}`);
  const handleRentClick = (roomId: number) => router.push(`/admin_rentroom/${roomId}`);
  const handleViewRental = (roomId: number) => router.push(`/admin_rental/${roomId}`);
  const handleDelete = async (roomId: number) => {
    if (!confirm("คุณต้องการลบห้องนี้จริงหรือไม่?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/rooms/delete/${roomId}`);
      setRooms(rooms.filter(r => r.roomId !== roomId));
      alert("ลบห้องเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("เกิดข้อผิดพลาดในการลบห้อง");
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
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e', letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
              รายการห้องพัก
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 400, fontSize: '0.875rem' }}>
              จัดการและติดตามสถานะห้องพักทั้งหมด
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>กรองสถานะ</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="กรองสถานะ">
              <MenuItem value="All">ทั้งหมด</MenuItem>
              <MenuItem value="available">ว่าง</MenuItem>
              <MenuItem value="rented">ให้เช่าแล้ว</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredRooms.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem' }}>
              ไม่พบห้องในระบบ
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' }, gap: 2 }}>
            {filteredRooms.map((room) => (
              <Paper key={room.roomId} sx={{ borderRadius: 2, bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #f1f5f9', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, pb: 1.5, bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a2e', letterSpacing: '-0.01em', mb: 0.25, fontSize: '1rem' }}>
                      ห้อง {room.roomNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                      ชั้น {room.floor}
                    </Typography>
                  </Box>
                  <Chip
                    label={room.status === 'available' ? 'ว่าง' : room.status === 'rented' ? 'ให้เช่าแล้ว' : room.status}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: room.status === 'available' ? '#22c55e' : room.status === 'rented' ? '#eab308' : '#64748b',
                      color: '#ffffff',
                      '& .MuiChip-label': { px: 1.25 }
                    }}
                  />
                </Box>

                <Box sx={{ p: 2, flexGrow: 1 }}>
                  {room.status !== "rented" && (
                    <Box>
                      <Box sx={{ mb: 2, p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          เครื่องปรับอากาศ
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.875rem' }}>
                          {room.hasAc ? 'มี' : 'ไม่มี'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            รายวัน
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                            ฿{room.dailyRate.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            รายเดือน
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem', letterSpacing: '-0.01em' }}>
                            ฿{room.monthlyRate.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {room.status === "rented" && room.rentalInfo && (
                    <Box>
                      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ผู้เช่า
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.875rem' }}>
                          {room.rentalInfo.customerName}
                        </Typography>
                      </Box>

                      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', mb: 1.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          ประเภท
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.875rem' }}>
                          {room.rentalInfo.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 1.5, bgcolor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: '#16a34a', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            เข้า
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.8rem' }}>
                            {formatThaiDate(room.rentalInfo.checkinDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 1.5, borderRadius: 1.5, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                          <Typography sx={{ fontSize: '0.65rem', color: '#dc2626', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ออก
                          </Typography>
                          <Typography sx={{ fontWeight: 700, color: '#b91c1c', fontSize: '0.8rem' }}>
                            {formatThaiDate(room.rentalInfo.checkoutDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {room.status === "available" && (
                    <Button variant="contained" fullWidth sx={{ py: 0.875, borderRadius: 1.5, bgcolor: '#1a1a2e', color: '#ffffff', fontSize: '0.875rem' }} onClick={() => handleRentClick(room.roomId)}>
                      เช่าห้องนี้
                    </Button>
                  )}

                  {room.status !== "rented" && (
                    <>
                      <Button variant="outlined" sx={{ flex: 1, py: 0.875, fontSize: '0.875rem' }} onClick={() => handleEditClick(room.roomId)}>แก้ไข</Button>
                      <Button variant="outlined" sx={{ flex: 1, py: 0.875, color: '#dc2626', borderColor: '#dc2626', fontSize: '0.875rem', '&:over': { borderColor: '#b91c1c', bgcolor: '#fef2f2' } }} onClick={() => handleDelete(room.roomId)}>ลบ</Button>
                    </>
                  )}

                  {room.status === "rented" && (
                    <Button variant="outlined" fullWidth sx={{ py: 0.875, borderRadius: 1.5, fontSize: '0.875rem' }} onClick={() => handleViewRental(room.roomId)}>
                      ดูรายละเอียด
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

export default withAuth(AdminHome, "ADMIN");