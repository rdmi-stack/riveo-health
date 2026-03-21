"use client";

import { ArrowRight, Calendar, Phone, Send } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: headline + text */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Stop leaking revenue.
              <br />
              <span className="text-cyan-300">Start controlling it.</span>
            </h2>
            <p className="mt-6 text-lg text-indigo-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Get a free revenue leakage audit and see exactly how much Riveo Health
              can recover for your organization. Most clients see ROI within 30
              days.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-full hover:bg-indigo-50 transition-colors shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Schedule a Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Talk to an Expert
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-indigo-300">
              <span>No commitment required</span>
              <span className="w-1 h-1 bg-indigo-400 rounded-full" />
              <span>Free revenue audit</span>
              <span className="w-1 h-1 bg-indigo-400 rounded-full" />
              <span>Results in 24 hours</span>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-1">
              Request a Demo
            </h3>
            <p className="text-sm text-indigo-200 mb-6">
              Fill out the form and our team will reach out within 24 hours.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="cta-name"
                  className="block text-xs font-medium text-indigo-200 mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="cta-name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="cta-email"
                  className="block text-xs font-medium text-indigo-200 mb-1.5"
                >
                  Work Email *
                </label>
                <input
                  id="cta-email"
                  type="email"
                  placeholder="jane@hospital.org"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="cta-org"
                  className="block text-xs font-medium text-indigo-200 mb-1.5"
                >
                  Organization *
                </label>
                <input
                  id="cta-org"
                  type="text"
                  placeholder="Metro Health Systems"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="cta-phone"
                  className="block text-xs font-medium text-indigo-200 mb-1.5"
                >
                  Phone{" "}
                  <span className="text-indigo-300/50">(optional)</span>
                </label>
                <input
                  id="cta-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 text-white font-semibold text-sm hover:from-cyan-300 hover:to-indigo-300 transition-all shadow-lg shadow-cyan-500/20 mt-2"
              >
                <Send className="w-4 h-4" />
                Get Your Free Audit
              </button>

              <p className="text-xs text-indigo-300/60 text-center pt-1">
                By submitting, you agree to our Privacy Policy. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
