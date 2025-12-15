'use client';

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
  MenuItem
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/app/utils/components/sidebar";

const AdminAddExtraPage: React.FC = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    chargeType: "one-time"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post("http://localhost:8081/api/extras/create", {
        name: formData.name.trim(),
        price: Number(formData.price),
        chargeType: formData.chargeType
      });

      alert("เพิ่มรายการเสริมเรียบร้อยแล้ว");
      router.push("/admin_home");

    } catch (err: any) {
      alert(err.response?.data || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Sidebar role="ADMIN" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: 4,
            borderRadius: 2,
            border: "1px solid #e2e8f0"
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              fontWeight={700}
              color="#0f172a"
            >
              เพิ่มรายการเสริม
            </Typography>
            <Typography
              variant="body2"
              color="#64748b"
            >
              สร้างรายการค่าใช้จ่ายเพิ่มเติมสำหรับห้องพัก
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              {/* Name */}
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  ชื่อรายการ
                </Typography>
                <TextField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น ค่าไฟ, ค่าน้ำ, เตียงเสริม"
                  size="small"
                  fullWidth
                  required
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  ราคา (บาท)
                </Typography>
                <TextField
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  รูปแบบการคิดเงิน
                </Typography>
                <TextField
                  select
                  name="chargeType"
                  value={formData.chargeType}
                  onChange={handleChange}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="one-time">
                    จ่ายครั้งเดียว
                  </MenuItem>
                  <MenuItem value="monthly">
                    คิดรายเดือน
                  </MenuItem>
                </TextField>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  pt: 3,
                  mt: 1,
                  borderTop: "1px solid #e2e8f0"
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={saving}
                  sx={{
                    bgcolor: "#0f172a",
                    "&:hover": { bgcolor: "#1e293b" }
                  }}
                >
                  {saving ? <CircularProgress size={20} /> : "บันทึก"}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => router.back()}
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

export default AdminAddExtraPage;
