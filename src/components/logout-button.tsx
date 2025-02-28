"use client";

import { signOut } from 'next-auth/react'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

const LogoutButton = () => {

  const handleClick = async () => {
    await signOut();
  }

  return (
    <button 
      onClick={handleClick}
      className="flex items-center px-4 py-2 border border-red-500 text-red-500 bg-transparent hover:bg-red-50 rounded-full">
      <ArrowRightEndOnRectangleIcon className="h-6 w-6 mr-2" />
      Logout
    </button>
  )
}

export default LogoutButton
