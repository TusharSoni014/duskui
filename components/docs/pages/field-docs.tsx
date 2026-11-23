import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FieldBasicDemo from "@/components/demos/field/field-basic";
import FieldChoiceCardDemo from "@/components/demos/field/field-choice-card";
import FieldFieldsetDemo from "@/components/demos/field/field-fieldset";
import AnimatedFieldErrorDemo from "@/components/demos/field/animated-field-error-demo";
import SignupFormDemo from "@/components/demos/field/signup-form-demo";

const demo = (file: string) => `components/demos/field/${file}`;
const block = (file: string) => `components/dusk/field/${file}`;

const config: DocConfig = {
  title: "Field",
  intro:
    "Accessible React form fields built on shadcn/ui: Field, FieldLabel, FieldDescription, FieldError, FieldSet and FieldGroup lay out labels, hints and validation errors for any input, with invalid and disabled states, horizontal and responsive layouts and selectable choice cards — plus Motion blocks for errors that grow open, fields that shake on a failed submit and a complete sign-up form validated without a form library.",
  tags: ["Drop-in shadcn API", "Works with any validation library", "Choice cards", "Responsive layout", "Motion blocks"],
  hero: { Demo: SignupFormDemo, file: demo("signup-form-demo.tsx"), minHeight: 460 },
  install: {
    registry: "field",
    source: "components/ui/field.tsx",
    deps: "class-variance-authority @radix-ui/react-label",
    note: (
      <>
        Adds <Code>components/ui/field.tsx</Code> and the DuskUI <Code>components/ui/label.tsx</Code> it builds on.
        Same parts and data-slot attributes as shadcn/ui, so existing forms keep working.
      </>
    ),
  },
  usage: {
    filename: "profile-form.tsx",
    code: `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function UsernameField({ error }: { error?: string }) {
  return (
    <Field data-invalid={!!error || undefined}>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input
        id="username"
        aria-invalid={!!error || undefined}
        aria-describedby="username-hint username-error"
      />
      <FieldDescription id="username-hint">Your public handle.</FieldDescription>
      <FieldError id="username-error">{error}</FieldError>
    </Field>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Label, description & error",
      description: (
        <>
          <Code>data-invalid</Code> eases the label to red while the hint stays readable; <Code>data-disabled</Code>{" "}
          dims label and hint together. <Code>FieldError</Code> renders nothing when empty and fades in when it
          appears.
        </>
      ),
      Demo: FieldBasicDemo,
      file: demo("field-basic.tsx"),
      minHeight: 360,
    },
    {
      id: "fieldset",
      title: "Fieldset, separator & orientation",
      description: (
        <>
          Group related controls in a <Code>FieldSet</Code> with a <Code>FieldLegend</Code>. Use{" "}
          <Code>orientation=&quot;horizontal&quot;</Code> for checkboxes and switches, and{" "}
          <Code>&quot;responsive&quot;</Code> to switch from stacked to a row once the <Code>FieldGroup</Code> is wide
          enough (a container query, not a viewport breakpoint).
        </>
      ),
      Demo: FieldFieldsetDemo,
      file: demo("field-fieldset.tsx"),
      minHeight: 460,
    },
    {
      id: "choice-card",
      title: "Choice cards",
      description: (
        <>
          Wrap a horizontal <Code>Field</Code> in a <Code>FieldLabel</Code> and the whole card becomes the hit area.
          Its border turns mint while its switch or checkbox is on.
        </>
      ),
      Demo: FieldChoiceCardDemo,
      file: demo("field-choice-card.tsx"),
      minHeight: 280,
    },
  ],
  blocks: [
    {
      id: "animated-field-error",
      title: "Animated Field Error",
      registry: "animated-field-error",
      source: block("animated-field-error.tsx"),
      deps: "motion",
      description: (
        <>
          <Code>AnimatedFieldError</Code> grows open and collapses shut so the form below glides, and cross-fades
          when the message changes. <Code>AnimatedField</Code> shakes once whenever its <Code>shakeKey</Code> changes
          while invalid — pass your submit counter. Submit the demo empty, then with a non-work email.
        </>
      ),
      Demo: AnimatedFieldErrorDemo,
      file: demo("animated-field-error-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "AnimatedField invalid", type: "boolean", default: "false", description: "Sets data-invalid on the Field." },
        {
          name: "AnimatedField shakeKey",
          type: "number | string",
          description: "Change it (e.g. a submit count) to shake once while invalid. Never shakes on mount.",
        },
        { name: "AnimatedFieldError id", type: "string", description: "Reference it from the control's aria-describedby." },
        { name: "AnimatedFieldError children", type: "ReactNode", description: "The message. Falsy collapses the error." },
        {
          name: "AnimatedFieldError className",
          type: "string",
          default: '"-mt-3"',
          description: "Wrapper classes. The negative margin cancels the Field's gap-3 while collapsed.",
        },
      ],
    },
    {
      id: "signup-form",
      title: "Sign-up Form",
      registry: "signup-form",
      source: block("signup-form.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          A complete form validated with plain React state: quiet until the first submit, then every invalid field
          shakes, focus jumps to the first problem and errors re-validate as you type. A successful submit swaps in a
          confirmation. <Code>validateSignup</Code> is exported — replace it with Zod or Valibot if you prefer.
        </>
      ),
      Demo: SignupFormDemo,
      file: demo("signup-form-demo.tsx"),
      minHeight: 460,
      props: [
        {
          name: "onSubmit",
          type: "(values: SignupValues) => void | Promise<void>",
          description: "Called with valid values. A promise keeps the button loading until it settles; a rejection returns to the form.",
        },
        { name: "submitLabel", type: "string", default: '"Create account"', description: "Submit button text." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Every part accepts the props of the element it renders. <Code>Field</Code> renders a{" "}
        <Code>div role=&quot;group&quot;</Code>; <Code>FieldLabel</Code> is the Radix-powered DuskUI Label.
      </>
    ),
    props: [
      {
        name: "Field orientation",
        type: '"vertical" | "horizontal" | "responsive"',
        default: '"vertical"',
        description: "Stacked, in a row, or a row once the parent FieldGroup is wider than 28rem.",
      },
      { name: "Field data-invalid", type: "boolean", description: "Tints the label red. Also set aria-invalid on the control." },
      { name: "Field data-disabled", type: "boolean", description: "Dims the label and description." },
      { name: "FieldLegend variant", type: '"legend" | "label"', default: '"legend"', description: "Heading or label-sized legend." },
      {
        name: "FieldError errors",
        type: "Array<{ message?: string } | undefined>",
        description: "Errors from a validation library. Deduplicated; several render as a list.",
      },
      { name: "FieldSeparator children", type: "ReactNode", description: "Optional text centered on the line." },
    ],
  },
  accessibility: [
    <>Link hints and errors to the control with <Code>id</Code> + <Code>aria-describedby</Code>, and set <Code>aria-invalid</Code> on the control itself — the Field only handles the visuals.</>,
    <><Code>FieldError</Code> and <Code>AnimatedFieldError</Code> use <Code>role=&quot;alert&quot;</Code>, so new messages are announced.</>,
    <><Code>FieldSet</Code> + <Code>FieldLegend</Code> render a native fieldset, so screen readers announce the group name before each control.</>,
    "The Sign-up Form moves focus to the first invalid field on submit and keeps the submit button focusable while loading.",
    "Shakes and height animations respect prefers-reduced-motion.",
  ],
};

export function FieldDocs() {
  return <ComponentDocs config={config} />;
}
