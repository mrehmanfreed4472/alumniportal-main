'use client'


import Posts from '@/components/profile/posts';
import ProfileDisplay from '@/components/profile/profile';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux'

export default function ProfilePage() {
  const userData = useSelector((state) => state.userInfo.userData?.userId?.name)
  console.log("🚀 ~ ProfilePage ~ userData:", userData)
  const isLoading = useSelector((state) => state.userInfo.loading)
  const router = useRouter();

  if (!userData || isLoading) {
    //  router.replace("/login");
    // return (
    //   // <div className="w-full h-screen flex items-center justify-center">
    //   //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //   // </div>
      <p>login kro</p>
    // )
  }

  return (
    <div>
      <ProfileDisplay userData={userData} isCurrentUser={true} />
      {/* <Posts posts={userData.posts || []} /> */}
    </div>
  )
}