"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  imageUrl?: string;
  image?: string;
  coverImage?: string;
  cover?: string;
}

export default function BlogPost() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBlog({
            id: docSnap.id,
            ...(docSnap.data() as any),
          } as Blog);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if ((params as any)?.id) {
      fetchBlog();
    }
  }, [params]);

  const formattedDate = useMemo(() => {
    if (!blog?.createdAt) return "Recently";
    try {
      const d = blog.createdAt?.toDate ? blog.createdAt.toDate() : new Date(blog.createdAt);
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d);
    } catch {
      return "Recently";
    }
  }, [blog?.createdAt]);

  const getImageUrl = (b?: Partial<Blog> | null) => b?.imageUrl || b?.image || b?.coverImage || b?.cover;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-3xl w-full">
          <div className="mb-8 h-5 w-32 bg-white/60 rounded-full animate-pulse" />
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 p-8 shadow-sm">
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-6 animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-8 animate-pulse" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 rounded mb-3 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center bg-white/90 backdrop-blur border border-white/70 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog not found</h1>
          <Link href="/blog" className="inline-flex items-center text-pink-600 hover:underline">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const img = getImageUrl(blog);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-pink-700 hover:text-pink-800 hover:underline mb-6"
        >
          ← Back to blogs
        </Link>

        <article className="bg-white/95 backdrop-blur border border-white/70 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400" />

          {img ? (
            <div className="relative w-full aspect-[16/9]">
              <Image
                src={img}
                alt={blog.title || "Blog cover"}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          ) : null}

          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-8 text-gray-600 text-sm border-b pb-6">
              <div className="h-9 w-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-semibold">
                {blog.author?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="font-medium">{blog.author}</span>
              <span>•</span>
              <time dateTime={String(blog.createdAt)}>{formattedDate}</time>
            </div>

            <div className="prose prose-p:my-3 prose-headings:mt-6 prose-headings:mb-3 prose-a:text-pink-600 max-w-none text-gray-800">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="leading-relaxed text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/blog"
            className="inline-flex justify-center sm:justify-start items-center px-5 py-2.5 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          >
            ← Back to all posts
          </Link>
          <a
            href="#top"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </div>
  );
}
