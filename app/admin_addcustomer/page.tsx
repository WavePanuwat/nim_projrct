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
        bgcolor: "#fafafa"
      }}
    >
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
              เพิ่มลูกค้าใหม่
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              กรอกข้อมูลลูกค้าให้ครบถ้วน
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500, 
                    color: "#374151" 
                  }}
                >
                  รหัสบัตรประชาชน
                </Typography>
                <TextField
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  fullWidth
                  required
                  placeholder="เลขบัตรประชาชน 13 หลัก"
                  inputProps={{ maxLength: 13 }}
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
                    ชื่อ
                  </Typography>
                  <TextField
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="ชื่อจริง"
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
                    นามสกุล
                  </Typography>
                  <TextField
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="นามสกุล"
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
                    เบอร์โทร
                  </Typography>
                  <TextField
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="0xx-xxx-xxxx"
                    inputProps={{ maxLength: 10 }}
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
                    รหัสผ่าน
                  </Typography>
                  <TextField
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="••••••••"
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

              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500, 
                    color: "#374151" 
                  }}
                >
                  ที่อยู่
                </Typography>
                <TextField
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  placeholder="ที่อยู่เต็ม รวมถึงตำบล อำเภอ จังหวัด และรหัสไปรษณีย์"
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
                  onClick={() => router.push("/admin_listcustomer")}
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

export default withAuth(AddCustomerPage, "ADMIN");