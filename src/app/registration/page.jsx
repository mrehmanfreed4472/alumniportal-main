'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { collegeName } from '/src/data/college.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import NavForSlash from '@/components/header/NavForSlash'

export default function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    collegeName: "",
  })
  const [isLoading, setLoading] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState("")

  const handleSignup = async () => {
    setLoading(true)

    // Validate input fields
    if (!inputs.name || !inputs.email || !inputs.password || !inputs.role || !inputs.collegeName) {
      toast({
        variant: "red",
        title: "All fields are required!",
      })
      setLoading(false)
      return
    }

    // Simulate successful signup (since no backend yet)
    setTimeout(() => {
      toast({
        variant: "green",
        title: "Signup successful! Redirecting to login...",
      });

      router.push('/login'); // Redirect to login page
    }, 1000);
  }

  // Filter colleges based on search
  const filteredColleges = collegeName.filter(college =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  )

  return (
    <div> 
      <NavForSlash />

      <div className="flex justify-center min-h-screen max-h-[90%] bg-white">
        <div className="w-full max-w-md max-h-fit mt-14 p-8 space-y-8 bg-white rounded-xl">         
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign up to AMS</h2>
            <p className="mt-2 text-sm text-blue-600">
              Already have an account?{' '}
              <Link href="../login" className="font-medium underline text-blue-600 hover:text-blue-500">
                Login to your account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={inputs.name}
                  onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={inputs.email}
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setInputs({ ...inputs, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="college">College</Label>
                <Select onValueChange={(value) => setInputs({ ...inputs, collegeName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                  <SelectContent>
                    <Input
                      type="text"
                      placeholder="Search for your college"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      className="mb-2"
                    />
                    {filteredColleges.map((college, index) => (
                      <SelectItem key={index} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-600/80"
              onClick={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
              {!isLoading && <ArrowRight className="ml-2" size={16} />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
