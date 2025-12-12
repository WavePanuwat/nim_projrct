'use client';

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Chip, CircularProgress } from "@mui/material";
import Sidebar from "@/app/utils/components/sidebar";
import axios from "axios";
import withAuth from "@/app/utils/hocs/withAuth";

interface Invoice {
  invoiceId: number;
  roomNumber: string;
  rentType: string;
  baseRent: number;
  acFee: number;
  waterUnit?: number;
  electricUnit?: number;
  waterRate?: number;
  electricRate?: number;
  totalAmount: number;
  status: string;
  startDate: string;
  endDate: string;
}

const CustomerInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // ตรวจสอบ session ก่อน
        const session = sessionStorage.getItem("userSession");
        if (!session) throw new Error("ไม่พบ session ของผู้ใช้");

        const user = JSON.parse(session);
        const customerId = user.userData?.customerId;
        if (!customerId) throw new Error("ไม่พบ customerId ใน session");

        console.log("Fetching invoices for customerId:", customerId);

        const res = await axios.get<Invoice[]>(
          `http://localhost:8081/api/invoices/customer/${customerId}`
        );

        console.log("Invoices response:", res.data);
        setInvoices(res.data);
      } catch (error: any) {
        console.error("Error fetching invoices:", error);
        alert(`ไม่สามารถโหลดข้อมูลใบแจ้งหนี้ได้: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "success";
      case "unpaid": return "warning";
      case "overdue": return "error";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar role="CUSTOMER" />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          ใบแจ้งหนี้ของฉัน
        </Typography>

        {invoices.length === 0 ? (
          <Typography>ไม่มีใบแจ้งหนี้</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {invoices.map(inv => {
              const waterFee = (inv.waterUnit || 0) * (inv.waterRate || 0);
              const electricFee = (inv.electricUnit || 0) * (inv.electricRate || 0);

              return (
                <Paper
                  key={inv.invoiceId}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 3,
                    background: 'linear-gradient(to bottom right, #ffffff, #e3f2fd)'
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="h6">ห้อง {inv.roomNumber}</Typography>
                    <Chip label={inv.status} color={getStatusColor(inv.status)} />
                  </Box>

                  <Typography>ประเภทเช่า: {inv.rentType}</Typography>
                  <Typography>ระยะเวลา: {inv.startDate} - {inv.endDate}</Typography>
                  <Typography>ค่าเช่า: {inv.baseRent} บาท</Typography>
                  <Typography>ค่าแอร์: {inv.acFee} บาท</Typography>

                  {inv.rentType === "monthly" && (
                    <>
                      <Typography>ค่าน้ำ: {waterFee} บาท ({inv.waterUnit} x {inv.waterRate})</Typography>
                      <Typography>ค่าไฟ: {electricFee} บาท ({inv.electricUnit} x {inv.electricRate})</Typography>
                    </>
                  )}

                  <Typography sx={{ fontWeight: "bold", mt: 1 }}>รวม: {inv.totalAmount} บาท</Typography>
                </Paper>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default withAuth(CustomerInvoices, "CUSTOMER");
