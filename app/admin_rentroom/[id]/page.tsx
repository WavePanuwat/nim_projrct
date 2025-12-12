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
  Paper,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Sidebar from "@/app/utils/components/sidebar";

interface Customer { customerId: number; firstname: string; lastname: string; }
interface Room { roomId: number; roomNumber: string; }
interface RoomExtra { extraId: number; name: string; price: number; chargeType: string; }

interface RentRequest {
  roomId: number;
  customerId: number;
  rentType: string;
  checkinDate: string | null;
  checkoutDate: string | null;
  startMonth: string | null;
  endMonth: string | null;
  extras?: { extraId: number; qty: number }[];
}

const RentRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = Number(params?.id);

  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [extras, setExtras] = useState<RoomExtra[]>([]);
  const [form, setForm] = useState<RentRequest>({
    roomId,
    customerId: 0,
    rentType: "",
    checkinDate: null,
    checkoutDate: null,
    startMonth: null,
    endMonth: null,
    extras: [],
  });
  const [selectedExtras, setSelectedExtras] = useState<Record<number, { qty: number; unitPrice: number; name: string; chargeType: string }>>({});

  const showDateFields = form.rentType === "daily";
  const showMonthFields = form.rentType === "monthly";

  const filteredExtras = extras.filter(ex => {
    if (form.rentType === "daily") return ex.chargeType === "one-time";
    return true;
  });

  // -------------------- Load Room --------------------
  useEffect(() => {
    if (!roomId) return;
    axios.get(`http://localhost:8081/api/rooms/${roomId}`)
      .then(res => {
        const data = res.data;
        setRoom({ roomId: data.roomId ?? roomId, roomNumber: data.roomNumber ?? `#${roomId}` });
      })
      .catch(() => { alert("ไม่สามารถโหลดข้อมูลห้องได้"); router.push("/admin_home"); });
  }, [roomId, router]);

  // -------------------- Load Customers --------------------
  useEffect(() => {
    axios.get("http://localhost:8081/api/customers/list")
      .then(res => setCustomers(res.data || []))
      .catch(() => alert("ไม่สามารถโหลดรายชื่อลูกค้าได้"));
  }, []);

  // -------------------- Load Extras --------------------
  useEffect(() => {
    axios.get("http://localhost:8081/api/extras/all")
      .then(res => setExtras(res.data || []))
      .catch(() => setExtras([]));
  }, []);

  // -------------------- Form Handlers --------------------
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "customerId" ? Number(value) : value }));
  };

  const handleRentTypeChange = (value: string) => {
    setForm({ ...form, rentType: value, checkinDate: null, checkoutDate: null, startMonth: null, endMonth: null });

    setSelectedExtras(prev => {
      const filtered: typeof prev = {};
      Object.entries(prev).forEach(([id, item]) => {
        if (value === "daily") {
          if (item.chargeType === "one-time") filtered[Number(id)] = item;
        } else {
          filtered[Number(id)] = item;
        }
      });
      return filtered;
    });
  };

  const toggleExtra = (ex: RoomExtra) => {
    setSelectedExtras(prev => {
      if (prev[ex.extraId]) {
        const copy = { ...prev };
        delete copy[ex.extraId];
        return copy;
      }
      return { ...prev, [ex.extraId]: { qty: 1, unitPrice: ex.price, name: ex.name, chargeType: ex.chargeType } };
    });
  };

  const changeExtraQty = (extraId: number, delta: number) => {
    setSelectedExtras(prev => {
      const item = prev[extraId]; if (!item) return prev;
      return { ...prev, [extraId]: { ...item, qty: Math.max(1, item.qty + delta) } };
    });
  };

  const setExtraQtyDirect = (extraId: number, qty: number) => {
    setSelectedExtras(prev => {
      const item = prev[extraId]; if (!item) return prev;
      return { ...prev, [extraId]: { ...item, qty: Math.max(1, Math.floor(qty)) } };
    });
  };

  // -------------------- Submit Rent --------------------
  const submitRent = async () => {
    if (!form.rentType) return alert("กรุณาเลือกประเภทการเช่า");
    if (!form.customerId) return alert("กรุณาเลือกลูกค้า");
    if (showDateFields && (!form.checkinDate || !form.checkoutDate)) return alert("กรุณาเลือกวันที่เข้าและวันที่ออก");
    if (showMonthFields && (!form.startMonth || !form.endMonth)) return alert("กรุณาเลือกเดือนเริ่มต้นและสิ้นสุด");

    const payload: RentRequest = { ...form, extras: Object.entries(selectedExtras).map(([key, val]) => ({ extraId: Number(key), qty: val.qty })) };

    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/rentals/rent", payload);
      alert("บันทึกการเช่าสำเร็จ!");
      router.push("/admin_home");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally { setLoading(false); }
  };

  const extrasTotal = Object.values(selectedExtras).reduce((sum, it) => sum + it.unitPrice * it.qty, 0);

  // -------------------- Render --------------------
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar role="ADMIN" />
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1c4e80" }}>
            หมายเลขห้อง {room ? `${room.roomNumber}` : "กำลังโหลด..."}
          </Typography>

          <TextField select fullWidth label="ประเภทการเช่า" sx={{ mb: 3 }} value={form.rentType}
            onChange={(e) => handleRentTypeChange(e.target.value)} size="small">
            <MenuItem value="">-- เลือกประเภท --</MenuItem>
            <MenuItem value="daily">รายวัน</MenuItem>
            <MenuItem value="monthly">รายเดือน</MenuItem>
          </TextField>

          <TextField select fullWidth sx={{ mb: 3 }} label="เลือกลูกค้า" name="customerId" value={form.customerId}
            onChange={handleFieldChange} size="small">
            <MenuItem value={0}>-- เลือกลูกค้า --</MenuItem>
            {customers.map(c => <MenuItem key={c.customerId} value={c.customerId}>{c.firstname} {c.lastname}</MenuItem>)}
          </TextField>

          {showDateFields && (
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField fullWidth label="วันที่เข้า" name="checkinDate" type="date"
                InputLabelProps={{ shrink: true }} value={form.checkinDate ?? ""} onChange={handleFieldChange} size="small" />
              <TextField fullWidth label="วันที่ออก" name="checkoutDate" type="date"
                InputLabelProps={{ shrink: true }} value={form.checkoutDate ?? ""} onChange={handleFieldChange} size="small" />
            </Box>
          )}

          {showMonthFields && (
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField fullWidth label="เดือนเริ่มต้น" name="startMonth" type="month"
                InputLabelProps={{ shrink: true }} value={form.startMonth ?? ""} onChange={handleFieldChange} size="small" />
              <TextField fullWidth label="เดือนสิ้นสุด" name="endMonth" type="month"
                InputLabelProps={{ shrink: true }} value={form.endMonth ?? ""} onChange={handleFieldChange} size="small" />
            </Box>
          )}

          {form.rentType && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>อุปกรณ์/บริการเสริม</Typography>
              {filteredExtras.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#666" }}>-- ไม่มีรายการเสริมที่เลือกได้ --</Typography>
              ) : filteredExtras.map(ex => {
                const sel = selectedExtras[ex.extraId];
                return (
                  <Box key={ex.extraId} sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 2, p: 2, borderRadius: 2, bgcolor: sel ? "rgba(28,78,128,0.05)" : "#fff",
                    mb: 1, border: "1px solid", borderColor: sel ? "rgba(28,78,128,0.12)" : "#e0e0e0",
                    transition: "all 0.2s"
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FormControlLabel control={<Checkbox checked={!!sel} onChange={() => toggleExtra(ex)} sx={{ color: "#1c4e80" }} />}
                        label={<Box><Typography sx={{ fontWeight: 600 }}>{ex.name}</Typography><Typography variant="caption" sx={{ color: "#666" }}>฿{ex.price} • {ex.chargeType}</Typography></Box>} />
                    </Box>
                    {sel && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton size="small" onClick={() => changeExtraQty(ex.extraId, -1)}><RemoveIcon fontSize="small" /></IconButton>
                        <TextField value={sel.qty} onChange={(e) => setExtraQtyDirect(ex.extraId, Number(e.target.value || 1))}
                          size="small" inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center", width: 50 } }} />
                        <IconButton size="small" onClick={() => changeExtraQty(ex.extraId, 1)}><AddIcon fontSize="small" /></IconButton>
                        <Typography sx={{ ml: 2, color: "#1c4e80", fontWeight: 600 }}>฿{sel.unitPrice * sel.qty}</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* -------------------- Action Buttons -------------------- */}
          <Box sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2
          }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={submitRent}
              sx={{
                py: 1.2,           // ลด padding
                fontWeight: 600,
                fontSize: 14,       // ลดขนาดตัวอักษร
                borderRadius: 2,
                background: "linear-gradient(135deg,#1c4e80,#123a63)",
                boxShadow: "0 4px 15px rgba(28,78,128,0.3)",
                "&:hover": { background: "linear-gradient(135deg,#123a63,#1c4e80)" },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "ยืนยันการเช่า"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/admin_home")}
              sx={{
                py: 1.2,           // ลด padding
                fontWeight: 600,
                fontSize: 14,       // ลดขนาดตัวอักษร
                borderRadius: 2,
                borderColor: "#ccc",
                color: "#20335c",
                "&:hover": { backgroundColor: "#f0f0f0", borderColor: "#999" },
              }}
            >
              ยกเลิก
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RentRoomPage;
