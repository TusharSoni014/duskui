"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * DuskUI Field — a drop-in upgrade of the shadcn/ui Field.
 *
 * Same parts, props and data-slot attributes as shadcn (Field, FieldLabel,
 * FieldDescription, FieldError, FieldGroup, FieldSet, FieldLegend,
 * FieldSeparator, FieldContent, FieldTitle) plus:
 * - `data-invalid` on a Field eases the label to red; the description stays
 *   readable instead of turning red too.
 * - `data-disabled` dims the label and description together.
 * - FieldError fades and slides in when it mounts, and accepts the
 *   `errors` array from any validation library (deduplicated by message).
 * - Choice cards (a FieldLabel wrapping a horizontal Field) get a hover
 *   border and a mint glow when their checkbox, radio or switch is on.
 * - `orientation`: vertical, horizontal or responsive (switches to a row
 *   once the FieldGroup is wider than 28rem, via a container query).
 * CSS only — no animation library. Pair it with the Animated Field Error
 * block for height animations and a shake on submit.
 */

/** A `<fieldset>` that groups related fields, e.g. an address or a set of checkboxes. */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex min-w-0 flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        "disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

/** The fieldset caption. `variant="label"` makes it the size of a field label. */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn("mb-3 font-medium", "data-[variant=legend]:text-base", "data-[variant=label]:text-sm", className)}
      {...props}
    />
  );
}

/** Stacks fields with consistent spacing. Also the container for `orientation="responsive"`. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7",
        "data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  );
}

const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
      horizontal: [
        "flex-row items-center",
        "[&>[data-slot=field-label]]:flex-auto",
        "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ],
      responsive: [
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
        "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
        "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ],
    },
  },
  defaultVariants: { orientation: "vertical" },
});

/**
 * One form control with its label, description and error. Set
 * `data-invalid` / `data-disabled` to style the whole field.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

/** Wraps a label and description next to a checkbox, radio or switch in a horizontal Field. */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", className)}
      {...props}
    />
  );
}

/** A Label wired for fields. Wrap a whole horizontal Field in it to make a selectable choice card. */
function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug",
        "group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive",
        // Choice card: a label that wraps a Field.
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-[>[data-slot=field]]:cursor-pointer has-[>[data-slot=field]]:transition-[border-color,background-color,box-shadow] has-[>[data-slot=field]]:duration-200 has-[>[data-slot=field]]:hover:border-ring/40",
        "has-data-[state=checked]:border-primary/70 has-data-[state=checked]:bg-primary/[0.06] has-data-[state=checked]:shadow-[0_0_24px_-12px_var(--color-primary)]",
        "has-focus-visible:has-[>[data-slot=field]]:ring-[3px] has-focus-visible:has-[>[data-slot=field]]:ring-ring/30",
        className
      )}
      {...props}
    />
  );
}

/** A label-styled heading for fields that don't have a single control to label (use inside FieldContent). */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  );
}

/** Helper text. Link it to the control with `id` + `aria-describedby`. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance",
        "transition-opacity duration-200 group-data-[disabled=true]/field:opacity-50",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/** A divider between field groups, with optional centered text (e.g. "Or continue with"). */
function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div"> & { children?: React.ReactNode }) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2", className)}
      {...props}
    >
      <div aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-border" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * The field's error message. Renders nothing when empty. Pass `children`, or
 * the `errors` array from a validation library (`{ message?: string }[]`).
 * Link it to the control with `id` + `aria-describedby`.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & { errors?: Array<{ message?: string } | undefined> }) {
  const content = React.useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;
    const unique = [...new Map(errors.map((error) => [error?.message, error])).values()].filter(
      (error) => error?.message
    );
    if (unique.length === 0) return null;
    if (unique.length === 1) return unique[0]?.message;
    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {unique.map((error, index) => (
          <li key={index}>{error?.message}</li>
        ))}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        "text-sm font-normal text-destructive",
        "animate-in fade-in-0 slide-in-from-top-1 duration-200 ease-out motion-reduce:slide-in-from-top-0",
        className
      )}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
