'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
  Divider
} from "@mui/material";
import Sidebar from "@/app/utils/components/sidebar";

interface Room {
  roomId: number;
  roomNumber: string;
  floor: number;
  hasAc: boolean;
  dailyRate: number;
  monthlyRate: number;
  status: string;
}

const AdminEditRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id;

  const [room, setRoom] = useState<Room>({
    roomId: 0,
    roomNumber: "",
    floor: 1,
    hasAc: false,
    dailyRate: 0,
    monthlyRate: 0,
    status: "available",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get<Room>(`http://localhost:8081/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
        alert("ไม่สามารถดึงข้อมูลห้องได้");
        router.push("/admin_home");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRoom({
      ...room,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room.roomNumber.trim()) {
      alert("กรุณากรอกหมายเลขห้อง");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`http://localhost:8081/api/rooms/update/${room.roomId}`, {
        ...room,
        floor: Number(room.floor),
        dailyRate: Number(room.dailyRate),
        monthlyRate: Number(room.monthlyRate),
      });
      alert("แก้ไขข้อมูลห้องเรียบร้อยแล้ว");
      router.push("/admin_home");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data || "เกิดข้อผิดพลาดในการแก้ไขห้อง");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        minHeight: "100vh", 
        bgcolor: "#f8fafc",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <CircularProgress sx={{ color: "#0f172a" }} size={36} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#f8fafc"
    }}>
      <Sidebar role="ADMIN" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 3.5,
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.02em",
                mb: 0.5,
                fontSize: "1.35rem"
              }}
            >
              แก้ไขข้อมูลห้อง
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              หมายเลขห้อง: {room.roomNumber}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              
              <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2 }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: "#334155",
                      fontSize: "0.8rem"
                    }}
                  >
                    หมายเลขห้อง
                  </Typography>
                  <TextField
                    name="roomNumber"
                    value={room.roomNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="เช่น 101"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f8fafc",
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#0f172a",
                          borderWidth: "1.5px"
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: "#334155",
                      fontSize: "0.8rem"
                    }}
                  >
                    ชั้น
                  </Typography>
                  <TextField
                    name="floor"
                    type="number"
                    value={room.floor}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    inputProps={{ min: 1 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f8fafc",
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#0f172a",
                          borderWidth: "1.5px"
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: "#334155",
                      fontSize: "0.8rem"
                    }}
                  >
                    รายวัน (฿)
                  </Typography>
                  <TextField
                    name="dailyRate"
                    type="number"
                    value={room.dailyRate}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f8fafc",
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#0f172a",
                          borderWidth: "1.5px"
                        }
                      }
                    }}
                  />
                </Box>

                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: "#334155",
                      fontSize: "0.8rem"
                    }}
                  >
                    รายเดือน (฿)
                  </Typography>
                  <TextField
                    name="monthlyRate"
                    type="number"
                    value={room.monthlyRate}
                    onChange={handleChange}
                    fullWidth
                    required
                    size="small"
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#f8fafc",
                        borderRadius: 1.5,
                        fontSize: "0.9rem",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: "#cbd5e1" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#0f172a",
                          borderWidth: "1.5px"
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    bgcolor: "#fff"
                  }
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="hasAc"
                      checked={room.hasAc}
                      onChange={handleChange}
                      size="small"
                      sx={{ 
                        color: "#cbd5e1",
                        "&.Mui-checked": { color: "#0f172a" }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ 
                      fontWeight: 500, 
                      color: "#334155",
                      fontSize: "0.85rem"
                    }}>
                      มีเครื่องปรับอากาศ
                    </Typography>
                  }
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 1,
                  pt: 3,
                  borderTop: "1px solid #e2e8f0"
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving}
                  sx={{
                    py: 1.2,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    borderRadius: 1.5,
                    bgcolor: "#0f172a",
                    color: "#fff",
                    textTransform: "none",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    "&:hover": { 
                      bgcolor: "#1e293b",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.2)"
                    },
                    "&:disabled": {
                      bgcolor: "#e2e8f0",
                      color: "#94a3b8"
                    }
                  }}
                >
                  {saving ? (
                    <CircularProgress size={20} sx={{ color: "#94a3b8" }} />
                  ) : (
                    "บันทึก"
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/admin_home")}
                  sx={{
                    py: 1.2,
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    borderRadius: 1.5,
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                    textTransform: "none",
                    "&:hover": { 
                      bgcolor: "#f8fafc",
                      borderColor: "#cbd5e1"
                    }
                  }}
                >
                  ยกเลิก
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminEditRoomPage;