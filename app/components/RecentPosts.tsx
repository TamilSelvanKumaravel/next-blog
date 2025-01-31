import PostCard from './PostCard';

interface RecentPostsLimitProps{
    limit:number
}

interface Post {
    _id:string;
    // userId:string;
    // updatedAt:string;
    title: string;
    slug:string;
    image:string;
    // createdAt:string;
    // content?: string;
    category?: string;
  }

export default async function RecentPosts({limit}:RecentPostsLimitProps) {
  let posts = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ limit: limit, order: 'desc' }),
      cache: 'no-store',
    });
    const data = await result.json();
    console.log('data',data)
    posts = data.posts;
    console.log('posts',posts)
  } catch (error) {
    console.log('Error getting post:', error);
  }
  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-xl mt-5'>Recent articles</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {posts && posts.map((post:Post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}