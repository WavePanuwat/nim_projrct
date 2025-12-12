'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import Sidebar from '@/app/utils/components/Sidebar';
import { useRouter } from 'next/navigation';
import withAuth from "@/app/utils/hocs/withAuth";

interface Room {
  roomId: number;
  roomNumber: string;
  floor: number;
  hasAc: boolean;
  dailyRate: number;
  monthlyRate: number;
  status: string;
}

const CustomerHome: React.FC = () => {
  const [userSession, setUserSession] = useState<{ role: 'CUSTOMER'; userData: { username: string } } | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.role !== 'CUSTOMER') router.push('/login');
      else setUserSession(parsed);
    } else router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get<Room[]>('http://localhost:8081/api/rooms/list');
        const availableRooms = response.data.filter(room => room.status === "available");
        setRooms(availableRooms);

      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('ไม่สามารถดึงข้อมูลห้องได้');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "success";
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
      <Sidebar role="CUSTOMER" />

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#20335c" }}>
          ห้องที่ว่างอยู่
        </Typography>

        {rooms.length === 0 ? (
          <Typography>ไม่มีห้องว่างในขณะนี้</Typography>
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
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                    ห้อง {room.roomNumber}
                  </Typography>

                  <Typography>ชั้น: {room.floor}</Typography>
                  <Typography>แอร์: {room.hasAc ? "✅" : "❌"}</Typography>
                  <Typography>ราคา/วัน: {room.dailyRate}</Typography>
                  <Typography>ราคา/เดือน: {room.monthlyRate}</Typography>

                  <Box sx={{ mt: 1 }}>
                    <Chip label={room.status} color={getStatusColor(room.status)} />
                  </Box>
                </Box>

              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withAuth(CustomerHome, "CUSTOMER");
