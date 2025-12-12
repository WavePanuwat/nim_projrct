'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.FC, requiredRole: string) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(false); // ใช้เพื่อกันไม่ให้ render หน้าโดยไม่จำเป็น

    useEffect(() => {
      const session = sessionStorage.getItem("userSession");

      if (!session) {
        router.replace("/login");
        return;
      }

      const parsedSession = JSON.parse(session);
      const userRole = parsedSession.role;

      if (userRole !== requiredRole) {
        router.replace("/login");
        return;
      }

      setIsAllowed(true); // role ถูกต้อง สามารถแสดงหน้าได้
    }, [router]);

    if (!isAllowed) return null; // ป้องกันหน้าเด้งแวบก่อน redirect

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
