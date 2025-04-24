'use client';

import axios from "axios";
import Link from "next/link";
import { getAllPostsUrl, addCommentOnPostUrl } from "@/urls/urls";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Search, Calendar, MessageCircle, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JobSearchLoading from '@/components/JobSearchLoading';
import Navbar2 from "@/components/header/Navbar2";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from 'date-fns';
import { isAuthenticated } from "@/services/checkAuth";
import { useRouter } from "next/navigation";
import client, { parseJWT } from "@/services/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs } from "@/features/jobPost/PostJobSlice";

export default function SearchJob() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currUser, setCurrUser] = useState(null);

  const observer = useRef();
  const userData = useSelector((state) => state?.userInfo?.userData);
  console.log("🚀 ~ SearchJob ~ userData:", userData)
  

  // Get current user on component mount
  useEffect(() => {

      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        router.replace("/login");
        return;
      }
 

  }, [router]);

    useEffect(() => {
    dispatch(getAllJobs());
  }, []);
    const jobsList = useSelector((state) => state?.job?.jobData)
    console.log("🚀 ~ SearchJob ~ jobsList:", jobsList)

  const lastJobRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Last job visible, incrementing page");
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const filteredJobs = jobsList
    .filter((job) => {
      const searchLower = searchTerm.toLowerCase();
      const jobCategory = job?.job?.category?.toLowerCase() || '';
      
      return (
        (job?.job?.title?.toLowerCase().includes(searchLower) ||
        job?.companyName?.toLowerCase().includes(searchLower) ||
        job?.location?.toLowerCase().includes(searchLower)) &&
        (jobType === "all" || jobCategory === jobType.toLowerCase())
   ) }).reverse();

  const handleShare = (url) => {
    console.log("Sharing URL:", url);
    navigator.clipboard.writeText(url).then(() => {
      toast({
        description: "URL copied to clipboard!",
        variant: "green",
        duration: 1700
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        description: "Failed to copy URL",
        variant: "destructive"
      });
    });
  };

  const handleComment = async (jobId, content) => {
    if (!content.trim()) {
      toast({
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    if (!currUser?._id) {
      console.log("Cannot comment: User not logged in");
      toast({
        description: "Please log in to comment.",
        variant: "destructive"
      });
      return;
    }
  
    try {
      console.log("Adding comment to post:", jobId);
      console.log("Comment by user:", currUser._id);
      
      const res = await axios.post(addCommentOnPostUrl, {
        postId: jobId,
        postedBy: currUser._id,
        content: content
      });
  
      console.log("Comment added successfully:", res.data);
      
      setJobs(prevJobs => prevJobs.map(job => {
        if (job._id === jobId) {
          return {
            ...job,
            comments: [
              ...job.comments,
              {
                _id: res.data.comment?._id || Date.now(),
                author: currUser._id,
                authorname: currUser.name,
                content,
                avatar: currUser.profileImage
              }
            ]
          };
        }
        return job;
      }));
      
      toast({
        description: "Comment added successfully!",
        variant: "green",
        duration: 1700
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  // Log user info whenever it changes
  useEffect(() => {
    if (currUser) {
      console.log("Current user state updated:", {
        id: currUser._id,
        name: currUser.name,
        email: currUser.email,
        college: currUser.collegeName,
        profileImage: currUser.profileImage?.substring(0, 30) + "...", // Truncate for cleaner logs
      });
    }
  }, [currUser]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar2 />
      <div className="container mx-auto md:p-4 max-w-6xl">
        <header className="sticky top-16 z-10 bg-white dark:bg-gray-800 shadow-sm mb-10">
          <div className="container mx-auto md:px-4 px-2 py-4 flex justify-between items-center">
            <h1 className="md:text-2xl text-base md:font-bold font-semibold text-primary mr-2">JobConnect</h1>
            <div className="flex items-center md:space-x-4 space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 w-full md:w-64 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Link href="/postjob">
                <Button size="default" className="bg-primary hover:bg-primary/90">
                  <Plus className="md:h-6 h-4 md:w-6 w-4 mr-2" /> Post    
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="max-w-2xl mx-auto space-y-4 mb-8">
          <RadioGroup
            defaultValue="all"
            name="jobType"
            className="flex justify-center space-x-4"
            onValueChange={setJobType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="job" id="job" />
              <Label htmlFor="job">Jobs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internship" id="internship" />
              <Label htmlFor="internship">Internships</Label>
            </div>
          </RadioGroup>
        </div>
        
        {loading && jobs.length === 0 && <JobSearchLoading />}
        
        <AnimatePresence>
          {filteredJobs.map((job, index) => (
            <motion.div
              key={index}
              ref={index === filteredJobs.length - 1 ? lastJobRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Fix job data references */}
                    {job?.thumbnail && (
                      <div className="lg:w-1/3">
                        <img
                          src={job?.thumbnail || './image/event1.jpeg'}
                          alt={`${job?.companyName || 'Company'} banner`}
                          className="w-full h-48 lg:h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div className={job?.thumbnail ? "lg:w-2/3 p-6" : "w-full p-6"}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 ">
                          {job?.postedByName && (
                            <Link href={`/profile/${job.userId}`}>
                              <div className="flex flex-row gap-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={job.thumbnail} alt={job.postedByName} />
                                  <AvatarFallback>{job.postedByName[0]}</AvatarFallback>
                                </Avatar>
                                <p className="text-blue-700 font-semibold mt-2">{job.postedByName}</p>
                              </div>
                              <div className="text-blue-700">
                                <p className="text-sm text-gray-500">{job.companyName}</p>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{job.job?.title}</h2>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        {job.location}
                        <span className="mx-2">•</span>
                        {job.job?.category ? job.job.category.toUpperCase() : 'N/A'}
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <p className="text-sm text-gray-500">
                          Posted {formatDistanceToNow(new Date(job.job?.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {/* ... (rest of the card content remains the same) */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        
        {loading && jobs.length > 0 && <JobSearchLoading />}
        {!hasMore && jobs.length > 0 && <p className="text-center text-gray-500 mt-4">No more jobs to show</p>}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No jobs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}