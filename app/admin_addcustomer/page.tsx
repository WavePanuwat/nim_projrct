"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Divider
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import withAuth from "@/app/utils/hocs/withAuth";
import Sidebar from "@/app/utils/components/sidebar";

const AddCustomerPage = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    firstname: "",
    lastname: "",
    idCard: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.post("http://localhost:8081/api/customers/add", formData);
      alert("เพิ่มลูกค้าสำเร็จ");
      router.push("/admin_listcustomer");
    } catch (error: any) {
      console.error("Error adding customer:", error);
      alert(error.response?.data || "เกิดข้อผิดพลาดในการเพิ่มลูกค้า");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc"
      }}
    >
      <Sidebar role="ADMIN" />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, md: 3 },
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
              เพิ่มลูกค้าใหม่
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              กรอกข้อมูลลูกค้าให้ครบถ้วน
            </Typography>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              
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
                  รหัสบัตรประชาชน
                </Typography>
                <TextField
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  required
                  placeholder="เลขบัตรประชาชน 13 หลัก"
                  inputProps={{ maxLength: 13 }}
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
                    ชื่อ
                  </Typography>
                  <TextField
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="ชื่อจริง"
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
                    นามสกุล
                  </Typography>
                  <TextField
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="นามสกุล"
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
                    เบอร์โทร
                  </Typography>
                  <TextField
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="0xx-xxx-xxxx"
                    inputProps={{ maxLength: 10 }}
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
                    รหัสผ่าน
                  </Typography>
                  <TextField
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    placeholder="••••••••"
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
                  ที่อยู่
                </Typography>
                <TextField
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  multiline
                  rows={2.5}
                  required
                  placeholder="ที่อยู่เต็ม รวมถึงตำบล อำเภอ จังหวัด และรหัสไปรษณีย์"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#f8fafc",
                      borderRadius: 1.5,
                      fontSize: "0.85rem",
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
                  onClick={() => router.push("/admin_listcustomer")}
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

export default withAuth(AddCustomerPage, "ADMIN");