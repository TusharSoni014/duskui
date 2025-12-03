"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Rocket,
  Mail,
  Download,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
  Send,
  Heart,
  Star,
  Trash2,
  Plus,
  ArrowRight,
  Settings,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock, InlineCode } from "@/components/ui/code-block";

// Code snippets for documentation
const installCode = `npx shadcn@latest add button`;

const dependenciesCode = `npm install motion lucide-react`;

const basicUsageCode = `import { Button } from "@/components/ui/button"

export default function Example() {
  return <Button>Click me</Button>
}`;

const loadingCode = `import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export default function Example() {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <Button loading={loading} onClick={handleClick}>
      <Rocket className="w-4 h-4" />
      Launch
    </Button>
  )
}`;

const customLoaderCode = `import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function Example() {
  return (
    <Button loading loaderIcon={RefreshCw}>
      Syncing...
    </Button>
  )
}`;

const variantsCode = `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`;

const sizesCode = `<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Rocket /></Button>`;

const withIconsCode = `<Button>
  <Mail className="w-4 h-4" />
  Send Email
</Button>

<Button variant="outline">
  <Download className="w-4 h-4" />
  Download
</Button>`;

export default function ButtonPage() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (id: string, duration = 2000) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }, duration);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-3">Button</h1>
        <p className="text-lg text-white/60">
          Enhanced button with loading states, animated icon transitions, and
          smooth animations powered by Framer Motion.
        </p>
      </motion.div>

      {/* ============================================ */}
      {/* PREVIEW SECTION - All variants & demos */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-16"
      >
        <div className="p-8 rounded-2xl bg-white/2 border border-white/10">
          {/* Variants */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Variants
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Sizes
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="icon-sm" variant="outline">
                <Heart className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon-lg" variant="outline">
                <Star className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              With Icons
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
              <Button variant="secondary">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              <Button variant="ghost">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
              <Button>
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Loading States - Interactive */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Loading States
              <span className="ml-2 text-xs text-white/30 normal-case tracking-normal">
                (click to try)
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                loading={loadingStates["demo1"]}
                onClick={() => handleLoadingDemo("demo1")}
              >
                <Rocket className="w-4 h-4" />
                Launch
              </Button>
              <Button
                variant="secondary"
                loading={loadingStates["demo2"]}
                onClick={() => handleLoadingDemo("demo2")}
              >
                <Send className="w-4 h-4" />
                Send
              </Button>
              <Button
                variant="outline"
                loading={loadingStates["demo3"]}
                onClick={() => handleLoadingDemo("demo3")}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="destructive"
                loading={loadingStates["demo4"]}
                onClick={() => handleLoadingDemo("demo4")}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Custom Loader Icons */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Custom Loader Icons
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button loading loaderIcon={Loader2}>
                Default Loader
              </Button>
              <Button loading loaderIcon={RefreshCw} variant="secondary">
                Refresh Loader
              </Button>
            </div>
          </div>

          {/* Disabled States */}
          <div>
            <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
              Disabled
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Default</Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Button variant="outline" disabled>
                Outline
              </Button>
              <Button variant="destructive" disabled>
                Destructive
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* DOCUMENTATION SECTION */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-white/10">
          Documentation
        </h2>

        {/* Installation */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Installation</h3>
          <p className="text-white/60 mb-4">
            This component extends the{" "}
            <InlineCode>shadcn/ui</InlineCode> Button. First, install the base
            component:
          </p>
          <CodeBlock code={installCode} title="Terminal" language="shell" />
          <p className="text-white/60 mt-4 mb-4">
            Then install the required dependencies for animations:
          </p>
          <CodeBlock code={dependenciesCode} title="Terminal" language="shell" />
        </section>

        {/* Basic Usage */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
          <CodeBlock code={basicUsageCode} title="example.tsx" />
        </section>

        {/* Variants */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Variants</h3>
          <p className="text-white/60 mb-4">
            Use the <InlineCode>variant</InlineCode> prop to change the button
            style.
          </p>
          <CodeBlock code={variantsCode} title="variants.tsx" />
        </section>

        {/* Sizes */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Sizes</h3>
          <p className="text-white/60 mb-4">
            Use the <InlineCode>size</InlineCode> prop to change the button
            size. Available sizes: <InlineCode>sm</InlineCode>,{" "}
            <InlineCode>default</InlineCode>, <InlineCode>lg</InlineCode>,{" "}
            <InlineCode>icon</InlineCode>, <InlineCode>icon-sm</InlineCode>,{" "}
            <InlineCode>icon-lg</InlineCode>.
          </p>
          <CodeBlock code={sizesCode} title="sizes.tsx" />
        </section>

        {/* With Icons */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">With Icons</h3>
          <p className="text-white/60 mb-4">
            Add icons from <InlineCode>lucide-react</InlineCode> before or after
            the button text. Icons animate smoothly with the button state.
          </p>
          <CodeBlock code={withIconsCode} title="icons.tsx" />
        </section>

        {/* Loading State */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Loading State</h3>
          <p className="text-white/60 mb-4">
            The <InlineCode>loading</InlineCode> prop displays an animated
            spinner and automatically disables the button. When loading, any
            icons animate out smoothly.
          </p>
          <CodeBlock code={loadingCode} title="loading.tsx" />
        </section>

        {/* Custom Loader */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Custom Loader Icon</h3>
          <p className="text-white/60 mb-4">
            Use the <InlineCode>loaderIcon</InlineCode> prop to customize the
            loading spinner. Pass any Lucide icon component.
          </p>
          <CodeBlock code={customLoaderCode} title="custom-loader.tsx" />
        </section>

        {/* API Reference */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">API Reference</h3>
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/3">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">
                    Prop
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">
                    Type
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">
                    Default
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>loading</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">boolean</td>
                  <td className="px-4 py-3 text-sm text-white/50">false</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Shows loading spinner and disables button
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>loaderIcon</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">LucideIcon</td>
                  <td className="px-4 py-3 text-sm text-white/50">Loader2</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Custom loading spinner icon
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>variant</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">
                    &quot;default&quot; | &quot;secondary&quot; |
                    &quot;destructive&quot; | &quot;outline&quot; |
                    &quot;ghost&quot; | &quot;link&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">
                    &quot;default&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Visual style variant
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>size</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">
                    &quot;sm&quot; | &quot;default&quot; | &quot;lg&quot; |
                    &quot;icon&quot; | &quot;icon-sm&quot; | &quot;icon-lg&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">
                    &quot;default&quot;
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Button size
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>asChild</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">boolean</td>
                  <td className="px-4 py-3 text-sm text-white/50">false</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Merge props onto child element (Radix Slot)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">
                    <InlineCode>disabled</InlineCode>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">boolean</td>
                  <td className="px-4 py-3 text-sm text-white/50">false</td>
                  <td className="px-4 py-3 text-sm text-white/60">
                    Disables button interaction
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
