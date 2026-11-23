import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CardStackDemo from "@/components/demos/card-stack/card-stack-demo";
import CardStackDecisions from "@/components/demos/card-stack/card-stack-decisions";
import CardStackGradients from "@/components/demos/card-stack/card-stack-gradients";

const demo = (file: string) => `components/demos/card-stack/${file}`;

const config: DocConfig = {
  title: "Card Stack",
  intro:
    "A swipeable card stack for React: drag the top card left or right (or use the buttons and arrow keys) and the cards behind spring forward to take its place. Loops or ends, reports every swipe with its direction, and works for testimonials, onboarding, voting and Tinder-style decks.",
  tags: ["Swipe to dismiss", "Buttons & arrow keys", "Loop or finite", "onSwipe callback", "Spring physics", "Reduced-motion crossfade"],
  hero: { Demo: CardStackDemo, file: demo("card-stack-demo.tsx"), minHeight: 420 },
  install: {
    registry: "card-stack",
    source: "components/dusk/card-stack/card-stack.tsx",
    deps: "motion lucide-react",
    note: (
      <>
        Cards are stacked in a CSS grid, so the stack takes the height of its tallest card plus the peek, and never
        jumps as cards change. Give your card content a fixed height for the tidiest stack.
      </>
    ),
  },
  usage: {
    filename: "deck.tsx",
    code: `"use client"

import { CardStack } from "@/components/dusk/card-stack/card-stack"

const people = [
  { name: "Ava", bio: "Designer" },
  { name: "Marcus", bio: "Founder" },
  { name: "Priya", bio: "Engineer" },
]

export function Deck() {
  return (
    <CardStack
      items={people}
      getKey={(p) => p.name}
      cardClassName="p-6"
      onSwipe={(direction, person) => console.log(direction, person.name)}
      renderItem={(p) => (
        <div className="h-40">
          <p className="text-lg font-semibold">{p.name}</p>
          <p className="text-sm text-muted-foreground">{p.bio}</p>
        </div>
      )}
    />
  )
}`,
  },
  examples: [
    {
      id: "finite",
      title: "Finite stack with callbacks",
      description: (
        <>
          With <Code>loop=&#123;false&#125;</Code> the stack ends and shows <Code>empty</Code>. <Code>onSwipe</Code>{" "}
          receives the direction and item, and <Code>labels</Code> renames the buttons. Change the stack&apos;s{" "}
          <Code>key</Code> to start over.
        </>
      ),
      Demo: CardStackDecisions,
      file: demo("card-stack-decisions.tsx"),
      minHeight: 360,
    },
    {
      id: "deep",
      title: "Deep stack without buttons",
      description: (
        <>
          <Code>visible</Code>, <Code>offset</Code> and <Code>scaleStep</Code> shape the pile. With{" "}
          <Code>controls=&#123;false&#125;</Code> it is swiped by drag or with the arrow keys once focused.
        </>
      ),
      Demo: CardStackGradients,
      file: demo("card-stack-gradients.tsx"),
      minHeight: 460,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. A drag past <Code>threshold</Code> or a fast flick counts as
        a swipe; anything less springs the card back.
      </>
    ),
    props: [
      { name: "items", type: "T[]", description: "The data for each card." },
      { name: "renderItem", type: "(item: T, index: number) => ReactNode", description: "Renders one card's content." },
      { name: "getKey", type: "(item: T, index: number) => Key", description: "Stable key for an item. Defaults to its index." },
      { name: "loop", type: "boolean", default: "true", description: "Start over after the last card." },
      { name: "visible", type: "number", default: "3", description: "How many cards are visible in the pile." },
      { name: "offset", type: "number", default: "14", description: "How far each card behind peeks out, in px." },
      { name: "scaleStep", type: "number", default: "0.05", description: "How much smaller each card behind is." },
      { name: "threshold", type: "number", default: "100", description: "Drag distance in px that counts as a swipe." },
      { name: "draggable", type: "boolean", default: "true", description: "Let people drag the top card away." },
      { name: "controls", type: "boolean", default: "true", description: "Show the swipe left / right buttons and the counter." },
      { name: "onSwipe", type: '(direction: "left" | "right", item: T, index: number) => void', description: "Called when a card leaves." },
      { name: "onEnd", type: "() => void", description: "Called after the last card when loop is off." },
      { name: "empty", type: "ReactNode", default: '"No more cards"', description: "Shown when a finite stack is done." },
      { name: "labels", type: "{ left?: string; right?: string }", description: "Accessible labels for the buttons." },
      { name: "label", type: "string", default: '"Card stack"', description: "Accessible name of the stack." },
      { name: "cardClassName", type: "string", description: "Classes for every card." },
    ],
  },
  accessibility: [
    "The stack is a focusable, labelled region: ArrowLeft and ArrowRight swipe the top card.",
    "The buttons have accessible labels and use aria-disabled when the stack is done, so focus is never lost.",
    <>Only the top card is exposed; cards behind it are <Code>inert</Code> and hidden from assistive tech.</>,
    'A polite live region announces "Card 2 of 5" after every swipe.',
    "With prefers-reduced-motion cards no longer fly or rotate: they simply crossfade.",
  ],
};

export function CardStackDocs() {
  return <ComponentDocs config={config} />;
}
