"use client"
import  { useRouter } from 'next/navigation';

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

  export function Appbar() {
    const router = useRouter();
   return  <ClerkProvider>
      <div className='flex justify-between items-center p-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50'>
        <button onClick={()=>router.push("/")} className='text-5xl cursor-pointer md:text-4xl font-bold text-white align-center leading-tight'>Uptime</button>
        <div className='flex gap-2 content-center'>
          <SignedOut>
            <div className='cursor-pointer flex content-center'>
            <SignInButton />
            </div>
            

            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </ClerkProvider>
  }