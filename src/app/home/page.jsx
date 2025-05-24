"use client"

import jwt from "jsonwebtoken"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, Calendar, LayoutDashboard, LogOut, Mail, Menu, User, Users, X, GraduationCap, Briefcase, Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navbar2 from "@/components/header/Navbar2"

import { useToast } from "@/hooks/use-toast"
import Footer from "@/components/footer/Footer"
import { useDispatch, useSelector } from "react-redux"
import { getAlumniInfo, getStudentInfo } from "@/features/auth/userInfoSlice"
import { getToken, getUser, isAuthenticated } from "@/services/checkAuth"
import { getAlumniList } from "@/features/alumni/alumniSlice"

const description1=["Stay connected with your Alumni and fellow classmates. Explore the latest updates and opportunities.","Stay connected with your alma mater and fellow alumni. Explore the latest updates and opportunities."]


export default function AlumniHome() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const toggleMenu = () => setIsOpen(!isOpen)
  const isLoading = useSelector((state) => state.userInfo.loading);
  const userData = useSelector((state) => state?.userInfo?.userData);
  console.log("🚀 ~ AlumniHome ~ userData:", userData)

  const alumniList = useSelector((state) => state?.alumniList?.alumniList)
  console.log("✅s AlumniHome ~ alumniList:", alumniList)

  const user = getUser();
  const userID = user?._id;
  const token = getToken();
  console.log("🚀 ~ AlumniHome ~ token:", token)
  console.log("🚀 ~ AlumniHome ~ user:", user)
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Fetch alumni list only once when component mounts
  useEffect(() => {
    dispatch(getAlumniList());
  }, [dispatch]);

  // Fix for infinite re-renders: Use useRef to track if we've already started the auth check
  const hasCheckedAuth = useRef(false);
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    // Only run this effect once and if we have a userID and role
    if (hasCheckedAuth.current || hasRedirected.current || !userID || !user?.role) {
      return;
    }
    
    hasCheckedAuth.current = true;
    
    const runCheck = async () => {
      if (!isAuthenticated()) {
        hasRedirected.current = true;
        router.replace("/login");
        return;
      }
  
      try {
        let userInfoAction;
        if (user.role === "alumni") {
          userInfoAction = getAlumniInfo(userID);
        } else if (user.role === "student") {
          userInfoAction = getStudentInfo(userID);
        } else {
          return; // Exit if role is neither alumni nor student
        }
        
        const userInfoResult = await dispatch(userInfoAction).unwrap();
        
        if (!userInfoResult || Object.keys(userInfoResult).length === 0) {
          hasRedirected.current = true;
          router.replace(`/profile/complete-${user.role}-profile`);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        hasRedirected.current = true;
        router.replace(`/profile/complete-${user.role}-profile`);
  
        toast({
          variant: "destructive",
          title: "Failed to fetch user info",
        });
      }
    };
  
    runCheck();
  }, [userID, user?.role, dispatch, router, toast]);

  return (
    <>
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar2 />
      <main className="container mx-auto flex-1">
          <section id="dashboard" style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/image/NTU-View.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "multiply"
          }} className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r  from-[#A51C30] to-[#D43F56] to-indigo-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome, {user?.name}!
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-zinc-200">
                { 
                  user?.role === "alumni" ? (
                    description1[1]
                  ) : (
                    description1[0]
                  ) 
                }
              </p>
            </div>
          </div>
        </section>

        <section id="events" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Events</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <EventCard
                title="Class of 99 Reunites!"
                date="November 22nd & 23rd, 2025"
                description="69 Years of Legacy: Class of '99 Reunites! : As the Millennium Class of '99 celebrates their 25th Graduation Anniversary, NTU (Faisalabad) proudly welcomes our alumni back to campus.

Dates: November 22nd & 23rd, 2025
Venue: NTU Faiasalabad Campus

A walk down memory lane awaits as we honour their incredible journey and achievements.
#NTU25Years #ClassOf99 #AlumniReunion #ForeveranISMite"
                image="/image/101.png"
              />
              <EventCard
                title="Tech Symposium"
                date="September 5, 2025"
                description="A day-long event featuring talks from distinguished alumni in various tech fields."
                image="/image/event2.jpeg"
              />
              <EventCard
                title="Career Fair for Current Students"
                date="October 10, 2025"
                description="An opportunity for alumni to recruit top talent from their alma mater."
                image="/image/event3.jpeg"
              />
            </div>
          </div>
        </section>
        <section id="alumni" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Featured Alumni</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {alumniList?.alumni?.map((alum) => (
              <AlumniCard
                key={alum?.id?._id}
                name={alum?.id?.name}
                class={alum?.batch}
                position={alum?.jobTitle}
                company={alum?.companyName}
                image={alum?.image || "/image/profileLogo.png"} // fallback image
                _id={alum?.id?._id}
              />
            ))}
            </div>
          </div>
        </section>
        <section id="get-involved" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Get Involved</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InvolvementCard
                icon={<Users className="h-10 w-10 text-[#A51C30]" />}
                title={ user?.role === "alumni" ? ("Mentor a Student") : ("Get Mentorship from Alumni")}
                description={ user?.role === "alumni" ? ("Share your experience and guide current students in their career paths.") : ("Get mentorship from alumni to elevate your career, knowledge, and experience")}
              />
              <InvolvementCard
                icon={<GraduationCap className="h-10 w-10 text-[#A51C30]" />}
                title={ user?.role === "alumni" ? ("Contribute to Scholarships") : ("Get Scholarships from Alumni")}
                description={ user?.role === "alumni" ? ("Help deserving students achieve their dreams by contributing to our scholarship fund.") : ("Recive scholarships from alumni to enhance your education, and unlock future career opportunities")}
              />
              <InvolvementCard
                icon={<Calendar className="h-10 w-10 text-[#A51C30]" />}
                title="Organize Alumni Meetups"
                description="Bring together alumni in one place for networking and nostalgia."
              />
            </div>
          </div>
        </section>

      </main>
      {/* <footer className="container mx-auto border-t bg-white py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
          <p className="text-sm text-gray-500">&copy; 2024 IIT Dhanbad Alumni Association. All rights reserved.</p>
          <nav className="flex gap-4">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-sm text-gray-500 hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:underline">
              Contact Us
            </Link>
          </nav>
        </div>
      </footer> */}
    </div>
    <Footer />
    </>
  )
}

