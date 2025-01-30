'use client';

import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';

import dynamic from 'next/dynamic';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
// https://dev.to/a7u/reactquill-with-nextjs-478b
import 'react-quill-new/dist/quill.snow.css';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface FormData {
  title?: string;
  category?: string;
  content?: string;
  image?: string;
}

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const router = useRouter();
  console.log(formData);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // Replace with your Cloudinary preset
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!); // Replace with your Cloudinary cloud name

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUploadProgress(null);
        setImageUploadError(null);
        setFormData({ ...formData, image: data.secure_url });
      } else {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      }
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setPublishError('User not found');
      return;
    }
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMongoId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        router.push(`/post/${data.slug}`);
      }
    } catch {
      setPublishError('Something went wrong');
    }
  };


  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        {publishError && <Alert color="failure">{publishError}</Alert>}
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>          
          <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1'  onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            > <option value='uncategorized'>Select a category</option>
              <option value='javascript'>JavaScript</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
            </Select>
          </div>
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput accept='image/*' onChange={(e) => {if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
              }}} />
            <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage}>
              {imageUploadProgress ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>

          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData.image && <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />}

          <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}/>
          <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
        </form>
      </div>
    );
  } else {
    return <h1 className='text-center text-3xl my-7 font-semibold'>You are not authorized to view this page</h1>;
  }
}
