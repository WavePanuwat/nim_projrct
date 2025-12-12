'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import Sidebar from "@/app/utils/components/Sidebar";

interface Customer {
  customerId: number;
  firstname: string;
  lastname: string;
}

interface Room {
  roomId: number;
  roomNumber: string;
}

interface RentRequest {
  roomId: number;
  customerId: number;
  rentType: string;     // daily / monthly
  checkinDate: string;  // daily: yyyy-MM-dd, monthly: yyyy-MM
  checkoutDate: string; // daily: yyyy-MM-dd, monthly: yyyy-MM
}

const RentRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params?.id);

  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<RentRequest>({
    roomId,
    customerId: 0,
    rentType: "",
    checkinDate: "",
    checkoutDate: "",
  });

  const showDateFields = form.rentType === "daily";
  const showMonthFields = form.rentType === "monthly";

  // โหลดข้อมูลห้อง
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/rooms/${roomId}`);
        setRoom(res.data);
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถโหลดข้อมูลห้องได้");
      }
    };
    fetchRoom();
  }, [roomId]);

  // โหลดรายชื่อลูกค้า
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/customers/list");
        setCustomers(res.data);
      } catch (error) {
        console.error(error);
        alert("ไม่สามารถโหลดรายชื่อลูกค้าได้");
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRent = async () => {
    if (!form.rentType) {
      alert("กรุณาเลือกประเภทการเช่า");
      return;
    }
    if (form.customerId === 0) {
      alert("กรุณาเลือกลูกค้า");
      return;
    }
    if ((showDateFields || showMonthFields) && (!form.checkinDate || !form.checkoutDate)) {
      alert(showDateFields
        ? "กรุณาเลือกวันที่เข้าและวันที่ออก"
        : "กรุณาเลือกเดือนเริ่มต้นและเดือนสิ้นสุด");
      return;
    }

    // สร้าง payload ให้ตรงกับ RentalDTO ของ Backend
    const payload = {
      roomId: form.roomId,
      customerId: form.customerId,
      rentType: form.rentType,
      checkinDate: showDateFields ? form.checkinDate : null,
      checkoutDate: showDateFields ? form.checkoutDate : null,
      startMonth: showMonthFields ? form.checkinDate : null,
      endMonth: showMonthFields ? form.checkoutDate : null,
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/rentals/rent", payload);
      alert("บันทึกการเช่าห้องสำเร็จ!");
      router.push("/admin_home");
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "เกิดข้อผิดพลาด";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="ADMIN" />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
          หมายเลขห้อง {room ? room.roomNumber : "กำลังโหลด..."}
        </Typography>

        {/* เลือกประเภทการเช่า */}
        <TextField
          select
          fullWidth
          label="ประเภทการเช่า"
          name="rentType"
          sx={{ mb: 3 }}
          value={form.rentType}
          onChange={(e) =>
            setForm({ ...form, rentType: e.target.value, checkinDate: "", checkoutDate: "" })
          }
        >
          <MenuItem value="">-- เลือกประเภทการเช่า --</MenuItem>
          <MenuItem value="daily">รายวัน</MenuItem>
          <MenuItem value="monthly">รายเดือน</MenuItem>
        </TextField>

        {/* เลือกลูกค้า */}
        <TextField
          select
          fullWidth
          label="เลือกลูกค้า"
          name="customerId"
          value={form.customerId}
          sx={{ mb: 2 }}
          onChange={handleChange}
        >
          <MenuItem value={0}>-- เลือกลูกค้า --</MenuItem>
          {customers.map(c => (
            <MenuItem key={c.customerId} value={c.customerId}>
              {c.firstname} {c.lastname}
            </MenuItem>
          ))}
        </TextField>

        {/* ฟิลด์วันที่หรือเดือน */}
        {showDateFields && (
          <>
            <TextField
              fullWidth
              label="วันที่เข้า"
              name="checkinDate"
              type="date"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="วันที่ออก"
              name="checkoutDate"
              type="date"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
          </>
        )}

        {showMonthFields && (
          <>
            <TextField
              fullWidth
              label="เดือนเริ่มต้น"
              name="checkinDate"
              type="month"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="เดือนสิ้นสุด"
              name="checkoutDate"
              type="month"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
          </>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={submitRent}
          disabled={loading}
        >
          {loading ? <CircularProgress size={25} /> : "ยืนยันการเช่า"}
        </Button>
      </Container>
    </Box>
  );
};

export default RentRoomPage;
