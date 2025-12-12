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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get<Room>(`http://localhost:8081/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Error fetching room:", error);
        alert("ไม่สามารถดึงข้อมูลห้องได้");
        router.push("/admin_home");
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f6fb" }}>
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
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 550,
            p: 4,
            borderRadius: 2,
            background: "linear-gradient(to bottom right, #ffffff, #ffffff)",
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

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                label="หมายเลขห้อง"
                name="roomNumber"
                value={room.roomNumber}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ชั้น"
                name="floor"
                type="number"
                value={room.floor}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ค่าเช่าต่อวัน"
                name="dailyRate"
                type="number"
                value={room.dailyRate}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ค่าเช่าต่อเดือน"
                name="monthlyRate"
                type="number"
                value={room.monthlyRate}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="hasAc"
                    checked={room.hasAc}
                    onChange={handleChange}
                    sx={{ color: "#20335c" }}
                  />
                }
                label="มีแอร์ภายในห้อง"
              />

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
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
                  disabled={saving}
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
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
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminEditRoomPage;
