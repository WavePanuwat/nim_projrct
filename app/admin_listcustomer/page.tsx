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
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240 }}>
        <Sidebar role="ADMIN" />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          รายชื่อลูกค้า
        </Typography>

        {/* Add button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddClick}
            sx={{
              backgroundColor: "#1e3a8a",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: "8px",
              boxShadow: "0px 3px 8px rgba(30,58,138,0.3)",
              "&:hover": {
                backgroundColor: "#2a50a2",
                boxShadow: "0px 4px 10px rgba(30,58,138,0.35)",
              },
            }}
          >
            เพิ่มลูกค้า
          </Button>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#1e3a8a" }}>
              <TableRow>
                <TableCell sx={{ color: "#FFFFFF" }}>รหัสบัตรประชาชน</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>ชื่อ-นามสกุล</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>เบอร์โทร</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>ที่อยู่</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>จัดการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.customerId}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#eef2ff",
                    },
                  }}
                >
                  <TableCell>{customer.idCard}</TableCell>
                  <TableCell>{customer.firstname} {customer.lastname}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        mr: 1,
                        borderRadius: "6px",
                        textTransform: "none",
                        borderColor: "#1e40af",
                        color: "#1e40af",
                        "&:hover": { backgroundColor: "#e0e7ff" },
                      }}
                      onClick={() => handleEditClick(customer.customerId)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{
                        borderRadius: "6px",
                        textTransform: "none",
                        borderColor: "#dc2626",
                        color: "#dc2626",
                        "&:hover": { backgroundColor: "#fee2e2" },
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
      </Box>
    </Box>
  );
};

export default withAuth(ListCustomerPage, "ADMIN");
