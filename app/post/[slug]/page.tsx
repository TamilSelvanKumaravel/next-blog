import CallToAction from '@/app/components/CallToAction';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  title: string;
  category?: string;
  image?: string;
  content?: string;
  createdAt?: string;
}

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  // Ensure params is awaited
  const { slug } = await params;

  if (!slug) {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  let post: Post | null = null;

  try {
    const result = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ slug }),
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await result.json();
    console.log('data',data);
    post = data.posts[0] || null;
    console.log('post',post);

  } catch {
    post = { title: 'Failed to load post' };
  }

  if (!post || post.title === 'Failed to load post') {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>

      {post.category && (
        <Link href={`/search?category=${post.category}`} className="self-center mt-5">
          <Button color="gray" pill size="xs">
            {post.category}
          </Button>
        </Link>
      )}

      {post.image ? (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={600}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
          priority
        />
      ) : (
        <Image
          src="/fallback-image.jpg"
          alt="Fallback image"
          width={800}
          height={600}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
      )}

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}</span>
        <span className="italic">{post.content ? (post.content.length / 1000).toFixed(0) : '0'} mins read</span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      ></div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
    </main>
  );
}
