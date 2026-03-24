import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface-darker flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold gradient-text mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-slate-400 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90">
              Go Home
            </Link>
            <Link href="/audit" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5">
              Free Audit
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
