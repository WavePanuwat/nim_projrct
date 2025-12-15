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
        bgcolor: '#fafafa'
      }}>
        <CircularProgress sx={{ color: '#1a1a2e' }} size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Sidebar role="CUSTOMER" />
      
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a2e', letterSpacing: '-0.02em', mb: 0.5, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            ห้องพักว่าง
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 400, fontSize: '0.875rem' }}>
            {rooms.length} ห้องพร้อมให้บริการ
          </Typography>
        </Box>

        {rooms.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, bgcolor: '#ffffff', boxShadow: 'none', border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem' }}>
              ไม่มีห้องว่างในขณะนี้
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(280px, 1fr))' }, gap: 2 }}>
            {rooms.map((room) => (
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
                    label="ว่าง"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                      bgcolor: '#22c55e',
                      color: '#ffffff',
                      '& .MuiChip-label': { px: 1.25 }
                    }}
                  />
                </Box>

                {/* Card Body */}
                <Box sx={{ p: 2, flexGrow: 1 }}>
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
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default withAuth(CustomerHome, "CUSTOMER");