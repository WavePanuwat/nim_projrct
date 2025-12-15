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
  Divider,
  Chip
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
    if (form.rentType === "monthly") return ex.chargeType === "one-time" || ex.chargeType === "monthly";
    return true;
  });

  useEffect(() => {
    if (!roomId) return;
    axios.get(`http://localhost:8081/api/rooms/${roomId}`)
      .then(res => {
        const data = res.data;
        setRoom({ roomId: data.roomId ?? roomId, roomNumber: data.roomNumber ?? `#${roomId}` });
      })
      .catch(() => { alert("ไม่สามารถโหลดข้อมูลห้องได้"); router.push("/admin_home"); });
  }, [roomId, router]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/customers/list")
      .then(res => setCustomers(res.data || []))
      .catch(() => alert("ไม่สามารถโหลดรายชื่อลูกค้าได้"));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8081/api/extras/all")
      .then(res => setExtras(res.data || []))
      .catch(() => setExtras([]));
  }, []);

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
        } else if (value === "monthly") {
          if (item.chargeType === "one-time" || item.chargeType === "monthly") filtered[Number(id)] = item;
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

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#f8fafc"
    }}>
      <Sidebar role="ADMIN" />
      
      <Container maxWidth="sm" sx={{ py: { xs: 3, md: 4 } }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
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
              เช่าห้องพัก
            </Typography>
            <Box 
              sx={{ 
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                หมายเลขห้อง
              </Typography>
              <Chip 
                label={room ? room.roomNumber : "กำลังโหลด..."} 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  bgcolor: "#f8fafc",
                  color: "#0f172a",
                  border: "1px solid #e2e8f0",
                  height: 24,
                  fontSize: "0.75rem"
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

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
                ประเภทการเช่า
              </Typography>
              <TextField 
                select 
                fullWidth 
                size="small"
                value={form.rentType}
                onChange={(e) => handleRentTypeChange(e.target.value)}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value) {
                      return <span style={{ color: "#94a3b8" }}>เลือกประเภทการเช่า</span>;
                    }
                    return value === "daily" ? "รายวัน" : "รายเดือน";
                  }
                }}
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
              >
                <MenuItem value="" disabled>เลือกประเภทการเช่า</MenuItem>
                <MenuItem value="daily">รายวัน</MenuItem>
                <MenuItem value="monthly">รายเดือน</MenuItem>
              </TextField>
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
                ข้อมูลลูกค้า
              </Typography>
              <TextField 
                select 
                fullWidth 
                size="small"
                name="customerId" 
                value={form.customerId}
                onChange={handleFieldChange}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value || value === 0) {
                      return <span style={{ color: "#94a3b8" }}>เลือกลูกค้า</span>;
                    }
                    const customer = customers.find(c => c.customerId === value);
                    return customer ? `${customer.firstname} ${customer.lastname}` : "เลือกลูกค้า";
                  }
                }}
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
              >
                <MenuItem value={0} disabled>เลือกลูกค้า</MenuItem>
                {customers.map(c => (
                  <MenuItem key={c.customerId} value={c.customerId}>
                    {c.firstname} {c.lastname}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {showDateFields && (
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
                  ระยะเวลาการเช่า
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField 
                    fullWidth 
                    size="small"
                    label="วันที่เข้า" 
                    name="checkinDate" 
                    type="date"
                    InputLabelProps={{ shrink: true }} 
                    value={form.checkinDate ?? ""} 
                    onChange={handleFieldChange}
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
                  <TextField 
                    fullWidth 
                    size="small"
                    label="วันที่ออก" 
                    name="checkoutDate" 
                    type="date"
                    InputLabelProps={{ shrink: true }} 
                    value={form.checkoutDate ?? ""} 
                    onChange={handleFieldChange}
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
              </Box>
            )}

            {showMonthFields && (
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
                  ระยะเวลาการเช่า
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <TextField 
                    fullWidth 
                    size="small"
                    label="เดือนเริ่มต้น" 
                    name="startMonth" 
                    type="month"
                    InputLabelProps={{ shrink: true }} 
                    value={form.startMonth ?? ""} 
                    onChange={handleFieldChange}
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
                  <TextField 
                    fullWidth 
                    size="small"
                    label="เดือนสิ้นสุด" 
                    name="endMonth" 
                    type="month"
                    InputLabelProps={{ shrink: true }} 
                    value={form.endMonth ?? ""} 
                    onChange={handleFieldChange}
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
              </Box>
            )}

            {form.rentType && (
              <Box sx={{ mt: 1 }}>
                <Divider sx={{ mb: 2.5, borderColor: "#e2e8f0" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 600, 
                    color: "#334155",
                    fontSize: "0.8rem"
                  }}
                >
                  อุปกรณ์/บริการเสริม (ถ้ามี)
                </Typography>
                
                {filteredExtras.length === 0 ? (
                  <Box 
                    sx={{ 
                      p: 4, 
                      textAlign: "center", 
                      bgcolor: "#f8fafc",
                      borderRadius: 1.5,
                      border: "1px dashed #cbd5e1"
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                      ไม่มีรายการเสริมที่เลือกได้
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {filteredExtras.map(ex => {
                      const sel = selectedExtras[ex.extraId];
                      return (
                        <Box 
                          key={ex.extraId} 
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: sel ? "#0f172a" : "#e2e8f0",
                            bgcolor: sel ? "#f8fafc" : "#ffffff",
                            transition: "all 0.2s ease",
                            flexWrap: { xs: "wrap", md: "nowrap" },
                            gap: 1.5,
                            "&:hover": {
                              borderColor: sel ? "#0f172a" : "#cbd5e1",
                              bgcolor: "#f8fafc"
                            }
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                            <Checkbox 
                              checked={!!sel} 
                              onChange={() => toggleExtra(ex)}
                              size="small"
                              sx={{ 
                                p: 0,
                                color: "#cbd5e1",
                                "&.Mui-checked": { color: "#0f172a" }
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 600, color: "#0f172a", mb: 0.5, fontSize: "0.85rem" }}>
                                {ex.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>
                                  ฿{ex.price.toLocaleString()}
                                </Typography>
                                <Chip 
                                  label={ex.chargeType === "one-time" ? "ครั้งเดียว" : "รายเดือน"}
                                  size="small"
                                  sx={{ 
                                    height: 18,
                                    fontSize: "0.65rem",
                                    bgcolor: "#e2e8f0",
                                    color: "#64748b",
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          {sel && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => changeExtraQty(ex.extraId, -1)}
                                sx={{ 
                                  bgcolor: "#e2e8f0",
                                  width: 28,
                                  height: 28,
                                  "&:hover": { bgcolor: "#cbd5e1" }
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              
                              <TextField 
                                value={sel.qty} 
                                onChange={(e) => setExtraQtyDirect(ex.extraId, Number(e.target.value || 1))}
                                size="small"
                                inputProps={{ 
                                  inputMode: "numeric", 
                                  pattern: "[0-9]*", 
                                  style: { 
                                    textAlign: "center", 
                                    width: 40,
                                    padding: "6px",
                                    fontWeight: 600,
                                    fontSize: "0.85rem"
                                  } 
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    bgcolor: "#ffffff",
                                    borderRadius: 1,
                                    "& fieldset": { borderColor: "#e2e8f0" }
                                  }
                                }}
                              />
                              
                              <IconButton 
                                size="small" 
                                onClick={() => changeExtraQty(ex.extraId, 1)}
                                sx={{ 
                                  bgcolor: "#e2e8f0",
                                  width: 28,
                                  height: 28,
                                  "&:hover": { bgcolor: "#cbd5e1" }
                                }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>

                              <Typography 
                                sx={{ 
                                  ml: 1, 
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  minWidth: 70,
                                  textAlign: "right",
                                  fontSize: "0.85rem"
                                }}
                              >
                                ฿{(sel.unitPrice * sel.qty).toLocaleString()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            mt: 4,
            pt: 3,
            borderTop: "1px solid #e2e8f0",
            flexDirection: { xs: "column-reverse", sm: "row" }
          }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={submitRent}
              sx={{
                py: 1.2,
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: 1.5,
                bgcolor: "#0f172a",
                color: "#ffffff",
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
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#94a3b8" }} />
              ) : (
                "ยืนยันการเช่า"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/admin_home")}
              sx={{
                py: 1.2,
                fontWeight: 600,
                fontSize: "0.85rem",
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
        </Paper>
      </Container>
    </Box>
  );
};

export default RentRoomPage;