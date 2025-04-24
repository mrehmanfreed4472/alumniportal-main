'use client'
import Image from "next/image"
import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogin = () => router.push('/login')
  const handleCollegeRegistration = () => router.push('/collegeRegistration')

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      // Hash link handling
      const hash = href.substring(1)
      if (pathname === '/') {
        // If already on homepage, scroll to section
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          // Update URL hash without page reload
          window.history.replaceState(null, null, `#${hash}`)
        }
      } else {
        // If on different page, navigate to homepage first
        router.push(`/#${hash}`)
      }
    } else if (href.includes('#')) {
      // Handle absolute paths with hash
      const [path, hash] = href.split('#')
      if (pathname === path) {
        // Same page hash link
        const element = document.getElementById(hash)
        element?.scrollIntoView({ behavior: "smooth" })
        window.history.replaceState(null, null, href)
      } else {
        // Different page with hash
        router.push(href).then(() => {
          setTimeout(() => {
            const element = document.getElementById(hash)
            element?.scrollIntoView({ behavior: "smooth" })
          }, 100) // Small delay for page transition
        })
      }
    } else {
      // Regular navigation
      router.push(href)
    }
  }

  // Updated navItems with proper hash handling
  const navItems = [
    { name: "Career", href: "/career" },
    { name: "Events", href: "#events" },
    { name: "Feedback", href: "/review" },
    { name: "Alumni", href: "#alumni" },
    { name: "About", href: "/about" },
  ]

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 md:block hidden">
      <header>
        <div className="max-w-[2200px] mx-auto flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/image/ntu-logo.png" alt="NTU Logo" width={35} height={35} priority />
            <span className="font-bold text-2xl text-black">NTU AMS</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-lg font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="mx-1">
            <Button onClick={handleCollegeRegistration} className="hidden md:inline-flex" variant="outline" size="lg">
              College Registration
            </Button>
            <Button onClick={handleLogin} className="hidden md:inline-flex bg-[#A51C30]" size="lg">
              Login
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-2xl text-black">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" />
                  </SheetClose>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="text-2xl font-semibold hover:text-blue-600 transition-colors text-left"
                      >
                        {item.name}
                      </button>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto">
                  <SheetClose asChild>
                    <Button onClick={handleCollegeRegistration} variant="outline" size="lg" className="w-full mt-4">
                      College Registration
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button size="lg" className="w-full mt-1 bg-[#A51C30]" onClick={handleLogin}>
                      Login
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  )
}