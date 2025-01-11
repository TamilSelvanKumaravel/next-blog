'use client';

import { useTheme } from 'next-themes';
import { useEffect,useState } from 'react';
import React from 'react'

type ThemeComProps = {
  children: React.ReactNode; // Explicitly type the children prop
};

export default function ThemeCom({children}: ThemeComProps) {
  const {theme} = useTheme();
  const [mounted,setMounted] = useState(false);

  useEffect(()=>setMounted(true),[]);

  if (!mounted){
    return null;
  }
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>{children}</div>
    </div>
  )
}
