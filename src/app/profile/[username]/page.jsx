'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import ProfileDisplay from '@/components/profile/profile';
import { getUser, isAuthenticated } from '@/services/checkAuth';
import { Alert } from '@/components/ui/alert';
import { Title } from '@radix-ui/react-dialog';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const userData = useSelector((state) => state.userInfo.userData?.userId);
  const isLoading = useSelector((state) => state.userInfo.loading);

  const profileIsIncomplete = (userData) => {
    return !user?.name || !user?.email; // Add more required fields if needed
  };
const user = getUser();
useEffect(() => {
  if (!isAuthenticated()) {
    router.replace('/login');
    return;
  }

  // Redirect if userData is missing or empty
  if (!userData || Object.keys(userData).length === 0) {
    router.replace('/login');
  }
}, [userData, user?.role, router]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {userData && <ProfileDisplay userData={userData} isCurrentUser={true} />}

      {/* <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-2 text-gray-800">
              {userData ? 'Complete Your Profile' : 'Profile Required'}
            </Dialog.Title>
            <Dialog.Description className="mb-4 text-gray-600">
              {userData 
                ? 'To access all features, please complete your profile.'
                : 'No profile data found. Please create your profile.'}
            </Dialog.Description>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <Link
                href="/profile/complete-profile"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {userData ? 'Complete Now' : 'Create Profile'}
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog> */}
    </div>
  );
}