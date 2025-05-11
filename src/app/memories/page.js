'use client'

import jwt from "jsonwebtoken"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Search, Heart, MessageCircle, Send, Image as ImageIcon } from "lucide-react"
import { motion, AnimatePresence, px } from "framer-motion"
import Navbar2 from "@/components/header/Navbar2"
import axios from "axios"
import { getAllMemoriesUrl, getMemoryByIdUrl, createMemoryUrl, addLikeOnMemoryUrl, addCommentOnMemoryUrl } from "@/urls/urls.js"
import useCloudinaryImageUploader from "@/services/cloudinary"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { formatDistanceToNow } from 'date-fns'
import { FileUploader } from "@/components/ui/fileuploader"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/services/checkAuth"
import { getAllMemories, postMemory } from "@/features/memoery/memorySlice"
import { Toast } from "@/components/ui/toast"
import { useDispatch, useSelector } from "react-redux"

export default function AlumniMemories() {

  const { toast } = useToast();
  const dispatch = useDispatch();

  const [memories, setMemories] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newMemory, setNewMemory] = useState("")
  const [newImage, setNewImage] = useState(null)
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null)
  const [currentUser, setCurrentUser] = useState({})
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter()


 
    useEffect(() => {
    dispatch(getAllMemories());
  }, []);

  const memoriesList = useSelector((state) => state?.memory?.memoryData)
  console.log("✅ ~ AlumniMemories ~ memoriesList:", memoriesList)

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }
  }, [router]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const postNewMemory = async () => {
    if (!newMemory && !selectedImage) {
      toast.error("Please add a memory or an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("description", newMemory);
    if (selectedImage) formData.append("image", selectedImage);
  
    setIsPosting(true);
    try {
      const result = await dispatch(postMemory(formData));
      if (result.error) {
        throw new Error(result.error.message || "Failed to post memory");
      }
      toast({
        variant: "green",
        title: "Memory Posted Successfully",
        duration: 1700
      });
      dispatch(getAllMemories());
      setNewMemory("");
      setPreviewUrl(null);
      setSelectedImage(null);
    } catch (error) {
      toast({
        variant: "red",
        title: error.message || "Something went wrong", // Access error message
        duration: 1700
      });
    } finally {
      setIsPosting(false);
    }
  };
  



const filteredMemories = memoriesList
  ?.filter((memory) => 
    String(memory?.content)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(memory?.author?.name)?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []
  const formatContent = (content) => {
    const words = (content || '').split(' ')
    return words.map((word, index) => {
      if (word.startsWith('@')) {
        return <span key={index} className="text-blue-500">{word} </span>
      } else if (word.startsWith('#')) {
        return <span key={index} className="text-indigo-500">{word} </span>
      }
      return <span key={index}>{word} </span>
    })
  }
  

  const handleLike = (memoryId) => {
    setMemories(memories.map(memory => {
      if (memory._id === memoryId) {
        const userLikedIndex = memory.likes.indexOf(currentUser._id)
        if (userLikedIndex > -1) {
          memory.likes.splice(userLikedIndex, 1)
        } else {
          memory.likes.push(currentUser._id)
        }
        // api req for adding a like on a memory
        try {
          axios.post(addLikeOnMemoryUrl, {
            memoryId: memoryId, userId: currentUser._id
          }).then()
        } catch (error) {
          console.log(error)
        }
      }
      return memory
    }))
  }

  const handleComment = (memoryId, comment) => {
    setMemories(memories.map(memory => {
      if (memory._id === memoryId) {
        memory.comments.push({
          _id: memory.comments.length + 1,
          author: currentUser._id,
          authorname: currentUser.name,
          content: comment,
          avatar: currentUser.profileImage
        })
        // api req to push the comment
        try {
          axios.post(addCommentOnMemoryUrl, {
            memoryId: memoryId, postedBy: currentUser._id, content: comment
          }).then((res) => { 
            console.log(res.data.message)
            toast({
              description: "Your comment added successfully.",
              variant: "green",
              duration: 1700
            }) 
          })
            .catch((err) => { console.log(err) })
        } catch (error) {
          console.log(error)
        }

      }
      return memory
    }))
  }

  return (
    <div>
      <Navbar2 />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-[#A51C30]">Alumni Memories</h1>

          <Card className="mb-8">
  <CardContent className="p-4">
    <Textarea
      placeholder="Share your memory..."
      value={newMemory}
      onChange={(e) => setNewMemory(e.target.value)}
      className="mb-4"
    />
    <div className="flex justify-between items-center gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <Button
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current.click()}
      >
        <ImageIcon className="h-4 w-4 text-blue-700" />
      </Button>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-16 h-16 rounded object-cover"
        />
      )}

      <Button
        className="bg-[#A51C30] hover:bg-[#D43F56]"
        onClick={postNewMemory}
        disabled={isPosting}
      >
        {isPosting ? "Posting..." : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Share Memory
          </>
        )}
      </Button>
    </div>
  </CardContent>
</Card>

<div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search memories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      />
    </div>

    <AnimatePresence>
      {filteredMemories
        ?.slice()
        ?.reverse()
        ?.map((memory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardContent className="p-4">
                <Link href={`/profile/${memory?.author?.userId}`}>
                  <div className="flex items-center mb-4">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={memory?.pic} alt={memory?.name} />
                      <AvatarFallback>
                        {memory?.name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{memory?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">
                        Posted {memory?.createdAt}
                      </p>
                    </div>
                  </div>
                </Link>

                {memory?.pic && (
                  <img
                    src={memory?.pic || ''}
                    alt="Memory"
                    className="w-full h-64 object-contain rounded-lg mb-4"
                  />
                )}

                <div className="text-gray-700 mb-4">
                  {formatContent(memory?.memory)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-gray-500 ${memory?.likes?.includes(currentUser?._id) ? 'text-red-500' : ''}`}
                      onClick={() => handleLike(memory?._id)}
                    >
                      <Heart className={`w-5 h-5 mr-1 ${memory?.likes?.includes(currentUser?._id) ? 'fill-current' : ''}`} />
                      {memory?.likes?.length || 0}
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MessageCircle className="w-5 h-5 mr-1" />
                          {memory?.comments?.length || 0  }
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <div className="max-h-[50vh] overflow-y-auto">
                          {memory?.comments?.map((comment) => (
                            <div key={comment?.id} className="flex items-start space-x-2 mb-4">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={comment?.avatar} alt={comment?.author} />
                                <AvatarFallback>
                                  {String(comment?.authorname?.[0]).toUpperCase() || 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{comment?.authorname || 'Anonymous'}</p>
                                <p className="text-sm text-gray-700">{comment?.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center mt-4">
                          <Input
                            placeholder="Add a comment..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(memory?._id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                            className="flex-grow mr-2"
                          />
                          <Button size="sm" onClick={() => {
                            const input = document.querySelector('input[placeholder="Add a comment..."]')
                            handleComment(memory?._id, input?.value)
                            if (input) input.value = ''
                          }}>
                            Post
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
    </AnimatePresence>
        </div>
      </div>
    </div>
  )
}