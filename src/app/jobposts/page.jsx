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
import { useSelector } from "react-redux";

export default function SearchJob() {
  const { toast } = useToast();
  const router = useRouter();

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
    const getCurrentUser = () => {
      if (!isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        router.replace("/login");
        return;
      }

      try {
        // Get user data from token
        const { accessToken } = client.getTokens();
        if (accessToken) {
          const userData = parseJWT(accessToken);
          console.log("🚀 ~ getCurrentUser ~ userData:", userData)
          setCurrUser(userData);
        } else {
          console.log("No access token found");
          router.replace("/login");
        }
          console.log("🚀 ~ getCurrentUser ~ userData:", userData)
      } catch (error) {
        console.error("Error getting current user:", error);
        router.replace("/login");
      }
    };

    getCurrentUser();
  }, [router]);

  async function getPostData() {
    if (!currUser || !currUser.collegeName) {
      console.log("Cannot fetch posts: User or college name missing", currUser);
      return;
    }
    
    try {
      setLoading(true);
      console.log("Fetching posts for college:", currUser.collegeName);
      
      const res = await axios.post(getAllPostsUrl, {
        params: { 
          page, 
          limit: 15, 
          collegeName: currUser.collegeName 
        }
      });
      
      console.log("Posts fetched:", res.data.jobs.length);
      const newJobs = res.data.jobs.map(job => ({ ...job }));
      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error("Error fetching job posts:", error);
      toast({
        description: "Failed to load jobs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currUser && currUser.collegeName) {
      console.log("Triggering post data fetch for page:", page);
      getPostData();
    }
  }, [page, currUser]);

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

  const filteredJobs = jobs.filter((job) =>
    (job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (jobType === "all" || job?.category === jobType)
  );

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
              key={job._id || index}
              ref={index === filteredJobs.length - 1 ? lastJobRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {job.thumbnail && (
                      <div className="lg:w-1/3">
                        <img
                          src={job.thumbnail}
                          alt={`${job.company || 'Company'} banner`}
                          className="w-full h-48 lg:h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div className={job.thumbnail ? "lg:w-2/3 p-6" : "w-full p-6"}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 ">
                          {job.postedBy && (
                            <Link href={`/profile/${job.postedBy._id}`}>
                              <div className="flex flex-row gap-x-4">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={job.postedBy?.profileImage} alt={job.postedByName || 'User'} />
                                  <AvatarFallback>{(job?.postedByName && job.postedByName[0]) || 'U'}</AvatarFallback>
                                </Avatar>
                                <p className="text-blue-700 font-semibold mt-2">{job?.postedByName}</p>
                              </div>
                              <div className="text-blue-700">
                                <p className="text-sm text-gray-500">{job.company}</p>
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        {job.location}
                        <span className="mx-2">•</span>
                        {job.category ? job.category.toUpperCase() : 'N/A'}
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-1" />
                        <p className="text-sm text-gray-500">
                          Posted {formatDistanceToNow(new Date(job?.createdAt || new Date()), { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-gray-700 line-clamp-3">{job.description}</p>
                      <Link href={`/jobposts/${job._id}`} className="text-blue-700 text-sm underline font-semibold mb-4">
                        see more
                      </Link>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-500">
                                <MessageCircle className="w-5 h-5 mr-1" />
                                {job.comments?.length || 0}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <div className="max-h-[50vh] overflow-y-auto">
                                {job.comments && job.comments.length > 0 ? (
                                  job.comments.map((comment, i) => (
                                    <div key={comment._id || i} className="flex items-start space-x-2 mb-4">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={comment.avatar} alt={comment.authorname || 'User'} />
                                        <AvatarFallback>
                                          {comment?.authorname && comment.authorname[0] ? 
                                            String(comment.authorname[0]).toUpperCase() : 'U'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-semibold">{comment.authorname}</p>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-center text-gray-500 py-4">No comments yet</p>
                                )}
                              </div>
                              <div className="flex items-center mt-4">
                                <Input
                                  placeholder="Add a comment..."
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      handleComment(job._id, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                  className="flex-grow mr-2"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    const input = document.querySelector('input[placeholder="Add a comment..."]');
                                    if (input && input.value.trim()) {
                                      handleComment(job._id, input.value);
                                      input.value = '';
                                    } else {
                                      toast({
                                        description: "Comment cannot be empty",
                                        variant: "destructive"
                                      });
                                    }
                                  }}
                                >
                                  Post
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500" 
                            onClick={() => handleShare(window.location.origin + `/jobposts/${job._id}`)}
                          >
                            <Share2 className="w-5 h-5 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
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