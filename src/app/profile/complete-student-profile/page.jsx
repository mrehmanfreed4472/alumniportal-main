"use client"

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Icons
import { 
  User, Mail, MapPin, Phone, Linkedin, Github, Pencil, X, Plus, ArrowRight 
} from 'lucide-react';

import Link from 'next/link';
import Navbar2 from '@/components/header/Navbar2';
import { registerStudent } from '@/features/student/studentSlice';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateProfilePage () {
  const dispatch = useDispatch();
    const { toast } = useToast()
  const { loading: isLoading } = useSelector((state) => state?.userInfo?.userData);
  // const userData = useSelector((state) => state?.userInfo?.userData)
  const userData = '';
  // Image upload state
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  // Form data state
  const [formData, setFormData] = useState({
    name:'',
    email:  '',
    contactNumber:  '',
    location:  '',
    collegeName:  '',
    branch: '',
    batch: '',
    about: '',
    linkedin:  '',
    github: '',
    skills:  [],
    education:  [],
    projects:  []
  });

    const [newPro, setNewPro] = useState({
      title: '',
      description: '',
      role: ''
    });
  // New education entry state
  const [newEdu, setNewEdu] = useState({
    collegeName: '',
    course: '',
    branch: '',
    startDate: '',
    endDate: ''
  });

  // New experience entry state
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  // Mock data for dropdowns
  const collegeName = ['MIT', 'Stanford', 'Harvard', 'Caltech', 'Other'];
  const branch = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Other'];
  const batch = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleProChange = (e) => {
    const { name, value } = e.target;
    setNewPro({
      ...newPro,
      [name]: value
    });
  };
  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle skills input (comma-separated string to array)
  const handleSkillsChange = (e) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setFormData({
      ...formData,
      skills: skillsArray
    });
  };

  // Handle education form changes
  const handleEduChange = (e) => {
    const { name, value } = e.target;
    setNewEdu({
      ...newEdu,
      [name]: value
    });
  };
  
  // Add education entry
  const addEdu = () => {
    if (!newEdu.collegeName || !newEdu.course) {
        toast('College name and degree are required');
      return;
    }
    
    setFormData({
      ...formData,
      education: [...formData.education, newEdu]
    });
    
    // Reset form
    setNewEdu({
      collegeName: '',
      course: '',
      branch: '',
      startDate: '',
      endDate: ''
    });
  };
  
  // Remove education entry
  const removeEdu = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Handle experience form changes
  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setNewExperience({
      ...newExperience,
      [name]: value
    });
  };
  
  // Add experience entry
  const addExperience = () => {
    if (!newExperience.company || !newExperience.position) {
        toast('Company and position are required');
      return;
    }
    
    setFormData({
      ...formData,
      experiences: [...formData.experiences, newExperience]
    });
    
    // Reset form
    setNewExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  };
  
 // Add proper project handling functions
 const addProject = () => {
    if (!newPro.title || !newPro.description) {
      toast({ variant: "red", title: "Title and description are required" });
      return;
    }
    
    setFormData({
      ...formData,
      projects: [...formData.projects, newPro]
    });
    
    setNewPro({
      title: '',
      description: '',
      role: ''
    });
  };
  
  // Add remove project function
  const removeProject = (index) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    setFormData({ ...formData, projects: updatedProjects });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Update profile image
  const updateProfileImage = async () => {
    // Profile image update logic would go here
    setIsOpen(false);
    toast('Profile image updated!');
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format data according to backend requirements
      const formattedData = {
        about: formData.about || "",
        contactInfo: {
          linkedin: formData.linkedin || "",
          github: formData.github || "",
          email: formData.email || "",
          location: formData.location || ""
        },
        skills: formData.skills || [],
        batch: formData.batch || "",
        education: formData.education?.map(edu => ({
            universityName: edu.collegeName,
            degree: edu.course,
            major: edu.branch,
            startDate: edu.startDate,
            endDate: edu.endDate || null,
            isPresent: !edu.endDate
          })) || [],
        projects: formData.projects?.map(pro => ({
            title: pro.title,
            description: pro.description,
            role: pro.role
          })) || []
      };

      // Dispatch the registerAlumni action
      const result = await dispatch(registerStudent(formattedData)).unwrap();
      
      if (result) {
        toast("Profile registered successfully!");
        router.replace("/home");
      }
    } catch (error) {
      console.error("Error registering profile:", error);
      toast(error.message || "Failed to register profile");
    }
  };

  return (
    <div>
      <Navbar2 />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-10 md:py-16 sm:px-6 lg:px-8 mb-10 rounded-t-lg">
            <h1 className="text-2xl sm:text-3xl font-bold pb-5 text-white">Edit Profile</h1>
            <div className="mb-6 flex justify-center">
              <Avatar className="w-32 h-32 border-4 border-white">
                <AvatarImage src={userData?.profileImage} alt={userData?.userId?.name || 'User'} />
                <AvatarFallback>{userData?.userId?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" className="bg-transparent mt-[60px] text-white shadow-none hover:bg-transparent">
                    <Pencil className="w-5 hover:text-gray-800 transition-all duration-200" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center">Edit Profile Image</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="profileImage" className="text-right">
                        Profile Image
                      </Label>
                      <Input id="profileImage" onChange={handleImageChange} type="file" accept="image/*" className="col-span-3" />
                    </div>
                    {previewUrl && (
                      <div className="flex justify-center">
                        <img src={previewUrl} alt="Preview" className="max-h-40 rounded" />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button disabled={ !previewUrl} onClick={updateProfileImage} type="button">
                      {isLoading ? "Uploading..." : "Save changes"}
                    </Button>
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
              <TabsList className="w-full flex flex-row mb-6 justify-evenly">
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="basic">Basic</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="professional">Professional</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="education">Education</TabsTrigger>
                <TabsTrigger className="flex-grow sm:flex-grow-0 text-xs sm:text-sm py-2 px-[2px] md:px-10 m-0.5 sm:m-1 rounded-sm data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground my-1" value="projects">projects</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Tab */}
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
                          value={formData.name}
                          onChange={handleChange}
                          disabled
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
                          value={formData.email}
                          onChange={handleChange}
                          disabled
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
                            value={formData.location}
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
                            value={formData.contactNumber}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700">College Name</label>
                      <Select
                        name="collegeName"
                        value={formData.collegeName}
                        onValueChange={(value) => handleSelectChange('collegeName', value)}
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
                        <Select 
                          name="branch" 
                          value={formData.branch} 
                          onValueChange={(value) => handleSelectChange('branch', value)}
                        >
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
                        <Select 
                          name="batch" 
                          value={formData.batch} 
                          onValueChange={(value) => handleSelectChange('batch', value)}
                        >
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

                {/* Professional Tab */}
                <TabsContent value="professional">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <div className="mt-1">
                        <Textarea
                          name="about"
                          id="about"
                          rows={3}
                          className="resize-none"
                          placeholder="Tell us a little bit about yourself"
                          value={formData.about}
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
                          value={formData.linkedin}
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
                          value={formData.github}
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
                        value={formData.skills.join(', ')}
                        onChange={handleSkillsChange}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Enter your skills separated by commas (e.g., Machine Learning, Cloud Computing, Data Science)
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education">
                  <div className="space-y-4">
                    {formData.education?.map((edu, index) => (
                      <Card key={index} className="relative">
                        <CardHeader className="p-3 sm:p-4">
                          <CardTitle className="text-sm sm:text-base">{edu.course}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeEdu(index)}
                            type="button"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <CardDescription className="text-xs sm:text-sm">
                            {edu.collegeName} • {edu.startDate || 'N/A'} ~ {edu.endDate || "Present"}
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edu-collegeName">College Name</Label>
                              <Input 
                                id="edu-collegeName" 
                                name="collegeName" 
                                value={newEdu.collegeName} 
                                onChange={handleEduChange} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edu-course">Degree</Label>
                              <Input 
                                id="edu-course" 
                                name="course" 
                                value={newEdu.course} 
                                onChange={handleEduChange} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edu-branch">Branch</Label>
                              <Input 
                                id="edu-branch" 
                                name="branch" 
                                value={newEdu.branch} 
                                onChange={handleEduChange} 
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="edu-startDate">Start Date</Label>
                              <Input 
                                id="edu-startDate" 
                                name="startDate" 
                                type="date" 
                                value={newEdu.startDate} 
                                onChange={handleEduChange} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edu-endDate">End Date</Label>
                              <Input 
                                id="edu-endDate" 
                                name="endDate" 
                                type="date" 
                                value={newEdu.endDate} 
                                onChange={handleEduChange} 
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="button" 
                          onClick={addEdu} 
                          className="w-full md:w-1/3 mx-auto"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Education
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="projects">
  <div className="space-y-4">
    {/* Display existing projects */}
    {formData.projects?.map((pro, index) => (
      <Card key={index} className="relative">
        <CardHeader>
          <CardTitle>{pro.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeProject(index)}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-2">Description:</p>
          <p className="text-sm text-muted-foreground">{pro.description}</p>
          {pro.role && (
            <>
              <p className="font-medium mt-4 mb-2">Your Role:</p>
              <p className="text-sm text-muted-foreground">{pro.role}</p>
            </>
          )}
        </CardContent>
      </Card>
    ))}

    {/* Add new project form */}
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                name="title"
                placeholder="Project title"
                value={newPro.title}
                onChange={handleProChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-role">Your Role</Label>
              <Input
                id="project-role"
                name="role"
                placeholder="Your role in the project"
                value={newPro.role}
                onChange={handleProChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              name="description"
              placeholder="Project description"
              value={newPro.description}
              onChange={handleProChange}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="button" 
          onClick={addProject} 
          className="w-full md:w-1/3 mx-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </CardFooter>
    </Card>
  </div>
</TabsContent>

              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600">
                {isLoading ? (
                  <>Updating... <ArrowRight className="ml-2 h-4 w-4 animate-spin" /></>
                ) : (
                  <>Register Profile <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  </div>
  );
};