function EventCard({ title, date, description, image }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 100 // Adjust this value to change the number of characters shown initially

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const truncatedDescription = description.length > maxLength 
    ? `${description.substring(0, maxLength)}...` 
    : description

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Image src={image} alt={title} width={400} height={200} className="object-cover h-48 w-full" />
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>
        <p className="text-gray-600 mb-4">
          {isExpanded ? description : truncatedDescription}
        </p>
        {description.length > maxLength && (
          <Button variant="link" onClick={toggleDescription} className="p-0">
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function AlumniCard({ name, class: classYear, position,company , image, _id }) {
  const router = useRouter()
  const [userData, setUserData] = useState({ collegeName: '', name: ''});

  return (
    <Card className="flex flex-col justify-center items-center text-center p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={image} alt={`${name}'s profile`} />
        <AvatarFallback>{name?.split(' ')?.map(n => n[0])?.join('')}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-1">Batch of {classYear}</p>
      <p className="text-sm text-gray-600 mb-4">{position}</p>
      <p className="text-sm text-gray-600 mb-4">At {company}</p>
      <Button onClick={() => { router.push(`/alumni-profile/${_id}`) }} variant="outline">View Profile</Button>
    </Card>
  )
}

function InvolvementCard({ icon, title, description }) {
  const { toast } = useToast()

  const handleWelcomeClick = () => {
    toast({
      variant: "green",
      title: "Request Submitted!",
      description: "We've sent your event participation request to the college team. They'll be in touch soon!",
    })
  }
  return (
    <Card className="flex flex-col items-center text-center p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 p-3 bg-blue-100 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button onClick={handleWelcomeClick}>Get Started</Button>
    </Card>
  )
}