"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
  CirclePlay,
  Command,
  PenLine,
  Search,
  Target,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover what is trending",
    description:
      "Run automated web searches from your queries to find timely trends and the conversations worth joining.",
    className: "md:col-span-2",
  },
  {
    icon: PenLine,
    title: "Create posts in your voice",
    description:
      "Turn your ideas and research into polished Twitter posts you can review, edit, and publish manually.",
    className: "md:col-span-1",
  },
  {
    icon: Bot,
    title: "Automate your posting",
    description:
      "Set up workflows that search the web, generate posts from your prompts, and publish them on your schedule.",
    className: "md:col-span-1",
  },
  {
    icon: BarChart3,
    title: "Schedule with confidence",
    description:
      "Plan your Twitter content in one place and choose exactly when each post should go live.",
    className: "md:col-span-2",
  },
];

const steps = [
  ["01", "Define a query", "Tell Xcel what topics, trends, or conversations to monitor."],
  ["02", "Generate a post", "Xcel researches the web and creates a relevant Twitter post."],
  ["03", "Publish on time", "Review it yourself or automate publishing for your chosen time."],
];

export default function Home() {
  return (
    <main className="landing-page min-h-screen overflow-hidden bg-[#08090d] text-white">
      <div className="landing-noise pointer-events-none fixed inset-0 z-0 opacity-30" />
      <nav className="landing-nav fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-[#101116]/70 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <Image src="/icon.svg" alt="Xcel" width={32} height={32} className="rounded-lg" />
          <span className="text-lg">Xcel</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-white/55 md:flex">
          <a href="#product" className="transition hover:text-white">Product</a>
          <a href="#workflow" className="transition hover:text-white">Workflow</a>
          <a href="#features" className="transition hover:text-white">Features</a>
        </div>
        <Link
          href="/dashboard"
          className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#101116] transition hover:bg-[#d9ff68]"
        >
          Open app <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
      </nav>

      <section className="relative z-10 mx-auto flex min-h-[800px] max-w-6xl flex-col items-center justify-center px-6 pb-24 pt-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9ff68]/20 bg-[#d9ff68]/8 px-3 py-1.5 text-xs font-medium text-[#d9ff68]"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-[#d9ff68]" />
          Twitter automation, without the guesswork
          <ChevronRight className="size-3.5" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="max-w-4xl text-balance text-5xl font-medium tracking-[-0.06em] sm:text-7xl lg:text-[92px] lg:leading-[0.98]"
        >
          Turn trends into <span className="landing-gradient-text">timely tweets.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg"
        >
          Xcel is a Twitter automation platform for creating, scheduling, and
          publishing posts — manually or automatically from live web trends.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/dashboard" className="landing-primary-button group">
            Start automating <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
          <a href="#product" className="landing-secondary-button">
            <CirclePlay className="size-4" /> See how it works
          </a>
        </motion.div>
        <div className="landing-orb landing-orb-one" />
        <div className="landing-orb landing-orb-two" />
      </section>

      <section id="product" className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="landing-dashboard-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#111319] p-2 shadow-2xl shadow-black/40"
        >
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <span className="size-2 rounded-full bg-[#ff6b6b]" />
            <span className="size-2 rounded-full bg-[#ffd166]" />
            <span className="size-2 rounded-full bg-[#9bea78]" />
            <span className="ml-3 text-[11px] text-white/30">xcel / workspace</span>
          </div>
          <div className="grid min-h-[360px] gap-4 p-4 md:grid-cols-[180px_1fr]">
            <div className="hidden space-y-2 border-r border-white/8 pr-4 md:block">
              <div className="mb-7 flex items-center gap-2 text-sm font-semibold"><Image src="/icon.svg" alt="" width={18} height={18} className="rounded" /> Xcel</div>
              {["Overview", "Research", "Schedule", "Automation"].map((item, index) => (
                <div key={item} className={`rounded-lg px-3 py-2 text-xs ${index === 0 ? "bg-white/8 text-white" : "text-white/35"}`}>{item}</div>
              ))}
            </div>
            <div className="p-2 md:p-5">
              <div className="flex items-end justify-between">
                <div><p className="text-xs text-white/35">Tuesday, September 08</p><h2 className="mt-2 text-2xl font-medium">Your Twitter workspace.</h2></div>
                <div className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-white/45 sm:block"><Command className="mr-2 inline size-3" /> K to search</div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["12", "Posts scheduled", "This week"],
                  ["08", "Trend searches", "Automated"],
                  ["04", "Posts ready", "For review"],
                ].map(([value, label, delta]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-2xl font-medium">{value}</p><p className="mt-1 text-xs text-white/35">{label}</p><p className="mt-3 text-[11px] text-[#d9ff68]">{delta}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex justify-between text-xs"><span className="text-white/55">Publishing activity</span><span className="text-white/30">Last 30 days</span></div>
                <div className="mt-6 flex h-20 items-end gap-1.5">
                  {[28, 36, 31, 48, 42, 56, 50, 67, 61, 73, 68, 86, 78, 96].map((height, i) => <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#829b3b] to-[#d9ff68]" />)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d9ff68]">Built for Twitter workflows</p><h2 className="max-w-2xl text-4xl font-medium tracking-[-0.04em] sm:text-5xl">From web research to scheduled post, all in one place.</h2></div>
          <p className="max-w-xs text-sm leading-6 text-white/45">Create posts yourself, schedule them ahead, or let automation turn your queries into timely content.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description, className }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: index * 0.08 }} className={`landing-feature-card ${className}`}>
              <div className="mb-14 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#d9ff68]"><Icon className="size-5" /></div>
              <h3 className="text-xl font-medium">{title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-white/45">{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div><p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#d9ff68]">How automation works</p><h2 className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Your content, researched and published on your terms.</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/45">Give Xcel a query and a time. It finds relevant web trends, creates a post, and helps you publish it exactly when you choose.</p></div>
          <div className="space-y-3">{steps.map(([number, title, description]) => <div key={number} className="group flex items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.025] p-5 transition hover:border-[#d9ff68]/30 hover:bg-white/[0.05]"><span className="text-xs text-[#d9ff68]">{number}</span><div className="flex-1"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm text-white/40">{description}</p></div><ArrowRight className="size-4 text-white/25 transition group-hover:translate-x-1 group-hover:text-[#d9ff68]" /></div>)}</div>
        </div>
      </section>

      <section className="relative z-10 mx-auto my-24 w-[calc(100%-3rem)] max-w-5xl overflow-hidden rounded-3xl border border-[#d9ff68]/20 bg-[#d9ff68] px-6 py-20 text-center text-[#0b0d0b] sm:px-12">
        <div className="relative z-10"><Target className="mx-auto mb-5 size-8" /><h2 className="mx-auto max-w-2xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Your next tweet can start with a query.</h2><p className="mx-auto mt-5 max-w-md text-sm leading-6 text-[#273020]">Create manually, schedule ahead, or automate trend-based posts with Xcel.</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0b0d0b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#242a20]">Open Xcel <Zap className="size-4" /></Link></div>
        <div className="absolute -left-20 -top-32 size-80 rounded-full border border-black/10" /><div className="absolute -bottom-48 -right-20 size-96 rounded-full border border-black/10" />
      </section>

      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 border-t border-white/8 px-6 py-10 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-medium text-white"><Image src="/icon.svg" alt="Xcel" width={28} height={28} className="rounded-md" /> Xcel</div>
        <p>Designed and built by <span className="text-white/70">Rahul Sain</span> · © 2026</p>
        <div className="flex gap-5"><a href="#product" className="transition hover:text-white">Product</a><a href="#features" className="transition hover:text-white">Features</a><Link href="/dashboard" className="transition hover:text-white">App</Link></div>
      </footer>
    </main>
  );
}
