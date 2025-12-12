'use client';

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import Sidebar from "@/app/utils/components/sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Rental {
  rentalId: number;
  roomNumber: string;
  customerName: string;
  rentType: string;      // daily / monthly
  checkinDate?: string;
  checkoutDate?: string;
  dailyRate?: number;
  monthlyRate?: number;
  acFee?: number;
  hasAc?: boolean;
}

interface InvoiceForm {
  rentalId: number;
  waterUnit: number;
  electricUnit: number;
}

const InvoicePage: React.FC = () => {
  const router = useRouter();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [form, setForm] = useState<InvoiceForm>({ rentalId: 0, waterUnit: 0, electricUnit: 0 });
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // โหลด Rental ที่ยังไม่ออกบิล
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get<Rental[]>("http://localhost:8081/api/rentals/uninvoiced");
        setRentals(res.data);
      } catch (err) {
        console.error(err);
        alert("ไม่สามารถโหลดข้อมูล Rental ได้");
      }
    };
    fetchRentals();
  }, []);

  // อัปเดตรายการ Rental ที่เลือก
  useEffect(() => {
    const rental = rentals.find(r => r.rentalId === form.rentalId) || null;
    setSelectedRental(rental);

    // รีเซ็ตน้ำ/ไฟ สำหรับรายวัน หรือเมื่อเปลี่ยน Rental
    if (!rental || rental.rentType === "daily") {
      setForm(prev => ({ ...prev, waterUnit: 0, electricUnit: 0 }));
    }
  }, [form.rentalId, rentals]);

  // คำนวณ total แบบ real-time
  useEffect(() => {
    if (!selectedRental) {
      setTotal(null);
      return;
    }

    const baseRent =
      selectedRental.rentType === "daily"
        ? Number(selectedRental.dailyRate || 0)
        : Number(selectedRental.monthlyRate || 0);

    const acFee = Number(selectedRental.acFee || 0);
    const waterUnit = Number(form.waterUnit || 0);
    const electricUnit = Number(form.electricUnit || 0);

    let calculatedTotal = baseRent + acFee;

    // รายเดือนคิดค่าน้ำ/ไฟ
    if (selectedRental.rentType === "monthly") {
      const waterRate = 3;
      const electricRate = 5;
      calculatedTotal += waterUnit * waterRate + electricUnit * electricRate;
    }

    setTotal(calculatedTotal);
  }, [form, selectedRental]);

  // อัปเดต form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number(e.target.value);
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  // สร้าง Invoice
  const handleCreateInvoice = async () => {
    if (form.rentalId === 0) {
      alert("กรุณาเลือก Rental");
      return;
    }

    if (selectedRental?.rentType === "monthly" && (form.waterUnit < 0 || form.electricUnit < 0)) {
      alert("กรุณากรอกหน่วยน้ำและไฟให้ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/invoices/create", form);
      alert("สร้าง Invoice เรียบร้อยแล้ว!");
      router.push("/admin_home");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสร้าง Invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="ADMIN" />

      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          สร้าง Invoice
        </Typography>

        <TextField
          select
          fullWidth
          label="เลือกรายการเช่า"
          name="rentalId"
          value={form.rentalId}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value={0}>-- เลือกรายการเช่า --</MenuItem>
          {rentals.map(r => (
            <MenuItem key={r.rentalId} value={r.rentalId}>
              ห้อง {r.roomNumber} | ลูกค้า: {r.customerName} | ประเภท: {r.rentType} | 
              {r.rentType === "daily" ? ` ${r.dailyRate} บาท/วัน` : ` ${r.monthlyRate} บาท/เดือน`}
              {r.hasAc ? " | แอร์ ✅" : ""}
            </MenuItem>
          ))}
        </TextField>

        {selectedRental?.rentType === "monthly" && (
          <>
            <TextField
              fullWidth
              label="หน่วยน้ำ"
              name="waterUnit"
              type="number"
              sx={{ mb: 2 }}
              value={form.waterUnit}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="หน่วยไฟ"
              name="electricUnit"
              type="number"
              sx={{ mb: 2 }}
              value={form.electricUnit}
              onChange={handleChange}
              inputProps={{ min: 0 }}
            />
          </>
        )}

        <Typography variant="h6" sx={{ mb: 2 }}>
          Total: {total !== null ? total : "-"} บาท
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={handleCreateInvoice}
          disabled={loading || form.rentalId === 0}
        >
          {loading ? <CircularProgress size={25} /> : "สร้าง Invoice"}
        </Button>
      </Container>
    </Box>
  );
};

export default InvoicePage;
