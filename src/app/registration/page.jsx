'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useDispatch } from 'react-redux'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import NavForSlash from '@/components/header/NavForSlash'
import { handleSignupApi } from '@/features/auth/authSlice'

export default function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch()

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    collegeName: ''
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)

    const { name, email, password, role, collegeName } = inputs

    if (!name || !email || !password || !role || !collegeName || !profilePhoto) {
      toast({
        variant: 'red',
        title: 'All fields including profile photo are required!',
      })
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('role', role)
    formData.append('collegeName', collegeName)
    formData.append('profilePhoto', profilePhoto)

    try {
      const res = await dispatch(handleSignupApi(formData)).unwrap()

      if (res?.status === 201 || res?.status === 200) {
        toast({
          variant: 'green',
          title: 'Signup successful! Redirecting to login...',
        })
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        toast({
          variant: 'red',
          title: res?.data?.message || 'Signup failed. Try again!',
        })
      }
    } catch (err) {
      console.error("Signup error:", err)
      toast({
        variant: 'red',
        title: err?.message || 'Something went wrong!',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavForSlash />

      <div className="flex justify-center min-h-screen max-h-[90%] bg-white">
        <div className="w-full max-w-md max-h-fit mt-14 p-8 space-y-8 bg-white rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign up to AMS</h2>
            <p className="mt-2 text-sm text-blue-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium underline text-blue-600 hover:text-blue-500">
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
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  type="text"
                  placeholder="Enter your college name"
                  value={inputs.collegeName}
                  onChange={(e) => setInputs({ ...inputs, collegeName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePhoto(e.target.files[0])
                    }
                  }}
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
