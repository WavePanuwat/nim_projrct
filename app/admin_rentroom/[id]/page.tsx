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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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

  const extrasTotal = Object.values(selectedExtras).reduce((sum, it) => sum + it.unitPrice * it.qty, 0);

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#fafafa"
    }}>
      <Sidebar role="ADMIN" />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#fff"
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                mb: 1
              }}
            >
              เช่าห้องพัก
            </Typography>
            <Box 
              sx={{ 
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                gap: 1
              }}
            >
              <Typography variant="body1" component="span">
                หมายเลขห้อง
              </Typography>
              <Chip 
                label={room ? room.roomNumber : "กำลังโหลด..."} 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  bgcolor: "#f3f4f6",
                  color: "#111827"
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

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
                ประเภทการเช่า
              </Typography>
              <TextField 
                select 
                fullWidth 
                value={form.rentType}
                onChange={(e) => handleRentTypeChange(e.target.value)}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value) {
                      return <span style={{ color: "#9ca3af" }}>-- เลือกประเภท --</span>;
                    }
                    return value === "daily" ? "รายวัน" : "รายเดือน";
                  }
                }}
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
              >
                <MenuItem value="" disabled>-- เลือกประเภท --</MenuItem>
                <MenuItem value="daily">รายวัน</MenuItem>
                <MenuItem value="monthly">รายเดือน</MenuItem>
              </TextField>
            </Box>

            {/* Customer Selection */}

            {/* Customer Selection */}
            {/* Customer Selection */}
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1.5, 
                  fontWeight: 500, 
                  color: "#374151" 
                }}
              >
                ข้อมูลลูกค้า
              </Typography>
              <TextField 
                select 
                fullWidth 
                name="customerId" 
                value={form.customerId}
                onChange={handleFieldChange}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value: any) => {
                    if (!value || value === 0) {
                      return <span style={{ color: "#9ca3af" }}>-- เลือกลูกค้า --</span>;
                    }
                    const customer = customers.find(c => c.customerId === value);
                    return customer ? `${customer.firstname} ${customer.lastname}` : "-- เลือกลูกค้า --";
                  }
                }}
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
              >
                <MenuItem value={0} disabled>-- เลือกลูกค้า --</MenuItem>
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
                    mb: 1.5, 
                    fontWeight: 500, 
                    color: "#374151" 
                  }}
                >
                  ระยะเวลาการเช่า
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField 
                    fullWidth 
                    label="วันที่เข้า" 
                    name="checkinDate" 
                    type="date"
                    InputLabelProps={{ shrink: true }} 
                    value={form.checkinDate ?? ""} 
                    onChange={handleFieldChange}
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
                  <TextField 
                    fullWidth 
                    label="วันที่ออก" 
                    name="checkoutDate" 
                    type="date"
                    InputLabelProps={{ shrink: true }} 
                    value={form.checkoutDate ?? ""} 
                    onChange={handleFieldChange}
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
            )}
            {showMonthFields && (
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5, 
                    fontWeight: 500, 
                    color: "#374151" 
                  }}
                >
                  ระยะเวลาการเช่า
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <TextField 
                    fullWidth 
                    label="เดือนเริ่มต้น" 
                    name="startMonth" 
                    type="month"
                    InputLabelProps={{ shrink: true }} 
                    value={form.startMonth ?? ""} 
                    onChange={handleFieldChange}
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
                  <TextField 
                    fullWidth 
                    label="เดือนสิ้นสุด" 
                    name="endMonth" 
                    type="month"
                    InputLabelProps={{ shrink: true }} 
                    value={form.endMonth ?? ""} 
                    onChange={handleFieldChange}
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
            )}

            {form.rentType && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 2.5, 
                    fontWeight: 500, 
                    color: "#374151" 
                  }}
                >
                  อุปกรณ์/บริการเสริม (ถ้ามี)
                </Typography>
                
                {filteredExtras.length === 0 ? (
                  <Box 
                    sx={{ 
                      p: 4, 
                      textAlign: "center", 
                      bgcolor: "#fafafa",
                      borderRadius: 2,
                      border: "1px dashed #e5e7eb"
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
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
                            p: 2.5,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: sel ? "#111827" : "#e5e7eb",
                            bgcolor: sel ? "#fafafa" : "#fff",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: sel ? "#111827" : "#d1d5db",
                              bgcolor: "#fafafa"
                            }
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Checkbox 
                              checked={!!sel} 
                              onChange={() => toggleExtra(ex)}
                              sx={{ 
                                p: 0,
                                color: "#d1d5db",
                                "&.Mui-checked": { color: "#111827" }
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 500, color: "#111827", mb: 0.5 }}>
                                {ex.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                                  ฿{ex.price.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#d1d5db" }}>•</Typography>
                                <Chip 
                                  label={ex.chargeType === "one-time" ? "ครั้งเดียว" : "รายเดือน"}
                                  size="small"
                                  sx={{ 
                                    height: 20,
                                    fontSize: "0.7rem",
                                    bgcolor: "#f3f4f6",
                                    color: "#6b7280"
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
                                  bgcolor: "#f3f4f6",
                                  "&:hover": { bgcolor: "#e5e7eb" }
                                }}
                              >
                                <RemoveIcon fontSize="small" />
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
                                    padding: "6px"
                                  } 
                                }}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    bgcolor: "#fff",
                                    "& fieldset": { borderColor: "#e5e7eb" }
                                  }
                                }}
                              />
                              
                              <IconButton 
                                size="small" 
                                onClick={() => changeExtraQty(ex.extraId, 1)}
                                sx={{ 
                                  bgcolor: "#f3f4f6",
                                  "&:hover": { bgcolor: "#e5e7eb" }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>

                              <Typography 
                                sx={{ 
                                  ml: 2, 
                                  fontWeight: 600,
                                  color: "#111827",
                                  minWidth: 70,
                                  textAlign: "right"
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
            mt: 5,
            pt: 4,
            borderTop: "1px solid #e5e7eb"
          }}>
            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              onClick={submitRent}
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
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#9ca3af" }} />
              ) : (
                "ยืนยัน"
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/admin_home")}
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
        </Paper>
      </Container>
    </Box>
  );
};

export default RentRoomPage;