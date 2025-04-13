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

export default function UserConnectionPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("All")
  const [selectedBranch, setSelectedBranch] = useState("All")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [noAlumni, setNoAlumni] = useState(false)

  // Dummy data for alumni
  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'John Doe',
      profileImage: 'https://via.placeholder.com/150',
      jobTitle: 'Software Engineer',
      branch: 'Computer Science',
      batch: '2015',
      location: 'New York, USA',
      isVerified: true,
      isConnected: false,
      isCurrentUser: false
    },
    {
      _id: '2',
      name: 'Jane Smith',
      profileImage: 'https://via.placeholder.com/150',
      jobTitle: 'Data Scientist',
      branch: 'Information Technology',
      batch: '2016',
      location: 'San Francisco, USA',
      isVerified: false,
      isConnected: true,
      isCurrentUser: false
    },
    {
      _id: '3',
      name: 'Alice Johnson',
      profileImage: 'https://via.placeholder.com/150',
      jobTitle: 'Product Manager',
      branch: 'Electrical Engineering',
      batch: '2017',
      location: 'London, UK',
      isVerified: true,
      isConnected: false,
      isCurrentUser: false
    },
    {
      _id: '4',
      name: 'Bob Brown',
      profileImage: 'https://via.placeholder.com/150',
      jobTitle: 'DevOps Engineer',
      branch: 'Mechanical Engineering',
      batch: '2018',
      location: 'Berlin, Germany',
      isVerified: false,
      isConnected: false,
      isCurrentUser: false
    }
  ])

  // Simulate loading state
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000) // Simulate a 1-second loading delay
  }, [])

  const handleConnect = (id) => {
    setUsers(users.map(user =>
      user._id === id ? { ...user, isConnected: !user.isConnected } : user
    ))
    toast({
      description: `Connection ${users.find(user => user._id === id).isConnected ? 'removed' : 'added'} successfully!`,
      variant: "blue",
      duration: 1500
    })
  }

  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedBatch === "All" || user.batch === selectedBatch) &&
    (selectedBranch === "All" || user.branch === selectedBranch))
  )

  const groupedUsers = filteredUsers.reduce((acc, user) => {
    if (activeTab === "batch") {
      acc[user.batch] = [...(acc[user.batch] || []), user]
    } else if (activeTab === "branch") {
      acc[user.branch] = [...(acc[user.branch] || []), user]
    } else {
      acc["All"] = [...(acc["All"] || []), user]
    }
    return acc
  }, {})

  return (
    <div>
      <Navbar2 />
      {loading && <AlumniLoading />}
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
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
                    <SelectItem value="2015">2015</SelectItem>
                    <SelectItem value="2016">2016</SelectItem>
                    <SelectItem value="2017">2017</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="w-full sm:w-[180px] rounded-full shadow-md">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Branches</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
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
                      {groupUsers.map((user) => (
                        <motion.div
                          key={user._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                            <CardHeader className="p-0">
                              <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                            </CardHeader>
                            <CardContent className="pt-0 pb-6 px-6 flex-grow flex flex-col">
                              <div className="flex justify-center -mt-12 mb-4">
                                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                                  <AvatarImage src={user.profileImage} alt={user.name} />
                                  <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex flex-row items-center justify-center">
                                <h3>{user.name}</h3>
                                {user.isVerified ? (
                                  <ShieldCheck className="w-4 h-4 ml-2 font-bold" />
                                ) : (
                                  <ShieldOff className="w-4 h-4 ml-2 text-red-500" />
                                )}
                                {user.isCurrentUser && <p className="text-sm text-muted-foreground">(You)</p>}
                              </div>
                              <p className="text-sm text-muted-foreground text-center mb-4">{user.jobTitle || "Position not specified"}</p>
                              <div className="space-y-2 text-sm flex-grow">
                                <div className="flex items-center justify-center">
                                  <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{user.branch}, {user.batch}</span>
                                </div>
                                <div className="flex items-center justify-center">
                                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{user.location || "Location not specified"}</span>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-center space-x-4">
                                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(`/profile/${user._id}`)}>
                                  <User className="w-4 h-4 mr-2" />
                                  View Profile
                                </Button>
                                <Button
                                  disabled={user.isConnected || user.isCurrentUser}
                                  variant={user.isConnected ? "secondary" : "default"}
                                  size="sm"
                                  onClick={() => handleConnect(user._id)}
                                  className={`w-full ${user.isConnected ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                                >
                                  {user.isConnected ? (
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
                      ))}
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