"use client";

import { ArrowRight, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

const featuredPost = blogPosts.find((p) => p.featured)!;
const articles = blogPosts.filter((p) => !p.featured);

const featured = {
  slug: featuredPost.slug,
  category: featuredPost.category,
  image: featuredPost.image,
  title: featuredPost.title,
  description: featuredPost.description,
  author: featuredPost.author,
  role: featuredPost.authorRole,
  date: featuredPost.date,
  readTime: featuredPost.readTime,
  cta: featuredPost.cta,
};

const articleCards = articles.map((a) => ({
  slug: a.slug,
  category: a.category,
  image: a.image,
  title: a.title,
  description: a.description,
  author: a.author,
  date: a.date,
  readTime: a.readTime,
  cta: a.cta,
}));

const categoryColors: Record<string, string> = {
  Blog: "text-primary border-primary/20",
  "Case Study": "text-emerald-600 border-emerald-200 bg-emerald-50",
  Guide: "text-violet-600 border-violet-200 bg-violet-50",
  Webinar: "text-amber-600 border-amber-200 bg-amber-50",
};

export default function Insights() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight">
            Insights and news worth sharing
          </h2>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all shrink-0"
          >
            View all resources
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Article */}
        <div className="mb-14">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid md:grid-cols-2 gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-72 md:h-full min-h-[320px] overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <span
                className={`self-start text-xs font-bold uppercase tracking-widest border rounded px-3 py-1 mb-5 ${
                  categoryColors[featured.category] || categoryColors.Blog
                }`}
              >
                {featured.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-surface-dark leading-snug mb-4 group-hover:text-primary transition-colors">
                {featured.title}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-6 line-clamp-3">
                {featured.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                    {featured.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-dark">
                      {featured.author}
                    </p>
                    <p className="text-xs text-text-muted">{featured.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  {featured.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Article Grid - top row of 3 */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {articleCards.slice(0, 3).map((post) => (
            <Link
              key={post.title}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest border rounded px-3 py-1 ${
                      categoryColors[post.category] || categoryColors.Blog
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-surface-dark leading-snug mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1 line-clamp-3">
                  {post.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-surface-dark">
                        {post.author}
                      </p>
                      <p className="text-[10px] text-text-muted">{post.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Read
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom row of 2 - wider cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {articleCards.slice(3, 5).map((post) => (
            <Link
              key={post.title}
              href={`/blog/${post.slug}`}
              className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 sm:h-auto sm:w-56 shrink-0 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-bold uppercase tracking-widest border rounded px-3 py-1 ${
                      categoryColors[post.category] || categoryColors.Blog
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-surface-dark leading-snug mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-[10px] font-bold">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-surface-dark">
                        {post.author}
                      </p>
                      <p className="text-[10px] text-text-muted">{post.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    {post.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
