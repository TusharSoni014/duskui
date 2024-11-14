"use client"

import React, { ReactNode, useState, useEffect } from "react";
import AnimatedReveal from "@/components/ui/animated-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { IoIosContact } from "react-icons/io";
import { RiPuzzleFill, RiNpmjsFill } from "react-icons/ri";
import { FiGithub, FiPackage, FiZap, FiFeather, FiCode, FiBox, FiLayout, FiStar } from "react-icons/fi";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

interface ComponentPreviewProps {
  children: ReactNode;
  title?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="p-6 bg-black/20 border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-white/5 rounded-lg">
          <Icon className="w-6 h-6 text-white/70" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
  <Card className="p-4 bg-black/20 border-white/10">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon className="w-5 h-5 text-white/70" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-white/60">{label}</div>
      </div>
    </div>
  </Card>
);

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ children, title }) => (
  <div className="relative p-4 rounded-lg bg-black/30 border border-white/10">
    <div className="absolute top-3 left-3 flex items-center space-x-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/30" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
        <div className="w-3 h-3 rounded-full bg-green-500/30" />
      </div>
      {title && (
        <div className="text-xs text-white/40">{title}</div>
      )}
    </div>
    <div className="pt-8">{children}</div>
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto">
    <code className="text-sm text-white/80">{code}</code>
  </pre>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Enhanced Abstract Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div style={{ opacity }} className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -top-48 -right-48 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -bottom-48 -left-48 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center mb-6"
            >
              <div className="text-7xl font-bold bg-gradient-to-t from-white/100 to-white/70 bg-clip-text text-transparent flex items-center">
                <Image
                  alt="DuskUI"
                  src="https://pub-f215723903f74ba688c6a4a886cd3abb.r2.dev/duskui.svg"
                  height={25}
                  width={25}
                  className="[filter:invert(100%)] object-contain h-full w-[55px] mr-1"
                  priority
                />
                usk UI
              </div>
            </motion.div>

            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="bg-white/5 text-white/70">
                v1.0.0 Beta
              </Badge>
            </div>

            <AnimatedReveal className="text-white/60 text-xl max-w-2xl mx-auto mb-8">
              A modern, open-source UI component library for Next.js and React
              with beautiful animations and unique components.
            </AnimatedReveal>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link href="/components">
                <Button className="flex items-center gap-2 px-6 py-5 text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300">
                  <RiPuzzleFill className="w-5 h-5" />
                  Browse Components
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/duskui">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2 px-6 py-5 text-lg bg-white/5 hover:bg-white/10"
                >
                  <FiGithub className="w-5 h-5" />
                  GitHub
                </Button>
              </Link>
              {/* <Link href="https://www.npmjs.com/package/duskui">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-5 text-lg"
                >
                  <RiNpmjsFill className="w-5 h-5" />
                  npm install duskui
                </Button>
              </Link> */}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-20">
              <StatCard icon={FiBox} value="50+" label="Components" />
              <StatCard icon={FiStar} value="1.2k" label="GitHub Stars" />
              <StatCard icon={FiCode} value="100%" label="TypeScript" />
              <StatCard icon={FiLayout} value="20+" label="Templates" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 px-4">
            <FeatureCard
              icon={FiZap}
              title="Animated Components"
              description="Beautiful, smooth animations that bring your UI to life without compromising performance."
            />
            <FeatureCard
              icon={FiPackage}
              title="Modified shadcn/ui"
              description="Enhanced versions of shadcn/ui components with additional features and animations."
            />
            <FeatureCard
              icon={FiFeather}
              title="Lightweight"
              description="Optimized for performance with minimal bundle size impact."
            />
            <FeatureCard
              icon={RiPuzzleFill}
              title="Unique Components"
              description="Custom-designed components you won't find anywhere else."
            />
            <FeatureCard
              icon={FiCode}
              title="TypeScript First"
              description="Built with TypeScript for better developer experience and type safety."
            />
            <FeatureCard
              icon={FiLayout}
              title="Responsive Design"
              description="Fully responsive components that work seamlessly across all devices."
            />
          </div>

          {/* Component Preview Section */}
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Beautiful Components
            </h2>
            <p className="text-white/60 mb-8">
              Discover our collection of carefully crafted components
            </p>

            <Tabs defaultValue="buttons" className="max-w-4xl mx-auto">
              <TabsList className="mb-8 bg-black/20">
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
              </TabsList>

              <TabsContent value="buttons">
                <ComponentPreview title="Button.tsx">
                  <div className="space-y-4">
                    <Button variant="default" className="w-full">
                      Default Button
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Secondary Button
                    </Button>
                    <Button variant="outline" className="w-full">
                      Outline Button
                    </Button>
                  </div>
                </ComponentPreview>
              </TabsContent>

              <TabsContent value="cards">
                <ComponentPreview title="Card.tsx">
                  <Card className="p-4 bg-black/20 border-white/10">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-1/2" />
                      <div className="h-4 bg-white/10 rounded w-2/3" />
                    </div>
                  </Card>
                </ComponentPreview>
              </TabsContent>

              <TabsContent value="forms">
                <ComponentPreview title="Form.tsx">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Email address"
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white/90 placeholder:text-white/40"
                    />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </ComponentPreview>
              </TabsContent>
            </Tabs>
          </div>

          {/* Installation Section */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Quick Installation
              </h2>
              <p className="text-white/60">
                Get started with DuskUI in just a few steps
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <ComponentPreview title="Terminal">
                <CodeBlock code="npm install  @radix-ui/react-icons framer-motion" />
              </ComponentPreview>

              <ComponentPreview title="Example Usage">
                <CodeBlock code={`import { Button } from 'duskui/components';

export default function App() {
  return (
    <Button variant="default">
      Click me
    </Button>
  );
}`} />
              </ComponentPreview>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Build?
            </h2>
            <p className="text-white/60 mb-8">
              Start creating beautiful interfaces with DuskUI
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/docs/installation">
                <Button className="flex items-center gap-2">
                  <FiPackage />
                  Get Started
                </Button>
              </Link>
              <Link href="/components">
                <Button variant="secondary" className="flex items-center gap-2">
                  <RiPuzzleFill />
                  Browse Components
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="flex items-center gap-2">
                  <IoIosContact />
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-white/40 py-8 border-t border-white/10">
            <p>© {new Date().getFullYear()} DuskUI. MIT License.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}