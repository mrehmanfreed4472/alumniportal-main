'use client'
import React, { useState } from 'react';
import Navbar2 from '@/components/header/Navbar2';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs, PostJobApi } from "@/features/jobPost/PostJobSlice";

export default function ContactPageOne() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [input, setInput] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [msg, setmsg] = useState("");
  const [err, seterr] = useState("");
  const [isLoading, setLoading] = useState(false);

  const userData = useSelector((state) => state?.userInfo?.userData);
  console.log("🚀 ~ ContactPageOne ~ userData:", userData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.title || !input.description || !input.category || !input.url || !thumbnail) {
      toast({
        variant: "red",
        title: "Please fill all the fields",
        duration: 2000
      });
      return;
    }

    setLoading(true);
    setmsg("Posting..");
    seterr("");

    try {
      const formData = new FormData();
      formData.append("thumbnail", thumbnail);
      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("category", input.category);
      formData.append("url", input.url);

      await dispatch(PostJobApi(formData));

      setInput({
        title: "",
        description: "",
        category: "",
        url: "",
      });

      setThumbnail(null);
      setmsg("");
          dispatch(getAllJobs());
      toast({
        variant: "green",
        title: "Job Posted Successfully",
        duration: 1700
      });

      setLoading(false);
      router.replace("/jobposts");
    } catch (error) {
      setmsg("");
      toast({
        variant: "red",
        title: error.message || "Something went wrong",
        duration: 1700
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center justify-items-center mx-auto max-w-7xl py-auto pt-8 md:pt-8">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="px-2 md:px-12">
              <p className="text-lg w-full md:font-semibold text-blue-600 md:text-[26px] text-center">
                Post a Job/Internship
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4 md:w-[500px] w-[350px]">
                <div className="grid w-full items-center gap-1.5">
                  <p className='text-blue-700 text-center text-lg font-semibold'>{msg}</p>
                  <p className='text-xs font-light text-red-600 text-center'>All (*) fields are required</p>

                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="title" className="text-sm font-medium leading-none text-gray-700">
                      Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Title"
                      value={input.title}
                      onChange={(e) => setInput({ ...input, title: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="description" className="text-sm font-medium leading-none text-gray-700">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    value={input.description}
                    placeholder="Job Description, Skills, Qualification, Salary, etc..."
                    onChange={(e) => setInput({ ...input, description: e.target.value })}
                    className="flex h-20 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="thumbnail" className="text-sm font-medium leading-none text-gray-700">
                    Thumbnail*
                  </label>
                  <div className="flex">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                    {thumbnail && (
                      <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Preview"
                        style={{ width: "30px" }}
                      />
                    )}
                  </div>
                </div>

                <div className="grid w-full items-center gap-1.5 text-black">
                  <label htmlFor="category" className="text-sm font-medium leading-none text-gray-700">
                    Category*
                  </label>
                  <select
                    value={input.category}
                    onChange={(e) => setInput({ ...input, category: e.target.value })}
                    className="flex text-black h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="">Select Category</option>
                    <option value="internship">Internship</option>
                    <option value="job">Job</option>
                  </select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="url" className="text-sm font-medium leading-none text-gray-700">
                    URL*
                  </label>
                  <input
                    type="url"
                    id="url"
                    placeholder="url"
                    value={input.url}
                    onChange={(e) => setInput({ ...input, url: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <p className='text-red-600 text-center text-base font-semibold'>{err}</p>

                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full rounded-md bg-blue-700 hover:bg-blue-700/80 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  {isLoading ? "Posting..." : "Post"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
