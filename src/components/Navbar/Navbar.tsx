
"use client"
import React from 'react'
import { FloatingNav } from '../ui/floating-navbar'
import { useSession } from "next-auth/react";

function Navbar() {
    const { data: session } = useSession();
     const isCreator = session?.user?.role === "creator";
    const navItems = [
        { name: "Home", link: "/" },
        ...(session?.user?.role === "admin" ? [{ name: "Admin", link: "/admin" }] : []),
         ...(isCreator ? [{ name: "Create Trip", link: "/trip/create" }] : []),
         ...(isCreator ? [{ name: "my profile", link: `/creator/${session.user.id}` }] : []),
         { name: "my-bookings", link: "/my-bookings" },
        { name: "packages", link: "/packages" },
        // { name: "contact", link: "/contact" },
        // { name: "About", link: "/about" },
       
      ];
  return (
    
<div>
{/* Main content */}
<FloatingNav navItems={navItems} />
</div>
  )
}

export default Navbar