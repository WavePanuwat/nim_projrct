"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
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
        backgroundColor: "#f3f6fb",
      }}
    >
      {/* Sidebar */}
      <Sidebar role="ADMIN" />

      {/* Main content center box */}
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
            background: "linear-gradient(to bottom right, #ffffffff, #ffffffff)",
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
            เพิ่มลูกค้าใหม่
          </Typography>

          <form onSubmit={handleSave}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                label="รหัสบัตรประชาชน"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ชื่อ"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="นามสกุล"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="เบอร์โทร"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="รหัสผ่าน"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                size="small"
                required
              />

              <TextField
                label="ที่อยู่"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
                required
              />

              {/* Button group */}
                <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",   // ชิดซ้าย
                    gap: 2,                          // ระยะห่างระหว่างปุ่ม
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
                    onClick={() => router.push("/admin_listcustomer")}
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
