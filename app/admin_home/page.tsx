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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
      case "rented": return "warning";
      case "maintenance": return "default";
      default: return "default";
    }
  }

  if (!userSession || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: "#f0f3f7" }}>
      <Sidebar role="ADMIN" />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {/* Header + Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#20335c" }}>
            รายการห้องทั้งหมด
          </Typography>
          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel>กรองสถานะ</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="กรองสถานะ"
            >
              <MenuItem value="All">ทั้งหมด</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="rented">Rented</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredRooms.length === 0 ? (
          <Typography>ไม่มีห้องในระบบ</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 3,
            }}
          >
            {filteredRooms.map((room) => (
              <Paper
                key={room.roomId}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  minHeight: 240,
                  transition: '0.2s',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }
                }}
              >
                {/* Status Chip Top-Right */}
                <Chip
                  label={room.status}
                  color={getStatusColor(room.status)}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    position: 'absolute',
                    top: 16,
                    right: 16
                  }}
                />

                {/* Room Number */}
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#123a63", mb: 1 }}>
                  ห้อง {room.roomNumber}
                </Typography>

                {/* Room Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ mb: 0.5 }}>ชั้น: {room.floor}</Typography>
                  {room.status !== "rented" && (
                    <>
                      <Typography sx={{ mb: 0.5 }}>แอร์: {room.hasAc ? "✅" : "❌"}</Typography>
                      <Typography sx={{ mb: 0.5 }}>ราคา/วัน: {room.dailyRate}</Typography>
                      <Typography sx={{ mb: 0.5 }}>ราคา/เดือน: {room.monthlyRate}</Typography>
                    </>
                  )}
                  {room.status === "rented" && room.rentalInfo && (
                    <Box
                      sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "#eaf4fc",
                        border: "1px solid #90caf9"
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>ข้อมูลการเช่า</Typography>
                      <Typography variant="body2">ผู้เช่า: {room.rentalInfo.customerName}</Typography>
                      <Typography variant="body2">ประเภท: {room.rentalInfo.rentType}</Typography>
                      <Typography variant="body2">เข้า: {room.rentalInfo.checkinDate}</Typography>
                      <Typography variant="body2">ออก: {room.rentalInfo.checkoutDate}</Typography>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {room.status === "available" && (
                    <Button
                      variant="contained"
                      sx={{ flex: 1, backgroundColor: "#4caf50", color: "#fff", "&:hover": { backgroundColor: "#388e3c" }, textTransform: "none" }}
                      onClick={() => handleRentClick(room.roomId)}
                    >
                      เช่า
                    </Button>
                  )}
                  {room.status !== "rented" && (
                    <>
                      <Button
                        variant="contained"
                        sx={{ flex: 1, backgroundColor: "#1c4e80", color: "#fff", "&:hover": { backgroundColor: "#123a63" }, textTransform: "none" }}
                        onClick={() => handleEditClick(room.roomId)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ flex: 1, backgroundColor: "#d32f2f", color: "#fff", "&:hover": { backgroundColor: "#b71c1c" }, textTransform: "none" }}
                        onClick={() => handleDelete(room.roomId)}
                      >
                        ลบ
                      </Button>
                    </>
                  )}
                  {room.status === "rented" && (
                    <Button
                      variant="outlined"
                      sx={{ flex: 1, borderColor: "#1976d2", color: "#1976d2", "&:hover": { backgroundColor: "#e3f2fd" }, textTransform: "none" }}
                      onClick={() => handleViewRental(room.roomId)}
                    >
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
