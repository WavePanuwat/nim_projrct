"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Paper,
  Divider
} from "@mui/material";
import withAuth from "@/app/utils/hocs/withAuth";
import Sidebar from "@/app/utils/components/sidebar";

interface Customer {
  customerId: number;
  phone: string;
  password: string;
  firstname: string;
  lastname: string;
  idCard: string;
  address: string;
}

const EditCustomerPage = () => {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/customers/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error);
      alert("ไม่พบลูกค้า");
      router.push("/admin_listcustomer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setSaving(true);

    try {
      const dto = {
        phone: customer.phone,
        password: customer.password,
        firstname: customer.firstname,
        lastname: customer.lastname,
        idCard: customer.idCard,
        address: customer.address,
      };

      await axios.put(
        `http://localhost:8081/api/customers/update/${customer.customerId}`,
        dto
      );

      alert("แก้ไขลูกค้าสำเร็จ");
      router.push("/admin_listcustomer");
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขลูกค้า");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !customer) {
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
              แก้ไขข้อมูลลูกค้า
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
              {customer.firstname} {customer.lastname}
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
                  value={customer.idCard}
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
                    value={customer.firstname}
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
                    value={customer.lastname}
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
                    value={customer.phone}
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
                    value={customer.password}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    placeholder="••••••••"
                    helperText="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
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
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#94a3b8",
                        fontSize: "0.7rem",
                        mt: 0.5
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
                  value={customer.address}
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

export default withAuth(EditCustomerPage, "ADMIN");