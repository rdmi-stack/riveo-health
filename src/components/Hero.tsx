"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  Play,
  Shield,
  Zap,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Custom hook: animate a number from 0 → target when visible        */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

/* ------------------------------------------------------------------ */
/*  Stat definitions                                                  */
/* ------------------------------------------------------------------ */
const stats = [
  { target: 60, suffix: "%", label: "Fewer Denials" },
  { target: 3, suffix: "x", label: "Faster Collections" },
  { target: 97, suffix: "%", label: "First-Pass Rate" },
  { target: 30, suffix: "-Day", label: "ROI" },
];

/* ------------------------------------------------------------------ */
/*  Activity feed items                                               */
/* ------------------------------------------------------------------ */
const activities = [
  "Claim #CLM-9284 paid — $1,240",
  "Denial auto-corrected — CLM-4821",
  "Payment received — $3,450",
];

/* ------------------------------------------------------------------ */
/*  Technology proof points                                           */
/* ------------------------------------------------------------------ */
const proofPoints = [
  "50M+ Claims Trained",
  "40+ EHR Integrations",
  "SOC 2 Type II",
  "HIPAA Compliant",
];

/* ------------------------------------------------------------------ */
/*  Typing words                                                      */
/* ------------------------------------------------------------------ */
const typingWords = ["Operating System", "Control Center", "Intelligence Engine"];

/* ------------------------------------------------------------------ */
/*  Stat counter component                                            */
/* ------------------------------------------------------------------ */
function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { value, ref } = useCountUp(target, 2000);
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-cyan-300">
        {value}
        {suffix}
      </p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

/* ================================================================== */
/*  Hero component                                                    */
/* ================================================================== */
export default function Hero() {
  /* ---- typing animation ---- */
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typingWords[wordIndex];
    const typeSpeed = isDeleting ? 40 : 80;
    const pauseAtEnd = 2000;
    const pauseAtStart = 400;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // typing forward
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          // pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseAtEnd);
        }
      } else {
        // deleting
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setTimeout(
            () => setWordIndex((prev) => (prev + 1) % typingWords.length),
            pauseAtStart
          );
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  /* ---- live activity feed ---- */
  const [activityIndex, setActivityIndex] = useState(0);
  const [activityFading, setActivityFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivityFading(true);
      setTimeout(() => {
        setActivityIndex((prev) => (prev + 1) % activities.length);
        setActivityFading(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />
      </div>

      {/* Particle / dot-grid background */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${(i * 3.33) % 100}%`,
              animationDuration: `${6 + (i % 5) * 2}s`,
              animationDelay: `${(i * 0.7) % 8}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              opacity: 0.15 + (i % 4) * 0.08,
            }}
          />
        ))}
      </div>

      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ============ Left Content ============ */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-cyan-300 mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              AI-Native Healthcare Infrastructure
            </div>

            {/* Headline with typing effect */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              The Revenue
              <br />
              <span className="text-cyan-300 inline-block min-w-[280px] sm:min-w-[420px] lg:min-w-[540px]">
                {displayText}
                <span className="hero-cursor">|</span>
              </span>
              <br />
              for Healthcare
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
              Control patient interactions, automate revenue cycles, and own the
              financial layer of healthcare. One AI-native platform that turns
              revenue leakage into revenue growth.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-900 bg-white rounded-full hover:bg-indigo-50 transition-all shadow-xl"
              >
                Request a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#platform"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                SOC 2 Type II
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                99.9% Uptime
              </div>
            </div>
          </div>

          {/* ============ Right Side – Platform Preview ============ */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main dashboard card */}
              <div className="hero-card-enter hero-card-delay-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-400">Revenue Dashboard</p>
                    <p className="text-3xl font-bold text-white">$2.4M</p>
                    <p className="text-sm text-cyan-400 font-medium">
                      +23.5% vs last month
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                {/* Chart bars */}
                <div className="flex items-end gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md transition-all hover:opacity-80"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 11
                              ? "linear-gradient(135deg, #4F46E5, #06B6D4)"
                              : i >= 9
                              ? "rgba(129,140,248,0.6)"
                              : "rgba(129,140,248,0.2)",
                        }}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>

                {/* Live Activity Feed */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-400">
                      Live Activity
                    </span>
                  </div>
                  <p
                    className={`text-xs text-slate-300 transition-opacity duration-400 ${
                      activityFading ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {activities[activityIndex]}
                  </p>
                </div>
              </div>

              {/* Floating card – Claims */}
              <div className="hero-card-enter hero-card-delay-2 absolute -left-8 top-12 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 w-52 animate-float">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Claims Processed</p>
                    <p className="text-lg font-bold text-white">12,847</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="gradient-bg h-2 rounded-full"
                    style={{ width: "97%" }}
                  />
                </div>
                <p className="text-xs text-cyan-400 mt-1 font-medium">
                  97% success rate
                </p>
              </div>

              {/* Floating card – AI Agent */}
              <div
                className="hero-card-enter hero-card-delay-3 absolute -right-4 bottom-8 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 w-56 animate-float"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <p className="text-xs font-medium text-cyan-400">
                    AI Agent Active
                  </p>
                </div>
                <p className="text-sm text-slate-300">
                  &quot;Denied claim #4821 auto-corrected and resubmitted.
                  Expected recovery: $3,200&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============ Stats bar with count-up ============ */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

        {/* ============ Technology proof points ============ */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {proofPoints.map((point) => (
            <span
              key={point}
              className="inline-flex items-center px-4 py-2 text-sm text-slate-300 border border-white/15 rounded-full backdrop-blur-sm bg-white/5"
            >
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
