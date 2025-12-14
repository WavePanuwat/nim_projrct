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
        bgcolor: "#fafafa",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <CircularProgress sx={{ color: "#111827" }} />
      </Box>
    );
  }

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
          {/* Header */}
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
              แก้ไขข้อมูลลูกค้า
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {customer.firstname} {customer.lastname}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              
              {/* ID Card */}
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
                  value={customer.idCard}
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

              {/* Name Fields */}
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
                    value={customer.firstname}
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
                    value={customer.lastname}
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

              {/* Phone & Password */}
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
                    value={customer.phone}
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
                    value={customer.password}
                    onChange={handleChange}
                    fullWidth
                    placeholder="••••••••"
                    helperText="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
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
                      },
                      "& .MuiFormHelperText-root": {
                        color: "#9ca3af",
                        fontSize: "0.75rem"
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Address */}
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
                  value={customer.address}
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

              {/* Action Buttons */}
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

export default withAuth(EditCustomerPage, "ADMIN");