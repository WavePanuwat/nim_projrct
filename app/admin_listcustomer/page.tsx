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
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
    }}>
      <Sidebar role="ADMIN" />

      <Box sx={{ flexGrow: 1, p: 5 }}>
        <Paper sx={{
          p: 5,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
          backgroundColor: "#fff"
        }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mb: 4
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  letterSpacing: "-0.5px",
                  mb: 0.5
                }}
              >
                รายชื่อลูกค้า
              </Typography>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                จัดการข้อมูลลูกค้าทั้งหมด
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleAddClick}
              sx={{
                backgroundColor: "#2c3e50",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(44, 62, 80, 0.2)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#34495e",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(44, 62, 80, 0.3)",
                },
              }}
            >
              + เพิ่มลูกค้า
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "none",
              border: "1px solid #e9ecef"
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                  <TableCell sx={{ 
                    color: "#2c3e50", 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e9ecef"
                  }}>
                    รหัสบัตรประชาชน
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#2c3e50", 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e9ecef"
                  }}>
                    ชื่อ-นามสกุล
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#2c3e50", 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e9ecef"
                  }}>
                    เบอร์โทร
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#2c3e50", 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e9ecef"
                  }}>
                    ที่อยู่
                  </TableCell>
                  <TableCell sx={{ 
                    color: "#2c3e50", 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "2px solid #e9ecef"
                  }}>
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow
                    key={customer.customerId}
                    sx={{
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                      "&:last-child td": {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      color: "#495057",
                      fontSize: "0.95rem",
                      borderBottom: "1px solid #f1f3f5"
                    }}>
                      {customer.idCard}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#2c3e50",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      borderBottom: "1px solid #f1f3f5"
                    }}>
                      {customer.firstname} {customer.lastname}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#495057",
                      fontSize: "0.95rem",
                      borderBottom: "1px solid #f1f3f5"
                    }}>
                      {customer.phone}
                    </TableCell>
                    <TableCell sx={{ 
                      color: "#6c757d",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #f1f3f5"
                    }}>
                      {customer.address}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #f1f3f5" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          mr: 1,
                          borderRadius: 1.5,
                          textTransform: "none",
                          borderColor: "#dee2e6",
                          color: "#2c3e50",
                          fontWeight: 500,
                          px: 2,
                          transition: "all 0.2s ease",
                          "&:hover": { 
                            backgroundColor: "#f8f9fa",
                            borderColor: "#2c3e50",
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
                          borderRadius: 1.5,
                          textTransform: "none",
                          borderColor: "#dee2e6",
                          color: "#dc3545",
                          fontWeight: 500,
                          px: 2,
                          transition: "all 0.2s ease",
                          "&:hover": { 
                            backgroundColor: "#fff5f5",
                            borderColor: "#dc3545",
                            transform: "translateY(-1px)"
                          },
                        }}
                        onClick={() => handleDelete(customer.customerId)}
                      >
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {customers.length === 0 && (
            <Box sx={{ 
              textAlign: "center", 
              py: 8,
              color: "#adb5bd"
            }}>
              <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
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