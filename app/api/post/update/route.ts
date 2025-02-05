import Post from '@/app/lib/models/post.model';
import { connect } from '@/app/lib/mongodb/mongoose';
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, image, postId } = body;

    await connect();

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title,
          content,
          category,
          image,
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}