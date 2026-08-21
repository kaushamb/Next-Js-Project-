"use client";
import { User } from '@/app/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface HeaderProps{
    user: User | null;
}
const Header = ({user}: HeaderProps) => {
  const pathname = usePathname();
  const navigation =[
    {name:"Home",href:'/',show: true},
    {name:"Dashboard", href:'/dashboard',show: true}
  ].filter((item)=>item.show);
  return (
    <header className='bg-slate-900 border-b border-slate-700'>
        <div className='container mx-auto px-4'>
            <div className='flex justify-between items-center h-16'>
                <Link href="/" className="font-bold text-xl text-white">
                    TeamAccess
                </Link>

                <nav className='flex items-center'></nav>
            </div>
        </div>
    </header>
  )
}

export default Header;