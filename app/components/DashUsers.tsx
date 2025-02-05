'use client';

import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

// Add interface for User type
interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function DashUsers() {
  const { user, isLoaded } = useUser();
  // Update useState with the User type
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userMongoId: user?.publicMetadata?.userMongoId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
    }
  }, [user?.publicMetadata?.isAdmin]);

  if (!user?.publicMetadata?.isAdmin && isLoaded) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full py-7'>
        <h1 className='text-2xl font-semibold'>You are not an admin!</h1>
      </div>
    );
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {user?.publicMetadata?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      width={40}
                      height={40}
                      className='object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}