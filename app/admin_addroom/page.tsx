'use client';

import React, { useState } from "react";
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/utils/components/sidebar";

const AdminAddRoomPage: React.FC = () => {
  const router = useRouter();

  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState<number>(1);
  const [hasAc, setHasAc] = useState(false);
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [monthlyRate, setMonthlyRate] = useState<number>(0);
  const [status, setStatus] = useState("available");

  const handleSubmit = async () => {
    if (!roomNumber.trim()) {
      alert("กรุณากรอกหมายเลขห้อง");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/rooms/add", {
        roomNumber: roomNumber.trim(),
        floor,
        hasAc,
        dailyRate,
        monthlyRate,
        status,
      });
      alert("เพิ่มห้องเรียบร้อยแล้ว");
      router.push("/admin_home");
    } catch (error) {
      console.error("Error adding room:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มห้อง");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f3f6fb" }}>
      <Sidebar role="ADMIN" />

      <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
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
            sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#20335c" }}
          >
            เพิ่มห้อง
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="หมายเลขห้อง"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="ชั้น"
              type="number"
              value={floor}
              onChange={(e) => setFloor(parseInt(e.target.value))}
              fullWidth
              size="small"
            />
            <TextField
              label="ค่าเช่าต่อวัน"
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(parseInt(e.target.value))}
              fullWidth
              size="small"
            />
            <TextField
              label="ค่าเช่าต่อเดือน"
              type="number"
              value={monthlyRate}
              onChange={(e) => setMonthlyRate(parseInt(e.target.value))}
              fullWidth
              size="small"
            />
            <FormControlLabel
              control={<Checkbox checked={hasAc} onChange={(e) => setHasAc(e.target.checked)} sx={{ color: "#1976d2" }} />}
              label="มีแอร์"
            />
            <Box>
              <InputLabel id="status-label" sx={{ mb: 1 }}>สถานะ</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                size="small"
                sx={{ "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" } }}
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
                เพิ่ม
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

export default AdminAddRoomPage;
