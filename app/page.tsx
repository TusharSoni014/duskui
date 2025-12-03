"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import {
  ArrowRight,
  Copy,
  Check,
  Github,
  Zap,
  Layout,
  Smartphone,
  Move3d,
  Cpu,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlobalSearch } from "@/components/global-search";

// --- Components ---

const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 rounded-2xl bg-white/3 border border-white/10 hover:border-primary/50 transition-colors overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const CodeBlock = () => {
  const [copied, setCopied] = useState(false);
  const code = `import { motion } from "duskui";

export const Card = () => (
  <motion.div
    animate={{ scale: 1.1 }}
    transition={{ duration: 0.5 }}
  />
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-card border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/2 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
        >
          {copied ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-6 font-mono text-sm overflow-x-auto">
        <pre>
          <code className="text-white/80">
            <span className="text-purple-400">import</span>{" "}
            <span className="text-yellow-300">{`{ motion }`}</span>{" "}
            <span className="text-purple-400">from</span>{" "}
            <span className="text-green-400">&quot;duskui&quot;</span>;{"\n\n"}
            <span className="text-purple-400">export const</span>{" "}
            <span className="text-blue-400">Card</span>{" "}
            <span className="text-white">=</span>{" "}
            <span className="text-yellow-300">()</span>{" "}
            <span className="text-purple-400">{`=>`}</span> ({"\n"}
            {"  "}
            <span className="text-blue-400">{`<motion.div`}</span>
            {"\n"}
            {"    "}
            <span className="text-purple-400">animate</span>
            <span className="text-white">=</span>
            <span className="text-yellow-300">{`{{`}</span>{" "}
            <span className="text-white">scale:</span>{" "}
            <span className="text-orange-400">1.1</span>{" "}
            <span className="text-yellow-300">{`}}`}</span>
            {"\n"}
            {"    "}
            <span className="text-purple-400">transition</span>
            <span className="text-white">=</span>
            <span className="text-yellow-300">{`{{`}</span>{" "}
            <span className="text-white">duration:</span>{" "}
            <span className="text-orange-400">0.5</span>{" "}
            <span className="text-yellow-300">{`}}`}</span>
            {"\n"}
            {"  "}
            <span className="text-blue-400">{`/>`}</span>
            {"\n"}
            );
          </code>
        </pre>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <GridBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-black">D</span>
            </div>
            <span className="font-bold text-xl tracking-tight">DuskUI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link
              href="/components"
              className="hover:text-white transition-colors"
            >
              Components
            </Link>
            <Link
              href="/showcase"
              className="hover:text-white transition-colors"
            >
              Showcase
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <Link href="https://github.com/duskui/duskui" target="_blank">
              <Github className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
            </Link>
            <Button className="bg-white text-black hover:bg-white/90 font-medium rounded-full px-6">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Badge
                variant="outline"
                className="mb-6 border-primary/20 text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                Built for React & Next.js
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                Build
                <br />
                <span className="text-white/40">Beautiful.</span>
              </h1>
              <p className="text-xl text-white/60 mb-10 max-w-lg leading-relaxed">
                Beautiful, production-ready animated components for React and
                Next.js. Ship stunning interfaces in minutes, not hours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-black hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold"
                >
                  Browse Components
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-12 text-base"
                >
                  <span className="font-mono">npm i duskui</span>
                  <Copy className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-50" />
              <CodeBlock />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-white/60 max-w-2xl">
              Built on top of the latest web technologies to ensure
              best-in-class performance and developer experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              index={0}
              icon={Zap}
              title="Lightning Fast"
              description="Optimized for performance with zero runtime overhead for static styles."
            />
            <FeatureCard
              index={1}
              icon={Move3d}
              title="3D Transforms"
              description="Hardware accelerated 3D transforms for buttery smooth animations."
            />
            <FeatureCard
              index={2}
              icon={Layout}
              title="Layout Animations"
              description="Automatic layout animations when components change size or position."
            />
            <FeatureCard
              index={3}
              icon={Smartphone}
              title="Gesture Support"
              description="Rich gesture support including drag, pan, hover, and tap."
            />
            <FeatureCard
              index={4}
              icon={Cpu}
              title="Server Side"
              description="Full support for Server Side Rendering and React Server Components."
            />
            <FeatureCard
              index={5}
              icon={Globe}
              title="Accessibility"
              description="Respects reduced motion preferences automatically."
            />
          </div>
        </div>
      </section>

      {/* Scroll Animation Demo Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <motion.div
                style={{ y }}
                className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-size-[250%_250%,100%_100%] animate-[shimmer_3s_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 90, 180, 270, 360],
                      borderRadius: ["20%", "50%", "20%", "50%", "20%"],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-32 h-32 border-4 border-primary shadow-[0_0_50px_rgba(235,255,56,0.3)]"
                  />
                </div>
              </motion.div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Scroll-linked animations
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Create immersive storytelling experiences by linking animations
                directly to scroll position. No complex math required.
              </p>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {i}
                    </div>
                    <div className="text-white/80">
                      Declarative scroll triggers
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent opacity-50" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to ship?
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Join thousands of developers building the future of the web.
          </p>
          <Button
            size="lg"
            className="h-14 px-10 rounded-full text-lg bg-white text-black hover:bg-white/90"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
              <span className="font-bold text-[10px]">D</span>
            </div>
            <span className="text-sm font-medium text-white/60">
              © 2024 DuskUI Inc.
            </span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
