
"use client"
import Image from "next/image"
import jwt from "jsonwebtoken"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Home, FolderClosed, Plus, Activity, User, Bell, Calendar, LayoutDashboard, SmilePlus, LogOut, Mail, Menu, Users, X, GraduationCap, Briefcase, Search, ChevronDown, DollarSign, DollarSignIcon } from "lucide-react"
import { useRouter ,usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconMoneybag, IconPigMoney } from "@tabler/icons-react"
import { useSelector } from "react-redux"

function Navbar2() {
  const [user, setUser] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  // const [userData, setUserData] = useState({ collegeName: '', name: '' })
  const router = useRouter()
  const pathname = usePathname()

  const logoutUser = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    console.log('Loged out')
    router.replace("/login");
  };

  const userData = useSelector((state) => state?.userInfo?.userData)
  console.log("🚀 ~ Navbar2 ~ userData:", userData)



  const navItems = [
    { name: "Reconnect", href: "/reconnect", icon: <Users className="h-4 w-4 mr-2" /> },
    { name: "Careers", href: "/jobposts", icon: <Search className="h-4 w-4 mr-2" /> },
    { name: "Messages", href: "/chat", icon: <Mail className="h-4 w-4 mr-2" /> },
    { name: "Memories", href: "/memories", icon: <SmilePlus className="h-4 w-4 mr-2" /> },
    { name: "Campus", href: "/student-hub", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: "Donation", href: "/donation", icon: <DollarSignIcon className="h-4 w-4 mr-2" /> },
  ]

  const mobileNavItems = [
    { name: "Home", href: "/home", icon: <Home className="h-5 w-5" /> },
    { name: "Reconnect", href: "/reconnect", icon: <Users className="h-5 w-5" /> },
    { name: "Careers", href: "/jobposts", icon: <Search className="h-5 w-5" /> },
    { name: "Memories", href: "/memories", icon: <SmilePlus className="h-5 w-5" /> },
   { name: "Messages", href: "/chat", icon: <Mail className="h-5 w-5" /> },
    // { name: "Profile", href: `/profile/${userData?._id}`, icon: 
    //   <Avatar className="h-6 w-6">
    //     <AvatarImage src={userData?.profileImage} alt={userData?.name} />
    //     <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
    //   </Avatar>
    // },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:block hidden">
        <div className="max-w-[2200px] mx-auto flex h-16 items-center justify-between px-4" id="nav">
          <Link href="/home" className="flex items-center space-x-2">
           <Image src="/image/ntu-logo.png" alt="NTU Logo" width={40} height={40} priority />
            <span className="font-bold text-2xl text-black">{userData?.collegeName  ||"NTU AMS"}</span>
          </Link>

          <nav className="flex gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 m-4 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.profileImage} alt={userData?.name} />
                    <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${userData?.userId?.name}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutUser}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="sticky top-0 z-50 p-10 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:hidden">
        <div className="container flex p-10 h-16 items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2">
          <Image src="/image/ntu-logo.png" alt="NTU Logo" width={35} height={35} priority />
            <span className="font-bold text-lg text-black">{pathname === '/' ? "AMS":userData?.collegeName  ||"AMS"}</span>
          </Link>
          <div className="flex items-center gap-4">
          <Link href={"/student-hub"}>
          <div className="flex items-center justify-center -mx-3 w-10 h-10 rounded-full ">
              <Calendar className="h-6 w-6 text-black" />
            </div></Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 m-4 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.profileImage} alt={userData?.name} />
                    <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${userData?.userId?.name}`}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutUser}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-xl text-black">  {{pathname}=='/' ? userData?.collegeName : "NTU AMS"}</span>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <SheetClose asChild key={item.name}>
                  <Link href={item.href} className="text-lg font-semibold hover:text-blue-600 transition-colors flex items-center">
                    {item.icon}
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-40 w-full h-14 bg-blue-50 rounded-t-3xl md:hidden">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto relative">
          {mobileNavItems.slice(0, 2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
            >
              {item.icon}
              <span className="text-xs text-gray-500 group-hover:text-blue-600">{item.name}</span>
            </Link>
          ))}
          
          {/* Center Plus Button */}
          {/* <div className="flex items-center justify-center">
            <button onClick={() => router.push("/jobposts")} className="absolute -top-2 inline-flex items-center justify-center w-12 h-12 bg-black rounded-full">
              <Search className="h-6 w-6 text-white" />
            </button>
          </div> */}

          {mobileNavItems.slice(2).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
            >
              {item.icon}
              <span className="text-xs text-gray-500 group-hover:text-blue-600">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default Navbar2

