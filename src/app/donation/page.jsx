"use client"

import React, { useEffect, useState } from 'react'
import DonationCard from '@/components/donation/DonationMatter'
import NewFacelites from '@/components/donation/NewFacelites'
import Research from '@/components/donation/Research'
import ScholarShip from '@/components/donation/ScholarShip'
import Support from '@/components/donation/Support'
import Navbar2 from '@/components/header/Navbar2'
import { isAuthenticated } from '@/services/checkAuth'
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/login");
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null // or a loading spinner

  return (
    <div>
      <Navbar2 />
      <Support />
      <DonationCard />
      <ScholarShip />
      <Research />
      <NewFacelites />
    </div>
  )
}

export default Page
