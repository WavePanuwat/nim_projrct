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
        bgcolor: "#fafafa",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <CircularProgress sx={{ color: "#111827" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#fafafa"
    }}>
      <Sidebar role="ADMIN" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 5,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#fff"
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                mb: 1
              }}
            >
              แก้ไขข้อมูลห้อง
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              หมายเลขห้อง: {room.roomNumber}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              
              <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2 }}>
                <Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1.5, 
                      fontWeight: 500, 
                      color: "#374151" 
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
                    placeholder="เช่น 101, 202"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#d1d5db" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#111827",
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
                      mb: 1.5, 
                      fontWeight: 500, 
                      color: "#374151" 
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
                    inputProps={{ min: 1 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#d1d5db" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#111827",
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
                      mb: 1.5, 
                      fontWeight: 500, 
                      color: "#374151" 
                    }}
                  >
                    ค่าเช่าต่อวัน (฿)
                  </Typography>
                  <TextField
                    name="dailyRate"
                    type="number"
                    value={room.dailyRate}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#d1d5db" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#111827",
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
                      mb: 1.5, 
                      fontWeight: 500, 
                      color: "#374151" 
                    }}
                  >
                    ค่าเช่าต่อเดือน (฿)
                  </Typography>
                  <TextField
                    name="monthlyRate"
                    type="number"
                    value={room.monthlyRate}
                    onChange={handleChange}
                    fullWidth
                    required
                    inputProps={{ min: 0 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        "& fieldset": { borderColor: "#e5e7eb" },
                        "&:hover fieldset": { borderColor: "#d1d5db" },
                        "&.Mui-focused fieldset": { 
                          borderColor: "#111827",
                          borderWidth: "1.5px"
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fafafa",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#d1d5db",
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
                      sx={{ 
                        color: "#d1d5db",
                        "&.Mui-checked": { color: "#111827" }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ 
                      fontWeight: 500, 
                      color: "#374151",
                      fontSize: "0.95rem"
                    }}>
                      มีเครื่องปรับอากาศภายในห้อง
                    </Typography>
                  }
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 2,
                  pt: 4,
                  borderTop: "1px solid #e5e7eb"
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 2,
                    bgcolor: "#111827",
                    color: "#fff",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { 
                      bgcolor: "#1f2937",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    },
                    "&:disabled": {
                      bgcolor: "#e5e7eb",
                      color: "#9ca3af"
                    }
                  }}
                >
                  {saving ? (
                    <CircularProgress size={22} sx={{ color: "#9ca3af" }} />
                  ) : (
                    "บันทึก"
                  )}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.push("/admin_home")}
                  sx={{
                    py: 1.5,
                    fontWeight: 500,
                    fontSize: 15,
                    borderRadius: 2,
                    borderColor: "#e5e7eb",
                    color: "#6b7280",
                    textTransform: "none",
                    "&:hover": { 
                      bgcolor: "#fafafa",
                      borderColor: "#d1d5db"
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