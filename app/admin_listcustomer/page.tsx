'use client';

import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

const ListCustomerPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
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

    const togglePasswordVisibility = (id: number) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

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
            setCustomers(customers.filter(c => c.customerId !== customerId));
        } catch (error) {
            console.error("Error deleting customer:", error);
            alert("เกิดข้อผิดพลาดในการลบลูกค้า");
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Box sx={{ width: 240 }}>
                <Sidebar role="ADMIN" />
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ textAlign: "center", mb: 2, color: "#20335cff" }}>
                    รายชื่อลูกค้า
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        sx={{ 
                            backgroundColor: "#20335cff", 
                            color: "white", 
                            "&:hover": { backgroundColor: "#2a50a2ff" } 
                        }}
                    >
                        เพิ่มลูกค้า
                    </Button>
                </Box>

                <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: "#20335cff" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#FFFFFF" }}>รหัสบัตรประชาชน</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>ชื่อ-นามสกุล</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>เบอร์โทร</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>รหัสผ่าน</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>ที่อยู่</TableCell>
                                <TableCell sx={{ color: "#FFFFFF" }}>จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.customerId} hover>
                                    <TableCell>{customer.idCard}</TableCell>
                                    <TableCell>{customer.firstname} {customer.lastname}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>
                                        {visiblePasswords[customer.customerId] ? customer.password : "*********"}
                                        <Button
                                            onClick={() => togglePasswordVisibility(customer.customerId)}
                                            size="small"
                                            sx={{ ml: 1, textTransform: "none", color: "#1976d2" }}
                                        >
                                            {visiblePasswords[customer.customerId] ? "ซ่อน" : "แสดง"}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1, borderColor: "#1976d2", color: "#1976d2", "&:hover": { backgroundColor: "#E3F2FD" } }}
                                            onClick={() => handleEditClick(customer.customerId)}
                                        >
                                            แก้ไข
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{ borderColor: "#EF4444", color: "#EF4444", "&:hover": { backgroundColor: "#FEE2E2" } }}
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
