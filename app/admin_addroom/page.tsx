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
  CircularProgress,
  Divider
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
          p: { xs: 2, md: 3 }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: { xs: 3, md: 4 },
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
                fontSize: { xs: "1.25rem", md: "1.5rem" }
              }}
            >
              เพิ่มข้อมูลห้อง
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              กรอกข้อมูลห้องพักให้ครบถ้วน
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2 }}>
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
                    value={formData.roomNumber}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="เช่น 101, 202"
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
                    value={formData.floor}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
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

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
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
                    ค่าเช่าต่อวัน (฿)
                  </Typography>
                  <TextField
                    name="dailyRate"
                    type="number"
                    value={formData.dailyRate}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
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
                    ค่าเช่าต่อเดือน (฿)
                  </Typography>
                  <TextField
                    name="monthlyRate"
                    type="number"
                    value={formData.monthlyRate}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
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
                      checked={formData.hasAc}
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
                      มีเครื่องปรับอากาศภายในห้อง
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
                    boxShadow: "none",
                    "&:hover": { 
                      bgcolor: "#1e293b",
                      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.2)"
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

export default AdminAddRoomPage;