import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/data/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Riveo Health`,
    description: post.description,
  };
}

const categoryColors: Record<string, string> = {
  Blog: "text-primary border-primary/20",
  "Case Study": "text-emerald-600 border-emerald-200 bg-emerald-50",
  Guide: "text-violet-600 border-violet-200 bg-violet-50",
  Webinar: "text-amber-600 border-amber-200 bg-amber-50",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24">
        <div className="relative h-[400px] md:h-[480px] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Link>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-widest border rounded px-3 py-1 mb-4 ${
                  categoryColors[post.category] || categoryColors.Blog
                }`}
              >
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                    {post.authorInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {post.author}
                    </p>
                    <p className="text-xs text-white/70">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 bg-white">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.content.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={index}
                  className="text-2xl md:text-3xl font-bold text-surface-dark mt-12 mb-6 first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  className="text-text-secondary leading-relaxed text-lg mb-6"
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === "list") {
              return (
                <ul
                  key={index}
                  className="list-disc list-outside pl-6 mb-6 space-y-3"
                >
                  {block.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-text-secondary leading-relaxed text-lg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </article>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-surface-dark mb-4">
            Ready to transform your revenue cycle?
          </h3>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            See how Riveo Health can help your organization reduce denials, accelerate
            collections, and eliminate revenue leakage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Book a demo
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 text-text-secondary font-semibold text-sm hover:border-primary/40 hover:text-primary transition-all"
            >
              Read more articles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
