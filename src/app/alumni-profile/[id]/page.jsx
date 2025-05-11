"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Github, Users, GraduationCap, Linkedin, Mail, MapPin, Phone, User, Briefcase, Building, MessageCircle, Plus, SmilePlus, ShieldOff, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import ProfileLoading from '@/components/ProfileLoading'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useDispatch, useSelector } from "react-redux"
import Navbar2 from "@/components/header/Navbar2"
import { getAlumniData, getAlumniInfo } from "@/features/auth/userInfoSlice"

export default function ProfileDisplay(userData, isuserAlumni) {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("about")
  const { id } = useParams();
  console.log("🚀 ~ ProfileDisplay ~ id:", id)
  
  const userAlumni = useSelector((state) => state?.userInfo?.alumniData)
  console.log("🚀 ~ ProfileDisplay ~ userAlumni:", userAlumni)
  const [loading, setLoading] = useState(false)

  const [iscurrent, setcurrent] = useState(true) // Simulate the current user
  useEffect(() => {
    if (id) {
      dispatch(getAlumniData(id));
    }
  }, [id, dispatch]);

  const handleConnect = () => {
    toast({
      description: "Connected successfully!",
      variant: "blue",
      duration: 1500
    })
  }

  const handleMessage = () => {
    router.push(`/chat?userId=${userData?.userId?._id}`)
  }

  const handleVerify = () => {
    toast({
      description: "Verification process initiated.",
      variant: "blue",
      duration: 1500
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        description: "URL copied to clipboard!",
        variant: "blue",
        duration: 1500
      })
    }).catch(() => {
      toast({
        description: "Failed to copy URL.",
        variant: "red",
        duration: 1500
      })
    })
  }

  return (
    <div>
      <Navbar2 />
      {loading ? (
        <ProfileLoading />
      ) : (
        <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
          <Card className="w-full max-w-4xl mx-auto overflow-hidden">
            <div className="relative bg-gradient-to-r from-[#A51C30] to-[#C24C5E] pt-20 pb-16 px-4 sm:pt-24 sm:pb-32 sm:px-6 lg:px-8">
              <div className="absolute -bottom-12 left-0 w-full flex justify-center sm:justify-start sm:left-6 lg:left-8">
                <Avatar className="w-[100px] h-[100px] sm:w-32 sm:h-32 border-4 border-white">
                  <AvatarImage src={userAlumni?.profileImage} alt={userAlumni?.userId?.name} />
                  <AvatarFallback>{userAlumni?.userId?.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
              </div>
              <div className="text-white text-center sm:text-left sm:pl-36 lg:pl-40">
                <div className="md:flex gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{userAlumni?.userId?.name}</h1>
                  {userAlumni?.isVerified ? (
                    <Badge variant="success" className="hidden md:flex mr-2 -py-2 px-3 text-xs sm:text-sm text--800 rounded-full">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Verified User
                    </Badge>
                  ) : (
                    <div className="mr-2 hidden md:flex flex-row items-center outline outline-1 outline-red-500 px-3 bg-transparent font-thin text-red-100 text-xs sm:text-xs rounded-full">
                      <ShieldOff className="w-4 h-4 mr-2 text-red-600 font-extrabold" />
                      Non-Verified User
                    </div>
                  )}
                </div>
                <p className="text-sm sm:text-base mt-1">{userAlumni?.experience?.[0]?.role} at {userAlumni?.experience?.[0]?.companyName}</p>
                <div className="mt-2 flex items-center justify-center sm:justify-start">
                  <Users className="w-5 h-5 mr-2" />
                  <p className="text-sm text-white mt-1">{userAlumni?.connections?.length || 0} connections</p>
                </div>
              </div>
            </div>
            <CardContent className="pt-16 pb-6 px-4 sm:px-6 lg:px-8">
              {/* <div className="flex flex-wrap justify-end gap-2 mb-6">
                {iscurrent ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-xs sm:text-sm rounded-sm bg-[#A51C30]  hover:bg-primary/90 hover:text-white text-white">
                        <Plus className="h-4 w-4 mr-1 -ml-1" />
                        Post
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem asChild>
                        <Link href="/postjob">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Share Job</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/memories" className='flex'>
                          <SmilePlus className="mr-2 h-4 w-4" />
                          <span>Share Memories</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
                {iscurrent && !userAlumni?.isVerified && (
                  <Button onClick={handleVerify} variant="default" size="sm" className="bg-blue-600 text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Verify Account</span>
                    <span className="sm:hidden">Verify</span>
                  </Button>
                )}
                {iscurrent ? (
                  <Button onClick={() => router.push('/update-profile')} variant="outline" size="sm" className="mr-2 text-xs sm:text-sm">
                    Edit Profile
                  </Button>
                ) : null}
                {!iscurrent ? (
                  userAlumni?.connectedUsers.includes('1') ? (
                    <Button onClick={handleMessage} size="sm" className="mr-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-600/80 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  ) : (
                    <Button onClick={handleConnect} size="sm" className="mr-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-600/80 text-white">
                      Connect
                    </Button>
                  )
                ) : null}
              </div> */}
              <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full flex flex-wrap justify-start mb-6 bg-transparent">
                  {["about", "experience", "education", "projects"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-2 sm:px-4 m-0.5 sm:m-1 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="about" className="mt-4 sm:mt-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">About</h3>
                      <p className="text-xs sm:text-sm">{userAlumni?.about}</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Contact Information</h3>
                      <div className="grid gap-2 text-xs sm:text-sm">
                        {[
                          { icon: Mail, text: userAlumni?.userId?.email },
                          { icon: MapPin, text: userAlumni?.contactInfo?.location },
                          { icon: Linkedin, text: "LinkedIn Profile", link: userAlumni?.contactInfo?.linkedin },
                          { icon: Github, text: "GitHub Profile", link: userAlumni?.contactInfo?.github },
                        ]?.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <item.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-muted-foreground" />
                            {item.link ? (
                              <Link href={item.link} className="text-blue-600 hover:underline">
                                {item.text}
                              </Link>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {userAlumni?.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="experience" className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Work Experience</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {userAlumni?.experience?.map((exp, index) => (
                      <Card key={index}>
                        <CardHeader className="p-3 sm:p-4">
                          <CardTitle className="text-sm sm:text-base">{exp?.role}</CardTitle>
                          {/* <CardDescription className="text-xs sm:text-sm">at {exp?.companyName} • {exp.startDate} ~ {exp.endDate}</CardDescription> */}
                          <CardDescription className="text-xs sm:text-sm">at {exp?.companyName} • </CardDescription>
                        </CardHeader>
                        <CardContent className="text-[16px]">{exp?.description}</CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="education" className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Education</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {userAlumni?.education?.map((edu, index) => (
                      <Card key={index}>
                        <CardHeader className="p-3 sm:p-4">
                          <CardTitle className="text-sm sm:text-base">{edu?.universityName} ({edu?.degree})</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">{edu?.universityName} • {edu?.startDate?.split('T')[0]} ~ {edu?.endDate?.split('T')[0]}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="projects" className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Projects</h3>
                  <div className="grid gap-3 sm:gap-4">
                  {userAlumni?.projects?.map((proj, index) => (
                    <Card key={index}>
                      <CardHeader className="p-3 sm:p-4">
                        <CardTitle className="text-sm sm:text-base">{proj?.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-4 pt-0">
                      <p className="text-xs sm:text-sm">{proj?.role}</p>
                        <p className="text-xs sm:text-sm">{proj?.description}</p>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}