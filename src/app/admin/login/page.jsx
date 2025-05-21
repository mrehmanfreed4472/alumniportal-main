"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import NavForSlash from "@/components/header/NavForSlash";
import { useDispatch } from "react-redux";
import { handleLoginApi, setUser } from "@/features/auth/authSlice";
import { getAlumniInfo, getStudentInfo } from "@/features/auth/userInfoSlice";

function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    email: "admin@gmail.com",
    password: "admin",
  });

  const [isLoading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!inputs.email || !inputs.password) {
      toast({
        variant: "red",
        title: "All fields are required!",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await dispatch(handleLoginApi(inputs));

      // SAFELY destructure payload
      const loginData = res?.payload;
      console.log("🚀 ~ handleLogin ~ loginData:", loginData)
      const user = loginData?.data?.User;
      const userID = loginData?.data?.User?._id;
      const status = loginData?.status;

      console.log("🚀 ~ User Role:", user);
      console.log("🚀 ~ User ID:", userID);

      if (status === 200 && user) {
    // ✅ Save to localStorage instead of Redux
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", loginData?.data?.token || "");
    router.push("/admin/dashboard");
        
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast({
        variant: "destructive",
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <NavForSlash />
      <div className="flex justify-center min-h-screen bg-white">
        <div className="w-full max-w-md mt-32 p-8 space-y-6 bg-white rounded-xl">
          <h2 className="text-center text-2xl font-bold text-black">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-blue-600">
            Do not have an account?{" "}
            <Link
              href="../registration"
              className="font-semibold text-blue-600 underline hover:text-blue-500"
            >
              Create your account
            </Link>
          </p>

          <form onSubmit={handleLogin} className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
                    type="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setInputs({ ...inputs, email: e.target.value })
                    }
                    value={inputs.email}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  {/* <Link
                    href="/login/reset-password"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Forgot Password?
                  </Link> */}
                </div>
                <div className="mt-2">
                  <input
                    className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400"
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                    value={inputs.password}
                  />
                </div>
              </div>

              <div>
                <p className="text-red-500 text-center font-semibold my-1">
                  {error}
                </p>
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-600/80"
                >
                  {isLoading ? "Logging In..." : <>Login <ArrowRight className="ml-2" size={16} /></>}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
