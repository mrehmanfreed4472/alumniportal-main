
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BadgeIcon, GiftIcon, VoteIcon, Menu, Users, BookOpen, Globe, Award } from "lucide-react"
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import ContactForm from '@/components/Contact-form'
import jwt from "jsonwebtoken"
import { useToast } from "@/hooks/use-toast"
import NavForSlash from '@/components/header/NavForSlash'
import Navbar2 from "@/components/header/Navbar2"
import  Testimonial from "@/components/Testimonial"
import Footer from "@/components/footer/Footer"
export default function Component() {
  const [userData, setUserData] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const toggleMenu = () => setIsOpen(!isOpen)
  const handleLogin = () => {
    router.push('/login')
  }
  const handleCollegeRegistration = () => {
    router.push('/collegeRegistration');
  }

  useEffect(() => {
    let user = (localStorage.getItem('amsjbckumr'))
    if(!user){
      return;
    }
    /*user = jwt.verify(user, process.env.NEXT_PUBLIC_JWT_SECRET);*/
    if (user) {
      setUserData(user)
    }
  }, [])
  const navItems = [
    { name:"Career", href: "/career" },
    { name: "Events", href: "#events" },
    { name: "Feedback", href: "#reviews" },
    { name: "Alumni", href: "#alumni" },
    { name: "About", href: "/about" },
   
  ]
  const testimonials = [
    {
      quote:
        "You become a star not because of your title. you become a star because you are adding star value to the NTU",
      name: "DR Muhammad Naeem",
      designation: "Lecturer ,NTU Faisalabad",
      src: "/image/alumni1.jpg",
    },
    {
      quote:
        "As a leader, it's important to focus not only on your own success but also on the success of others.",
      name: "Dr Qamar Khan",
      designation: "Director of Alumni",
      src: "/image/alumni2.jpg",
    },
    {
      quote:
        "Don’t quit. It will happen one day.",
      name: "Dr Muhammad Asif",
      designation: "Deputy Director",
      src: "/image/alumni4.jpg",
    },
    {
      quote:
        "Age doesn't matter if you have the attitude and drive to succeed.",
      name: "Lt. Gernal. Muhammad Asim Munir",
      designation: "CEO of Pakistan",
      src: "/image/alumni5.jpg",
    },
    {
      quote:
        "Life is not about finding yourself. Life is about creating yourself.",
      name: "Rahmatuallah ",
      designation: "Assistant Commissioner",
      src: "/image/alumni3.jpg",
    },
  ];

  const scrollToSection = (href) => {
    //console.log(href.substring(0,1))
    if( href.substring(0,1) === "/"){
      router.push(href);
      return;
    }
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop
          const sectionHeight = section.offsetHeight
          const sectionId = section.getAttribute("id")

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.add("text-[#A51C30]")
          } else {
            document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.remove("text-[#A51C30]")
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
    {userData ? (<Navbar2></Navbar2>):( <NavForSlash />)}
   
      <main className="container mx-auto flex-1">
        <section style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/image/default_bg.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: 'top',
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "multiply"
          }} className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#A51C30] to-[#D43F56] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Welcome to the AMS
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl text-zinc-200">
                Connect with fellow alumni, stay up-to-date on campus news, and get involved in our community.
              </p>
              {userData ? (
            <></>    ):(
                  <div>
             
             <Button
               onClick={() => { router.push('/registration'); }}
               className="bg-white text-[#A51C30] hover:bg-zinc-100 text-sm lg:text-lg px-4 lg:px-6 py-2 lg:py-3"
             >
               Join Now
             </Button>
             <Button
               onClick={handleLogin}
               className="bg-white text-[#A51C30] hover:bg-zinc-100 mx-2 text-sm lg:text-lg px-4 lg:px-6 py-2 lg:py-3"
             >
               Login
             </Button>
           </div>
)}


              
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-7 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          <Link href="/about"><span className="text-[#A51C30]"> About </span>
            </Link>  
               AMS
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-[#A51C30]" />}
                title="Network Expansion"
                description="Connect with a diverse community of professionals across various industries."
              />
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-[#A51C30]" />}
                title="Lifelong Learning"
                description="Access exclusive webinars, workshops, and resources for continuous growth."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-[#A51C30]" />}
                title="Global Opportunities"
                description="Explore international job postings and collaboration possibilities."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-[#A51C30]" />}
                title="Alumni Recognition"
                description="Celebrate achievements and contributions of our distinguished alumni."
              />
            </div>
          </div>
        </section>
        <section id="events" className="w-full py-7 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <EventCard
                title="NTU Tech Meet"
                date="Dec 11-14, 2025"
                description="Greetings, tech enthusiasts and brilliant minds from across World!"
                image="/image/event1.jpeg"
              />
              <EventCard
                title="NTU 57th Sports meet 2025"
                date="Dec 10-17, 2025"
                description="The 2024 Inter Department Sports Meet will be held at Textile Department and IT Department..."
                image="/image/event4.jpg"
              />
              <EventCard
                title="NTU Cultural Meet 7.0"
                date="Dec 26-29, 2025"
                description="The largest showcase of cultural talent across the country"
                image="/image/event5.jpg"
              />
            </div>
            {/* <div className="mt-10 text-center">
              <Button variant="outline" size="lg">
                View All Events
              </Button>
            </div> */}
          </div>
        </section>

        <section id="alumni" className="w-full py-7 md:py-12 lg:py-16 bg-z">
        <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center md:mb-6 -mb-8">
              Featured Alumni
            </h2><AnimatedTestimonials testimonials={testimonials} /></div>
        
          { /*<div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Featured Alumni
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AlumniCard
                name="Jane Doe"
                class="2010"
                position="CEO, Acme Inc."
                image="/image/profileLogo.png"
              />
              <AlumniCard
                name="John Smith"
                class="2015"
                position="Software Engineer, Vercel"
                image="/image/profileLogo.png"
              />
              <AlumniCard
                name="Sarah Lee"
                class="2018"
                position="Nonprofit Director, Acme Foundation"
                image="/image/profileLogo.png"
              />
            </div>
          </div> */}
        </section>
        {/* <section id="get-involved" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Get Involved
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <InvolvementCard
                icon={<VoteIcon className="h-10 w-10 text-[#A51C30]" />}
                title="Volunteer"
                description="Help organize events, mentor students, or serve on a committee."
              />
              <InvolvementCard
                icon={<GiftIcon className="h-10 w-10 text-[#A51C30]" />}
                title="Donate"
                description="Support scholarships, programs, and initiatives that benefit our alumni community."
              />
              <InvolvementCard
                icon={<BadgeIcon className="h-10 w-10 text-[#A51C30]" />}
                title="Mentor"
                description="Share your expertise and experience with current students and recent graduates."
              />
            </div>
          </div>
        </section> */}
        <Testimonial />
        <section id="reviews" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
  <div className="container px-4 md:px-6">
    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
      Share Your Feedback
    </h2>
    <div className="max-w-md mx-auto">
      <p className="text-center mb-4">
        Your feedback helps us improve! Share your experience and let us know how we can make our web app even better.
      </p>
      <ContactForm />
    </div>
  </div>
</section>

      </main>

      <Footer />

    </div>
  )
}

function EventCard({ title, date, description, image }) {
  const { toast } = useToast()

  const handleWelcomeClick = () => {

    toast({
      variant: "red",
      title: "Welcome to the AMS!",
      description: "Log in to access this feature.",
    })
  }
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Image src={image} alt={title} width={400} height={200} className="object-cover h-48 w-full" />
      <CardContent className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button onClick={handleWelcomeClick} variant="outline">Learn More</Button>
      </CardContent>
    </Card>
  )
}

function AlumniCard({ name, class: classYear, position, image }) {
  const { toast } = useToast()

  const handleWelcomeClick = () => {

    toast({
      variant: "red",
      title: "Welcome to the AMS!",
      description: "Log in to access this feature.",
    })
  }
  return (
    <Card className="flex flex-col items-center text-center p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <Image
        src={image}
        alt={`${name}'s profile`}
        width={120}
        height={120}
        className="rounded-full mb-4 border-4 border-blue-100"
      />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-1">Class of {classYear}</p>
      <p className="text-sm text-gray-600 mb-4">{position}</p>
      <Button onClick={handleWelcomeClick} variant="outline">View Profile</Button>
    </Card>
  )
}
function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col items-center text-center p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 p-3 bg-blue-100 rounded-full">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  )
}

function InvolvementCard({ icon, title, description }) {
  const { toast } = useToast()

  const handleWelcomeClick = () => {

    toast({
      variant: "red",
      title: "Welcome to the AMS!",
      description: "Log in to access this feature.",
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

function GraduationCapIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
