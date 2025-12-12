'use client';

import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import withAuth from "@/app/utils/hocs/withAuth";
import Sidebar from "@/app/utils/components/Sidebar";

const AddCustomerPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        firstname: "",
        lastname: "",
        idCard: "",
        address: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8081/api/customers/add", formData);
            alert("เพิ่มลูกค้าสำเร็จ");
            router.push("/admin_listcustomer");
        } catch (error: any) {
            console.error("Error adding customer:", error);
            alert(error.response?.data || "เกิดข้อผิดพลาดในการเพิ่มลูกค้า");
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Box sx={{ width: 240 }}>
                <Sidebar role="ADMIN" />
            </Box>

            {/* Main Content */}
            <Container sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
                    เพิ่มลูกค้าใหม่
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="รหัสบัตรประชาชน"
                        name="idCard"
                        value={formData.idCard}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="ชื่อ"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="นามสกุล"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="เบอร์โทร"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="รหัสผ่าน"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="ที่อยู่"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />

                    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                backgroundColor: "#1976d2",
                                "&:hover": { backgroundColor: "#1565c0" }
                            }}
                        >
                            เพิ่มลูกค้า
                        </Button>
                    </Box>
                </form>
            </Container>
        </Box>
    );
};

export default withAuth(AddCustomerPage, "ADMIN");
