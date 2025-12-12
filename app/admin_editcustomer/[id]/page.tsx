'use client';

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
} from "@mui/material";
import withAuth from "@/app/utils/hocs/withAuth";
import Sidebar from "@/app/utils/components/Sidebar";

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

  const handleSave = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const dto = {
        phone: customer.phone,
        password: customer.password,
        firstname: customer.firstname,
        lastname: customer.lastname,
        idCard: customer.idCard,
        address: customer.address
      };
      await axios.put(`http://localhost:8081/api/customers/update/${customer.customerId}`, dto);
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            maxWidth: 550, // ลดขนาดฟอร์ม
            p: 4, // ลด padding
            borderRadius: 2,
            background: "linear-gradient(to bottom right, #ffffff, #e3f2fd)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5" // ลดขนาดหัวข้อ
            sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#20335c" }}
          >
            แก้ไขข้อมูลลูกค้า
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="รหัสบัตรประชาชน"
              name="idCard"
              value={customer.idCard}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="ชื่อ"
              name="firstname"
              value={customer.firstname}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="นามสกุล"
              name="lastname"
              value={customer.lastname}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="เบอร์โทร"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="รหัสผ่าน"
              name="password"
              value={customer.password}
              onChange={handleChange}
              type="password"
              fullWidth
              size="small"
              helperText="เว้นว่างหากไม่ต้องการเปลี่ยนรหัสผ่าน"
            />
            <TextField
              label="ที่อยู่"
              name="address"
              value={customer.address}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: "#20335c",
                  color: "#fff",
                  py: 1.2,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#2a50a2" },
                  borderRadius: 2,
                  minWidth: 100,
                  fontSize: "0.85rem"
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
                  fontSize: "0.85rem"
                }}
                onClick={() => router.push("/admin_listcustomer")}
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

export default withAuth(EditCustomerPage, "ADMIN");
