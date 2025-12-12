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
  Select,
  MenuItem,
  InputLabel,
  Paper,
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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get<Room>(`http://localhost:8081/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
        alert("ไม่สามารถดึงข้อมูลห้องได้");
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleSubmit = async () => {
    if (!room.roomNumber.trim()) {
      alert("กรุณากรอกหมายเลขห้อง");
      return;
    }
    try {
      await axios.put(`http://localhost:8081/api/rooms/update/${room.roomId}`, room);
      alert("แก้ไขห้องเรียบร้อยแล้ว");
      router.push("/admin_home");
    } catch (error) {
      console.error("Error updating room:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขห้อง");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f6fb" }}>
      {/* Sidebar */}
      <Sidebar role="ADMIN" />

      {/* Main Content */}
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
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 550,
            p: 4,
            borderRadius: 2,
            background: "linear-gradient(to bottom right, #ffffff, #e3f2fd)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#20335c",
            }}
          >
            แก้ไขห้อง
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="หมายเลขห้อง"
              value={room.roomNumber}
              onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="ชั้น"
              type="number"
              value={room.floor}
              onChange={(e) => setRoom({ ...room, floor: parseInt(e.target.value) })}
              fullWidth
              size="small"
            />
            <TextField
              label="ค่าเช่าต่อวัน"
              type="number"
              value={room.dailyRate}
              onChange={(e) => setRoom({ ...room, dailyRate: parseInt(e.target.value) })}
              fullWidth
              size="small"
            />
            <TextField
              label="ค่าเช่าต่อเดือน"
              type="number"
              value={room.monthlyRate}
              onChange={(e) => setRoom({ ...room, monthlyRate: parseInt(e.target.value) })}
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={room.hasAc}
                  onChange={(e) => setRoom({ ...room, hasAc: e.target.checked })}
                  sx={{ color: "#1976d2" }}
                />
              }
              label="มีแอร์"
            />
            <Box>
              <InputLabel id="status-label" sx={{ mb: 1 }}>
                สถานะ
              </InputLabel>
              <Select
                labelId="status-label"
                value={room.status}
                onChange={(e) => setRoom({ ...room, status: e.target.value })}
                fullWidth
                size="small"
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                }}
              >
                <MenuItem value="available">available</MenuItem>
                <MenuItem value="rented">rented</MenuItem>
                <MenuItem value="maintenance">maintenance</MenuItem>
              </Select>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#20335c",
                  color: "#fff",
                  py: 1.2,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#2a50a2" },
                  borderRadius: 2,
                  minWidth: 100,
                  fontSize: "0.85rem",
                }}
              >
                บันทึก
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": { backgroundColor: "#E3F2FD" },
                  minWidth: 100,
                  fontSize: "0.85rem",
                }}
                onClick={() => router.push("/admin_home")}
              >
                ยกเลิก
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminEditRoomPage;
