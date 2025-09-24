"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: any;
  excerpt?: string;
  imageUrl?: string; // optional image fields
  image?: string;
  coverImage?: string;
  cover?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        })) as Blog[];
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (value: any) => {
    try {
      const d = value?.toDate ? value.toDate() : value instanceof Date ? value : new Date(value);
      if (!d || isNaN(d as unknown as number)) return "Recently";
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d);
    } catch {
      return "Recently";
    }
  };

  const getExcerpt = (b: Blog) => {
    const text = b.excerpt || (b.content ? b.content.replace(/\n+/g, " ") : "");
    const trimmed = text.trim();
    if (trimmed.length <= 180) return trimmed;
    return trimmed.slice(0, 180) + "...";
  };

  const getImageUrl = (b: Partial<Blog>) => b.imageUrl || b.image || b.coverImage || b.cover;

  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs;
    const term = search.toLowerCase();
    return blogs.filter((b) =>
      [b.title, b.author, b.excerpt, b.content]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [blogs, search]);

  const StoriesCount = (
    <span className="text-xs sm:text-sm text-gray-600">
      {blogs.length} {blogs.length === 1 ? "story" : "stories"}
    </span>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-6xl w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-pink-700 hover:text-pink-800 hover:underline"
            >
              ← Back to home
            </Link>
            {StoriesCount}
          </div>
          <Header />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/80 backdrop-blur border border-white/60 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="relative aspect-[16/9] w-full bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />
                  <div className="h-10 w-32 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top controls: back + count */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-200 bg-white/60 text-pink-700 hover:bg-white shadow-sm"
            aria-label="Back to home"
          >
            ← Back to home
          </Link>
          {StoriesCount}
        </div>

        <Header />

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, or content..."
              className="w-full rounded-xl border border-pink-100 bg-white/80 backdrop-blur px-4 py-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label="Search blog posts"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-600 mt-16">
            <p className="text-lg">No matching blogs found.</p>
            {search ? (
              <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center">
                <button
                  onClick={() => setSearch("")}
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  Reset search
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-5 py-2.5 rounded-full border border-pink-200 bg-white/70 text-pink-700 hover:bg-white shadow-sm"
                >
                  Back to home
                </Link>
              </div>
            ) : (
              <p className="mt-2">Please check back later.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            {filteredBlogs.map((blog) => {
              const img = getImageUrl(blog);
              return (
                <article
                  key={blog.id}
                  className="group rounded-2xl bg-white/90 backdrop-blur border border-white/70 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                >
                  {img ? (
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={img}
                        alt={blog.title || "Blog cover"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-500">
                      <span className="text-4xl" aria-hidden>🖼️</span>
                      <span className="sr-only">No image available</span>
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800 leading-snug">
                      <Link href={`/blog/${blog.id}`} className="hover:text-pink-600 transition-colors">
                        {blog.title}
                      </Link>
                    </h2>

                    <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
                      <div className="h-8 w-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-medium">
                        {blog.author?.[0]?.toUpperCase() || "A"}
                      </div>
                      <span className="truncate">{blog.author}</span>
                      <span className="mx-1">•</span>
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                      {getExcerpt(blog)}
                    </p>

                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all"
                        aria-label={`Read more: ${blog.title}`}
                      >
                        Read More
                        <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="text-center">
      <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
        PCOS Stories & Insights
      </h1>
      <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-pretty px-2">
        Read personal journeys, tips, and expert-backed insights. Stay informed and inspired.
      </p>
    </header>
  );
}
