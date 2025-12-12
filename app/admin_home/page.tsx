'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Chip
} from '@mui/material';
import Sidebar from '@/app/utils/components/Sidebar';
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
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('ไม่สามารถดึงข้อมูลห้องได้');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleEditClick = (roomId: number) => router.push(`/admin_editroom/${roomId}`);
  const handleRentClick = (roomId: number) => router.push(`/admin_rentroom/${roomId}`);

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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: "#f3f6fb" }}>
      <Sidebar role="ADMIN" />

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#20335c" }}>
          รายการห้องทั้งหมด
        </Typography>

        {rooms.length === 0 ? (
          <Typography>ไม่มีห้องในระบบ</Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
            }}
          >
            {rooms.map((room) => (
              <Paper
                key={room.roomId}
                sx={{
                  flex: '1 1 calc(25% - 16px)',
                  minWidth: 220,
                  maxWidth: 260,
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 6,
                  background: 'linear-gradient(to bottom right, #ffffff, #e3f2fd)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                    ห้อง {room.roomNumber}
                  </Typography>

                  <Typography>ชั้น: {room.floor}</Typography>

                  {/* ไม่แสดงข้อมูลถ้าเป็น rented */}
                  {room.status !== "rented" && (
                    <>
                      <Typography>แอร์: {room.hasAc ? "✅" : "❌"}</Typography>
                      <Typography>ราคา/วัน: {room.dailyRate}</Typography>
                      <Typography>ราคา/เดือน: {room.monthlyRate}</Typography>
                    </>
                  )}

                  <Box sx={{ mt: 1 }}>
                    <Chip label={room.status} color={getStatusColor(room.status)} />
                  </Box>

                  {/*  แสดงข้อมูลการเช่าเฉพาะ rented */}
                  {room.status === "rented" && room.rentalInfo && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#e1f5fe",
                        border: "1px solid #81d4fa"
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>ข้อมูลการเช่า</Typography>
                      <Typography>ผู้เช่า: {room.rentalInfo.customerName}</Typography>
                      <Typography>ประเภท: {room.rentalInfo.rentType}</Typography>
                      <Typography>เข้า: {room.rentalInfo.checkinDate}</Typography>
                      <Typography>ออก: {room.rentalInfo.checkoutDate}</Typography>
                    </Box>
                  )}
                </Box>

                {/* ปุ่มด้านล่าง */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: "wrap" }}>
                  
                  {/* ปุ่มเช่า: แสดงเฉพาะ available */}
                  {room.status === "available" && (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#388e3c" },
                        textTransform: "none",
                        flex: 1
                      }}
                      onClick={() => handleRentClick(room.roomId)}
                    >
                      เช่า
                    </Button>
                  )}

                  {room.status !== "rented" && (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#20335c",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#2a50a2" },
                          textTransform: "none",
                          flex: 1
                        }}
                        onClick={() => handleEditClick(room.roomId)}
                      >
                        แก้ไข
                      </Button>

                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#d32f2f",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#b71c1c" },
                          textTransform: "none",
                          flex: 1
                        }}
                        onClick={() => handleDelete(room.roomId)}
                      >
                        ลบ
                      </Button>
                    </>
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
