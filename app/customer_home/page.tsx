'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Button
} from '@mui/material';
import Sidebar from '@/app/utils/components/sidebar';
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

  if (!userSession || loading) {
    return (
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
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
    }}>
      <Sidebar role="CUSTOMER" />

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 5,
        '@media (max-width: 600px)': { p: 3 }
      }}>
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600,
              color: '#2c3e50',
              letterSpacing: '-0.5px',
              mb: 0.5
            }}
          >
            ห้องพักว่าง
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 400 }}>
            {rooms.length} ห้องพร้อมให้บริการ
          </Typography>
        </Box>

        {rooms.length === 0 ? (
          <Paper sx={{ 
            p: 10, 
            textAlign: 'center', 
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Typography variant="h6" sx={{ color: '#adb5bd', fontWeight: 500 }}>
              ไม่มีห้องว่างในขณะนี้
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 3,
            }}
          >
            {rooms.map((room) => (
              <Paper
                key={room.roomId}
                sx={{
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
                  }
                }}
              >
                {/* Header */}
                <Box sx={{
                  p: 3,
                  pb: 2.5,
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#2c3e50',
                        letterSpacing: '-0.5px',
                        mb: 0.3
                      }}
                    >
                      หมายเลขห้อง {room.roomNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 500 }}>
                      ชั้น {room.floor}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label="ว่าง"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 28,
                      backgroundColor: '#10b981',
                      color: '#fff',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}
                  />
                </Box>

                <Box sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: room.hasAc ? '#dbeafe' : '#fee2e2'
                    }}>
                      <Typography sx={{ fontSize: '1.3rem' }}>
                        {room.hasAc ? "❄️" : "🌡️"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.2, fontWeight: 500 }}>
                        เครื่องปรับอากาศ
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.95rem' }}>
                        {room.hasAc ? 'มี' : 'ไม่มี'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 2 
                  }}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#10b981',
                        backgroundColor: '#ecfdf5'
                      }
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600 }}>
                        รายวัน
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                        ฿{room.dailyRate.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e9ecef',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#f59e0b',
                        backgroundColor: '#fef3c7'
                      }
                    }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6c757d', mb: 0.5, fontWeight: 600 }}>
                        รายเดือน
                      </Typography>
                      <Typography sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                        ฿{room.monthlyRate.toLocaleString()}
                      </Typography>
                    </Box>
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