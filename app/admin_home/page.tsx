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
      <Sidebar role="ADMIN" />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 5,
        '@media (max-width: 600px)': { p: 3 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 5,
          flexWrap: 'wrap',
          gap: 3
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
              รายการห้องทั้งหมด
            </Typography>
            <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 400 }}>
              จัดการและติดตามสถานะห้องพักทั้งหมด
            </Typography>
          </Box>
          
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 180,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                '& fieldset': {
                  borderColor: '#dee2e6'
                },
                '&:hover fieldset': {
                  borderColor: '#2c3e50'
                }
              }
            }}
          >
            <InputLabel sx={{ fontWeight: 500, color: '#6c757d' }}>กรองสถานะ</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="กรองสถานะ"
            >
              <MenuItem value="All">ทั้งหมด</MenuItem>
              <MenuItem value="available">ว่าง</MenuItem>
              <MenuItem value="rented">ให้เช่าแล้ว</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredRooms.length === 0 ? (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <Typography variant="h6" sx={{ color: '#adb5bd', fontWeight: 500 }}>
              ไม่พบห้องในระบบ
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
            {filteredRooms.map((room) => (
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
                <Box sx={{
                  p: 3,
                  pb: 2.5,
                  background: room.status === 'available' 
                    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                    : room.status === 'rented'
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                    : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  position: 'relative'
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
                    label={room.status === 'available' ? 'ว่าง' : room.status === 'rented' ? 'ให้เช่าแล้ว' : room.status}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 28,
                      backgroundColor: room.status === 'available' ? '#10b981' : room.status === 'rented' ? '#f59e0b' : '#6c757d',
                      color: '#fff',
                      boxShadow: room.status === 'available' 
                        ? '0 2px 8px rgba(16, 185, 129, 0.3)' 
                        : room.status === 'rented'
                        ? '0 2px 8px rgba(245, 158, 11, 0.3)'
                        : 'none'
                    }}
                  />
                </Box>

                <Box sx={{ p: 3, flexGrow: 1 }}>
                  {room.status !== "rented" && (
                    <Box>
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
                  )}
                  
                  {room.status === "rented" && room.rentalInfo && (
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography sx={{ fontWeight: 700, mb: 2, color: '#2c3e50', fontSize: '0.95rem' }}>
                        ข้อมูลการเช่า
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ผู้เช่า
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {room.rentalInfo.customerName}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ประเภท
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {room.rentalInfo.rentType === 'daily' ? 'รายวัน' : 'รายเดือน'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              เข้า
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem' }}>
                              {room.rentalInfo.checkinDate}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.7rem', color: '#6c757d', mb: 0.3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              ออก
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444', fontSize: '0.85rem' }}>
                              {room.rentalInfo.checkoutDate}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ 
                  p: 3,
                  pt: 0,
                  display: 'flex', 
                  gap: 1.5,
                  flexWrap: 'wrap'
                }}>
                  {room.status === "available" && (
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ 
                        py: 1.3,
                        borderRadius: 2,
                        backgroundColor: '#2c3e50',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(44, 62, 80, 0.3)',
                        '&:hover': { 
                          backgroundColor: '#1a252f',
                          boxShadow: '0 6px 16px rgba(44, 62, 80, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleRentClick(room.roomId)}
                    >
                      เช่าห้องนี้
                    </Button>
                  )}
                  
                  {room.status !== "rented" && (
                    <>
                      <Button
                        variant="outlined"
                        sx={{ 
                          flex: 1,
                          py: 1.3,
                          borderRadius: 2,
                          borderColor: '#dee2e6',
                          borderWidth: 1.5,
                          color: '#2c3e50',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textTransform: 'none',
                          '&:hover': { 
                            borderColor: '#2c3e50',
                            borderWidth: 1.5,
                            backgroundColor: '#f8f9fa',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleEditClick(room.roomId)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{ 
                          flex: 1,
                          py: 1.3,
                          borderRadius: 2,
                          borderColor: '#dee2e6',
                          borderWidth: 1.5,
                          color: '#6c757d',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textTransform: 'none',
                          '&:hover': { 
                            borderColor: '#ef4444',
                            borderWidth: 1.5,
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleDelete(room.roomId)}
                      >
                        ลบ
                      </Button>
                    </>
                  )}
                  
                  {room.status === "rented" && (
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        py: 1.3,
                        borderRadius: 2,
                        borderColor: '#dee2e6',
                        borderWidth: 1.5,
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        '&:hover': { 
                          borderColor: '#2c3e50',
                          borderWidth: 1.5,
                          backgroundColor: '#f8f9fa',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
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