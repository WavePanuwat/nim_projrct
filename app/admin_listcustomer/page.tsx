'use client';

import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import withAuth from "@/app/utils/hocs/withAuth";
import Sidebar from "@/app/utils/components/sidebar";

interface Customer {
  customerId: number;
  phone: string;
  firstname: string;
  lastname: string;
  idCard: string;
  address: string;
}

const ListCustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/customers/list");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddClick = () => {
    router.push("/admin_addcustomer");
  };

  const handleEditClick = (customerId: number) => {
    router.push(`/admin_editcustomer/${customerId}`);
  };

  const handleDelete = async (customerId: number) => {
    if (!confirm("คุณต้องการลบลูกค้ารายนี้จริงหรือไม่?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/customers/delete/${customerId}`);
      setCustomers(customers.filter((c) => c.customerId !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("เกิดข้อผิดพลาดในการลบลูกค้า");
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#f8fafc"
    }}>
      <Sidebar role="ADMIN" />

      <Box sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 } }}>
        <Paper sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          backgroundColor: "#fff"
        }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2
          }}>
            <Box>
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
                รายชื่อลูกค้า
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                จัดการข้อมูลลูกค้าทั้งหมด
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleAddClick}
              sx={{
                backgroundColor: "#0f172a",
                color: "white",
                px: 3,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.85rem",
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#1e293b",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.2)",
                  transform: "translateY(-1px)"
                },
              }}
            >
              + เพิ่มลูกค้า
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 1.5,
              overflow: "hidden",
              boxShadow: "none",
              border: "1px solid #e2e8f0"
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ 
                    color: "#0f172a", 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5
                  }}>
                    รหัสบัตรประชาชน
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#0f172a", 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5
                  }}>
                    ชื่อ-นามสกุล
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#0f172a", 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5
                  }}>
                    เบอร์โทร
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#0f172a", 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5
                  }}>
                    ที่อยู่
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#0f172a", 
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5,
                    width: 180
                  }}>
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customers.map((customer) => (
                  <TableRow
                    key={customer.customerId}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                      "&:last-child td": {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      color: "#475569",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #f1f5f9",
                      py: 1.5
                    }}>
                      {customer.idCard}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#0f172a",
                      fontWeight: 500,
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #f1f5f9",
                      py: 1.5
                    }}>
                      {customer.firstname} {customer.lastname}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#475569",
                      fontSize: "0.85rem",
                      borderBottom: "1px solid #f1f5f9",
                      py: 1.5
                    }}>
                      {customer.phone}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#64748b",
                      fontSize: "0.8rem",
                      borderBottom: "1px solid #f1f5f9",
                      py: 1.5
                    }}>
                      {customer.address}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #f1f5f9", py: 1.5 }}>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            minWidth: 70,
                            borderRadius: 1,
                            textTransform: "none",
                            borderColor: "#3b82f6",
                            bgcolor: "#ffffff",
                            color: "#3b82f6",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": { 
                              borderColor: "#2563eb",
                              bgcolor: "#eff6ff",
                              color: "#2563eb",
                              transform: "translateY(-1px)"
                            },
                          }}
                          onClick={() => handleEditClick(customer.customerId)}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            minWidth: 70,
                            borderRadius: 1,
                            textTransform: "none",
                            borderColor: "#ef4444",
                            bgcolor: "#ffffff",
                            color: "#ef4444",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            px: 1.5,
                            py: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": { 
                              borderColor: "#dc2626",
                              bgcolor: "#fef2f2",
                              color: "#dc2626",
                              transform: "translateY(-1px)"
                            },
                          }}
                          onClick={() => handleDelete(customer.customerId)}
                        >
                          ลบ
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {customers.length === 0 && (
            <Box sx={{ 
              textAlign: "center", 
              py: 6,
              color: "#94a3b8"
            }}>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                ยังไม่มีข้อมูลลูกค้า
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default withAuth(ListCustomerPage, "ADMIN");