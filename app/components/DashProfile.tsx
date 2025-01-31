'use client';

import { UserProfile } from '@clerk/nextjs';
import { dark, neobrutalism } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function DashProfile() {
  const { theme } = useTheme();
  return (
    <div className='flex justify-center items-center w-full'>
      <UserProfile
        appearance={{
          baseTheme: theme === 'dark' ? dark : neobrutalism,
        }}
        routing='hash'
      />
    </div>
  );
}