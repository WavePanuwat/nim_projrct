'use client';

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/utils/components/sidebar";

const AdminAddRoomPage: React.FC = () => {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: 1,
    hasAc: false,
    dailyRate: 0,
    monthlyRate: 0,
    status: "available"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post("http://localhost:8081/api/rooms/add", {
        ...formData,
        floor: Number(formData.floor),
        dailyRate: Number(formData.dailyRate),
        monthlyRate: Number(formData.monthlyRate),
      });

      alert("เพิ่มข้อมูลห้องสำเร็จ");
      router.push("/admin_home");

    } catch (error: any) {
      console.error("Error adding room:", error);
      alert(error.response?.data || "เกิดข้อผิดพลาดในการเพิ่มห้อง");
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
          p: 3
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
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: "bold",
              textAlign: "center",
              color: "#20335c"
            }}
          >
            เพิ่มข้อมูลห้อง
          </Typography>

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

              <TextField
                label="หมายเลขห้อง"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ชั้น"
                name="floor"
                type="number"
                value={formData.floor}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ค่าเช่าต่อวัน"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ค่าเช่าต่อเดือน"
                name="monthlyRate"
                type="number"
                value={formData.monthlyRate}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="hasAc"
                    checked={formData.hasAc}
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
                  mt: 2,
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

export default AdminAddRoomPage;
