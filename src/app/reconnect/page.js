"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, UserCheck, GraduationCap, MapPin, User, ShieldCheck, ShieldOff } from "lucide-react"
import Link from "next/link"
import Navbar2 from "@/components/header/Navbar2"
import AlumniLoading from '@/components/AlumniLoading'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/services/checkAuth"
import { useSelector, useDispatch } from "react-redux"
import { PostConnection } from "@/features/alumni/connectSlice"
import { getAlumniList } from "@/features/alumni/alumniSlice"

export default function UserConnectionPage() {
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("All")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [processingConnection, setProcessingConnection] = useState(null)
  
  // Get alumni list from Redux store
  const alumniList = useSelector((state) => state?.alumniList?.alumniList?.alumni || [])
  console.log("🚀 ~ UserConnectionPage ~ alumniList:", alumniList)
  const connectionStatus = useSelector((state) => state?.connect?.status)
  const connectionError = useSelector((state) => state?.connect?.error)

  const [localAlumniList, setLocalAlumniList] = useState([])

  // Update local alumni list when Redux state changes
  useEffect(() => {
    if (alumniList && alumniList.length > 0) {
      setLocalAlumniList(alumniList)
    }
  }, [alumniList])

  useEffect(() => {
    dispatch(getAlumniList());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login")
      router.replace("/login")
      return
    }
  }, [router])

  // Simulate loading state
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000) // Simulate a 1-second loading delay
  }, [])

  // Handle connection updates from API
  useEffect(() => {
    if (processingConnection !== null) {
      if (connectionStatus === 'succeeded') {
        // Update local state to reflect the connection change
        setLocalAlumniList(prevList => 
          prevList.map(user => 
            (user._id === processingConnection || (user.id && user.id._id === processingConnection))
              ? { ...user, isConnected: true } 
              : user
          )
        )
        
        toast({
          description: `Connection added successfully!`,
          variant: "blue",
          duration: 1500
        })
        
        setProcessingConnection(null)
      } else if (connectionStatus === 'failed') {
        toast({
          description: `Connection failed: ${connectionError || 'Unknown error'}`,
          variant: "destructive",
          duration: 3000
        })
        setProcessingConnection(null)
      }
    }
  }, [connectionStatus, connectionError, processingConnection, toast])

  const handleConnect = (userData) => {
    // Get the alumni ID based on data structure
    const alumniId = userData.id?._id || userData._id
    
    if (!alumniId) {
      toast({
        description: "Cannot connect: Alumni ID not found",
        variant: "destructive",
        duration: 3000
      })
      return
    }
    
    setProcessingConnection(alumniId)
    
    // Dispatch the connection action
    dispatch(PostConnection({ alumniId }))
  }

  // Handle View Profile navigation
  const handleViewProfile = (userData) => {
    const profileId = userData.id?._id || userData._id
    
    if (!profileId) {
      toast({
        description: "Cannot view profile: Alumni ID not found",
        variant: "destructive",
        duration: 3000
      })
      return
    }
    
    router.push(`/alumni-profile/${profileId}`)
  }

  // Filter users based on search query and dropdown selections
  const filteredUsers = localAlumniList.filter(user => {
    const userName = user.name || (user.id && user.id.name) || ""
    const userBatch = user.batch || ""
    const userBranch = user.branch || ""
    
    return (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedBatch === "All" || userBatch === selectedBatch) &&
      (selectedBranch === "All" || userBranch === selectedBranch)
    )
  })

  // Group users based on active tab
  const groupedUsers = filteredUsers.reduce((acc, user) => {
    const group = activeTab === "batch" ? (user.batch || "Unknown") : 
                  activeTab === "branch" ? (user.branch || "Unknown") : 
                  "All"
    
    if (!acc[group]) {
      acc[group] = []
    }
    
    acc[group].push(user)
    return acc
  }, {})

  // Generate unique batch and branch options from data
  const batchOptions = [...new Set(localAlumniList.map(user => user.batch).filter(Boolean))]
  const branchOptions = [...new Set(localAlumniList.map(user => user.branch).filter(Boolean))]

  return (
    <div>
      <Navbar2 />
      {loading && <AlumniLoading />}
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r text-[#A51C30] to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Alumni Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alumni..."
                    className="pl-10 py-6 text-lg rounded-full shadow-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full shadow-md">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Batches</SelectItem>
                    {batchOptions.map(batch => (
                      <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full shadow-md">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Branches</SelectItem>
                    {branchOptions.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="batch">By Batch</TabsTrigger>
                  <TabsTrigger value="branch">By Branch</TabsTrigger>
                </TabsList>
              </Tabs>

              <AnimatePresence>
                {Object.entries(groupedUsers).map(([group, groupUsers]) => (
                  <motion.div
                    key={group}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {activeTab !== "all" && (
                      <h2 className="text-2xl font-semibold mb-4">{group}</h2>
                    )}
                    <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                      {groupUsers.map((user) => {
                        const userId = user.id?._id || user._id
                        const userName = user.name || (user.id && user.id.name) || "Unknown"
                        const userInitials = userName.split(" ").map(n => n[0]).join("")
                        const userBatch = user.batch || "N/A"
                        const userBranch = user.branch || "N/A"
                        const userJobTitle = user.jobTitle || "Position not specified"
                        const userLocation = user.location || user.companyName || "Location not specified"
                        const isProcessing = processingConnection === userId
                        
                        return (
                          <motion.div
                            key={userId || Math.random().toString()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                              <CardHeader className="p-0">
                                <div className="h-24 bg-gradient-to-r from-[#A51C30] to-[#D43F56]"></div>
                              </CardHeader>
                              <CardContent className="pt-0 pb-6 px-6 flex-grow flex flex-col">
                                <div className="flex justify-center -mt-12 mb-4">
                                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.profileImage} alt={userName} />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex flex-row items-center justify-center">
                                  <h3>{userName}</h3>
                                  {user.isVerified ? (
                                    <ShieldCheck className="w-4 h-4 ml-2 font-bold" />
                                  ) : (
                                    <ShieldOff className="w-4 h-4 ml-2 text-red-500" />
                                  )}
                                  {user.isCurrentUser && <p className="text-sm text-muted-foreground">(You)</p>}
                                </div>
                                <p className="text-sm text-muted-foreground text-center mb-4">{userJobTitle}</p>
                                <div className="space-y-2 text-sm flex-grow">
                                  <div className="flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>{userBranch}, {userBatch}</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span>{userLocation}</span>
                                  </div>
                                </div>
                                <div className="mt-6 flex justify-center space-x-4">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full" 
                                    onClick={() => handleViewProfile(user)}
                                  >
                                    <User className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Button>
                                  <Button
                                    disabled={user.isConnected || user.isCurrentUser || isProcessing}
                                    variant={user.isConnected ? "secondary" : "default"}
                                    size="sm"
                                    onClick={() => handleConnect(user)}
                                    className={`w-full ${user.isConnected ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                                  >
                                    {isProcessing ? (
                                      "Processing..."
                                    ) : user.isConnected ? (
                                      <>
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Connected
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Connect
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && <p className="text-center text-muted-foreground">Just a moment, preparing alumni information...</p>}
              {!loading && filteredUsers.length === 0 && (
                <p className="text-center text-muted-foreground">No alumni found matching your criteria.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}