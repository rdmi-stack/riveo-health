"use client";

import { useRef } from "react";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
const otherPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug);

const categoryColors: Record<string, string> = {
  Blog: "text-indigo-600 bg-indigo-50",
  "Case Study": "text-emerald-600 bg-emerald-50",
  Guide: "text-violet-600 bg-violet-50",
  Webinar: "text-amber-600 bg-amber-50",
};

export default function Insights() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
              Insights
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-dark tracking-tight">
              Resources for healthcare leaders
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Article — Full width editorial */}
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="group block mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden min-h-[400px] md:min-h-[480px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      categoryColors[featuredPost.category] ||
                      categoryColors.Blog
                    }`}
                  >
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-300">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-cyan-200 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed line-clamp-2 max-w-xl">
                  {featuredPost.description}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                  {featuredPost.cta}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Scrollable Article Row */}
        <div className="relative">
          {/* Scroll buttons */}
          <div className="hidden md:flex absolute -top-12 right-0 gap-2 z-10">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex-shrink-0 w-[320px] sm:w-[360px] snap-start"
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${
                          categoryColors[post.category] || categoryColors.Blog
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-surface-dark leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
