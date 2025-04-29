"use client"

import jwt from "jsonwebtoken"

import { useState, useEffect } from "react"
import { Plus, Pencil, ArrowRight, User, Mail, Briefcase, Building, MapPin, Phone, Linkedin, Github, X } from "lucide-react"
import axios from 'axios'
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// importing urls
import { getUserInfoUrl, updateUserProfileUrl, deleteAssetUrl } from "@/urls/urls.js"
import useCloudinaryImageUploader from "@/services/cloudinary"
import { useToast } from "@/hooks/use-toast"

// Import your data arrays here
import { collegeName } from '@/data/college'
import { stateName } from '@/data/state'
import { batch } from '@/data/batch'
import { branch } from '@/data/branch'
import Navbar2 from "@/components/header/Navbar2"
import { useSelector, useDispatch } from "react-redux"
import { UpdateAlumniProfile } from "@/features/alumni/alumniSlice"

export default function ProfileForm() {
  const dispatch = useDispatch() // Initialize dispatch

  const {
    previewUrl,
    uploading,
    error,
    handleImageChange,
    uploadImage
  } = useCloudinaryImageUploader();

  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    profileImage: "",
    collegeName: "",
    branch: "",
    state: "",
    batch: "",
    location: "",
    contactNumber: "",
    companyName: "",
    jobTitle: "",
    userId: "",
    linkedin: "",
    github: "",
    bio: "",
    skills: [],
    experiences: [],
    education: []
  })
  const [hasMounted, setHasMounted] = useState(false);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
  const [newEdu, setNewEdu] = useState({
    collegeName: '',
    course: '',
    branch: '',
    startDate: '',
    endDate: '',
  })
  const userData = useSelector((state) => state?.userInfo?.userData);
  console.log("🚀 ~ AlumniHome ~ userData:", userData)
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    fetchUser()
  }, [])

  function fetchUser() {
    // If userData is available from Redux, use it to populate form
    if (userData) {
      setUser(userData)
      
      // Format experiences from API format to form format
      const formattedExperiences = userData.experience ? userData.experience.map(exp => ({
        company: exp.companyName || "",
        position: exp.role || "",
        startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : "",
        endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : "",
        description: exp.description || ""
      })) : []
      
      // Format education from API format to form format
      const formattedEducation = userData.education ? userData.education.map(edu => ({
        collegeName: edu.universityName || "",
        course: edu.degree || "",
        branch: userData.branch || "",
        startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : "",
        endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""
      })) : []
      
      setInputs({
        name: userData?.userId?.name || "",
        email: userData?.userId?.email || "",
        profileImage: userData?.profileImage || "",
        collegeName: userData?.collegeName || "",
        branch: userData?.branch || "",
        state: userData?.state || "",
        batch: userData?.batch || "",
        location: userData?.contactInfo?.location || "",
        contactNumber: userData?.contactNumber || "",
        companyName: userData?.experience?.[0]?.companyName || "",
        jobTitle: userData?.experience?.[0]?.role || "",
        userId: userData?._id || "",
        linkedin: userData?.contactInfo?.linkedin || "",
        github: userData?.contactInfo?.github || "",
        bio: userData?.about || "",
        skills: userData?.skills || [],
        experiences: formattedExperiences,
        education: formattedEducation,
      })
    }
  }

  const handleChange = (e) => {
    if (!hasMounted) return; // preventing function to trigger at the time of mounting as select field will initialize to empty string
    const { name, value } = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
  }

  const handleExperienceChange = (e) => {
    const { name, value } = e.target
    setNewExperience(prev => ({ ...prev, [name]: value }))
  }

  const handleEduChange = (e) => {
    const { name, value } = e.target
    setNewEdu(prev => ({ ...prev, [name]: value }))
  }

  const addExperience = () => {
    setInputs((prev) => ({ ...prev, experiences: [...prev.experiences, newExperience] }))
    setNewExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const addEdu = () => {
    setInputs((prev) => ({ ...prev, education: [...prev.education, newEdu] }))
    setNewEdu({
      collegeName: '',
      course: '',
      branch: '',
      startDate: '',
      endDate: '',
    })
  }

  const removeExperience = (index) => {
    const updatedExperiences = [...inputs.experiences]
    updatedExperiences.splice(index, 1)
    setInputs((prev) => ({ ...prev, experiences: updatedExperiences }))
  }

  const removeEdu = (index) => {
    const updatedEdu = [...inputs.education]
    updatedEdu.splice(index, 1)
    setInputs((prev) => ({ ...prev, education: updatedEdu }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Format data for API according to the expected structure
      const profileData = {
        userId: inputs.userId,
        contactInfo: {
          linkedin: inputs.linkedin,
          github: inputs.github,
          email: inputs.email,
          location: inputs.location
        },
        about: inputs.bio,
        skills: inputs.skills,
        batch: inputs.batch,
        experience: inputs.experiences.map(exp => ({
          companyName: exp.company,
          isPresent: !exp.endDate,
          description: exp.description,
          role: exp.position
        })),
        education: inputs.education.map(edu => ({
          universityName: edu.collegeName,
          degree: edu.course,
          startDate: edu.startDate,
          endDate: edu.endDate,
          isPresent: !edu.endDate
        }))
      }

      // Dispatch the Redux action
      const result = await dispatch(UpdateAlumniProfile(profileData)).unwrap()
      console.log("Profile update result:", result)

      // Also keep the existing axios call if you need both methods during transition
      const response = await axios.post(updateUserProfileUrl, inputs)
      console.log(response.data)
      
      await getUser()
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "green",
        duration: 2000
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
        duration: 2000
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function updateProfileImage(e) {
    // console.log("updating..")
    setIsLoading(true)
    const prevImagePubId = inputs.profileImage.replace("https://res.cloudinary.com/dcqgytpzz/image/upload/", "")?.split("/")[1]?.split(".")[0];
    // console.log(prevImagePubId)
    let imageInfo = {}
    try {
      await uploadImage()
        .then((res) => {
          console.log(res)
          imageInfo = res
        })
        .catch((err) => {
          console.log(err)
          return
        })
    } catch (error) {
      console.log(error)
      return
    }
    try {
      // Update via Redux action
      const profileImageData = {
        userId: inputs.userId,
        profileImage: imageInfo.secure_url
      }
      await dispatch(UpdateAlumniProfile(profileImageData)).unwrap()

      // Also keep existing axios call
      await axios.post(updateUserProfileUrl, { userId: inputs.userId, profileImage: imageInfo.secure_url })
        .then((res) => {
          // console.log(res.data)
          setInputs({ ...inputs, profileImage: imageInfo.secure_url })
          toast({
            title: "Success",
            description: "Profile Image updated successfully",
            variant: "green",
            duration: 2000
          })
          setIsLoading(false)
          setIsOpen(false)
        })
        .catch((err) => {
          console.log(err)
          setIsLoading(false)
          return
        })
      // updating user info saved locally
      await getUser()
      await axios.post(deleteAssetUrl, { publicId: prevImagePubId })
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      return
    }
  }

  async function getUser() {
    try {
      const response = await axios.post(getUserInfoUrl, { userId: inputs.userId })
      if (typeof window !== 'undefined') {
        const user = (response.data.user)
        const token = jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '3d' })
        localStorage.setItem("amsjbckumr", token)
      }
      // console.log(response.data.user)
      fetchUser()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Navbar2 />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto ">
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-10 md:py-16 sm:px-6 lg:px-8 mb-10 rounded-t-lg">
            <h1 className="text-2xl sm:text-3xl font-bold pb-5 text-white" >Edit Profile</h1>
            <div className="mb-6 flex justify-center">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={userData?.profileImage} alt={userData?.userId?.name || 'User'} />
                <AvatarFallback>{userData?.userId?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" className="bg-transparent mt-[60px] text-white shadow-none hover:bg-transparent">
                    <Pencil className="w-5 hover:text-gray-800  transition-all duration-200" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center">Edit Profile Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Profile Image
                      </Label>
                      <Input id="name" onChange={handleImageChange} type="file" accept="image/*" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button disabled={isLoading} onClick={updateProfileImage} type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <p className="mt-2 text-center text-sm text-white mb-6">
              Update your profile information{' '}
              <Link
                href={`/profile/${userData?._id}`}
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Go to Profile
              </Link>
            </p>
          </div>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">

              <TabsList className=" w-full flex flex-row mb-6 justify-evenly">
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="basic">Basic</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="professional">Professional</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="education">Education</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="experience">Experience</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic  */}
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          className="pl-10"
                          placeholder="Your full name"
                          value={userData?.userId?.name || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          className="pl-10"
                          placeholder="Your email address"
                          value={userData?.userId?.email || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <Input
                            type="text"
                            name="location"
                            id="location"
                            className="pl-10"
                            placeholder="Your location"
                            value={userData?.contactInfo?.location || ""}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <Input
                            type="tel"
                            name="contactNumber"
                            id="contactNumber"
                            className="pl-10"
                            placeholder="Your phone number"
                            value={inputs.contactNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                      <Select
                        name="collegeName"
                        value={inputs.collegeName}
                        onValueChange={(value) => handleChange({ target: { name: 'collegeName', value } })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select College" />
                        </SelectTrigger>
                        <SelectContent>
                          {collegeName.map((college, index) => (
                            <SelectItem key={index} value={college}>
                              {college}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                        <Select name="branch" value={inputs.branch} onValueChange={(value) => handleChange({ target: { name: 'branch', value } })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branch.map((b, index) => (
                              <SelectItem key={index} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="batch" className="block text-sm font-medium text-gray-700">Batch</label>
                        <Select name="batch" value={userData?.batch || ""} onValueChange={(value) => handleChange({ target: { name: 'batch', value } })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Batch" />
                          </SelectTrigger>
                          <SelectContent>
                            {batch.map((batchItem, index) => (
                              <SelectItem key={index} value={batchItem}>
                                {batchItem}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Professional */}
                <TabsContent value="professional">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Current Position</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="text"
                          name="jobTitle"
                          id="jobTitle"
                          className="pl-10"
                          placeholder="Your current job title"
                          value={userData?.experience?.[0]?.role || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="text"
                          name="companyName"
                          id="companyName"
                          className="pl-10"
                          placeholder="Your company name"
                          value={userData?.experience?.[0]?.companyName || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <div className="mt-1">
                        <Textarea
                          name="bio"
                          id="bio"
                          rows={3}
                          className="resize-none"
                          placeholder="Tell us a little bit about yourself"
                          value={userData?.about || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description for your profile. URLs are hyperlinked.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Linkedin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="url"
                          name="linkedin"
                          id="linkedin"
                          className="pl-10"
                          placeholder="Your LinkedIn profile URL"
                          value={userData?.contactInfo?.linkedin || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Github className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <Input
                          type="url"
                          name="github"
                          id="github"
                          className="pl-10"
                          placeholder="Your GitHub profile URL"
                          value={userData?.contactInfo?.github || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
                      <Input
                        type="text"
                        name="skills"
                        id="skills"
                        placeholder="Add skills (comma-separated)"
                        value={(userData?.skills || []).join(',   ')}
                        onChange={(e) => setInputs(prev => ({ ...prev, skills: e.target.value.split(',').map(skill => skill.trim()) }))}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Enter your skills separated by commas (e.g., Machine Learning, Cloud Computing, Data Science)
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Education  */}
                <TabsContent value="education">
                  <div className="space-y-4">
                    {userData?.education?.map((edu, index) => (
                      <Card key={index} className="relative" >
                        <CardHeader className="p-3 sm:p-4">
                          <CardTitle className="text-sm sm:text-base">{edu?.degree}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeEdu(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <CardDescription className="text-xs sm:text-sm">
                            {edu.universityName} • {new Date(edu.startDate).toLocaleDateString()} ~ 
                            {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Education</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company">College Name</Label>
                              <Input id="collegeName" name="collegeName" value={newEdu.collegeName} onChange={handleEduChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="position">Degree</Label>
                              <Input id="course" name="course" value={newEdu.course} onChange={handleEduChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="position">Branch</Label>
                              <Input id="branch" name="branch" value={newEdu.branch} onChange={handleEduChange} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input id="startDate" name="startDate" type="date" value={newEdu.startDate} onChange={handleEduChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date</Label>
                              <Input id="endDate" name="endDate" type="date" value={newEdu.endDate} onChange={handleEduChange} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="button" onClick={addEdu} className="w-full md:w-1/3 mx-auto">
                          <Plus className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                {/* Experience  */}
                <TabsContent value="experience">
                  <div className="space-y-4">
                    {userData?.experience?.map((exp, index) => (
                      <Card key={index} className="relative">
                        <CardHeader>
                          <CardTitle>{exp.role} at {exp.companyName}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeExperience(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.isPresent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                          </p>
                          <p className="mt-2">{exp.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Experience</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input id="company" name="company" value={newExperience.company} onChange={handleExperienceChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="position">Position</Label>
                              <Input id="position" name="position" value={newExperience.position} onChange={handleExperienceChange} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date</Label>
                              <Input id="startDate" name="startDate" type="date" value={newExperience.startDate} onChange={handleExperienceChange} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date</Label>
                              <Input id="endDate" name="endDate" type="date" value={newExperience.endDate} onChange={handleExperienceChange} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={newExperience.description} onChange={handleExperienceChange} />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                      <Button type="button" onClick={addExperience} className="w-full md:w-1/3 mx-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600">
                {isLoading ? (
                  <>Updating... <ArrowRight className="ml-2 h-4 w-4 animate-spin " /></>
                ) : (
                  <>Update profile <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>

          </Tabs>
        </CardContent>
      </Card>
    </div>
    </div>
  )
}