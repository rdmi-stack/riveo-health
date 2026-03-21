"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";

const categories = ["All", "Blog", "Case Study", "Guide", "Webinar"] as const;

const categoryColors: Record<string, string> = {
  Blog: "text-primary border-primary/20",
  "Case Study": "text-emerald-600 border-emerald-200 bg-emerald-50",
  Guide: "text-violet-600 border-violet-200 bg-violet-50",
  Webinar: "text-amber-600 border-amber-200 bg-amber-50",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <main>
      <Navbar />

      <section className="pt-32 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-surface-dark tracking-tight mb-4">
              Insights &amp; Resources
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Expert perspectives on healthcare revenue cycle management, AI
              automation, and operational excellence.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-secondary border-gray-200 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          {featured && (
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
                  <h2 className="text-2xl md:text-3xl font-bold text-surface-dark leading-snug mb-4 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-text-secondary leading-relaxed mb-6 line-clamp-3">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                        {featured.authorInitials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-dark">
                          {featured.author}
                        </p>
                        <p className="text-xs text-text-muted">
                          {featured.authorRole}
                        </p>
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
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {rest.map((post) => (
              <Link
                key={post.slug}
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
                        {post.authorInitials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-surface-dark">
                          {post.author}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {post.date}
                        </p>
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
