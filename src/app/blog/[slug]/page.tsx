import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, getAllSlugs } from "@/data/blog";
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
  Blog: "text-indigo-300 bg-indigo-500/20 border-indigo-400/30",
  "Case Study": "text-emerald-300 bg-emerald-500/20 border-emerald-400/30",
  Guide: "text-violet-300 bg-violet-500/20 border-violet-400/30",
  Webinar: "text-amber-300 bg-amber-500/20 border-amber-400/30",
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
        <div className="relative h-[420px] md:h-[500px] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white mb-6 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to all posts
              </Link>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-widest border rounded-full px-3 py-1 mb-4 ${
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
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/20">
                    {post.authorInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {post.author}
                    </p>
                    <p className="text-xs text-white/60">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
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
                  className="text-2xl md:text-3xl font-bold text-surface-dark mt-14 mb-6 first:mt-0"
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  className="text-text-secondary leading-[1.8] text-[17px] mb-6"
                >
                  {block.text}
                </p>
              );
            }
            if (block.type === "list") {
              return (
                <ul
                  key={index}
                  className="list-disc list-outside pl-6 mb-8 space-y-3"
                >
                  {block.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-text-secondary leading-[1.8] text-[17px]"
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
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to transform your revenue cycle?
          </h3>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            See how Riveo Health can help your organization reduce denials,
            accelerate collections, and eliminate revenue leakage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-700 font-semibold text-base hover:bg-indigo-50 transition-colors shadow-xl"
            >
              Book a demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors"
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
