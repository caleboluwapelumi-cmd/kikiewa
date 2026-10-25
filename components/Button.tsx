import Link from "next/link";
import { Icon } from "@/components/Icon";

/**
 * The one button for every call to action on the site.
 *
 * Pill shaped, at least 48px tall, Outfit 600 in sentence case. No arrows:
 * the only icon is WhatsApp's, on the left of the whatsapp variant.
 *
 * - primary: filled plum, cream text. The main action in a group.
 * - secondary: plum outline. The quieter action beside it.
 * - onDark: cream fill, plum text. The main action on plum or photography.
 * - whatsapp: outline with the WhatsApp icon on the left.
 *
 * secondary and whatsapp take `tone="dark"` on plum surfaces, where the
 * outline turns cream.
 *
 * With an `href` it renders a link (Next's Link, which also handles wa.me,
 * tel: and map links); without one, a native <button> for forms and steps.
 *
 * States: hover darkens, the shared focus ring from globals.css follows the
 * pill, pressing scales to 0.97, and disabled buttons fade and stop
 * responding. Transitions skip under prefers-reduced-motion.
 */

export type ButtonVariant = "primary" | "secondary" | "onDark" | "whatsapp";
export type ButtonTone = "light" | "dark";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-chip border px-7 py-3 text-center text-button transition-[background-color,border-color,color,transform] duration-200 ease-out-soft select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const outline: Record<ButtonTone, string> = {
  light: "border-primary text-primary hover:border-primary-hover hover:bg-primary/8 hover:text-primary-hover",
  dark: "border-on-primary/60 text-on-primary hover:border-on-primary hover:bg-on-primary/12",
};

function variantClass(variant: ButtonVariant, tone: ButtonTone): string {
  switch (variant) {
    case "primary":
      return "border-transparent bg-primary text-on-primary hover:bg-primary-hover";
    case "onDark":
      return "border-transparent bg-cream text-primary hover:bg-surface-3";
    case "secondary":
    case "whatsapp":
      return outline[tone];
  }
}

/** The same classes for anything that has to render its own element. */
export function buttonClass(variant: ButtonVariant = "primary", tone: ButtonTone = "light", className = ""): string {
  return [base, variantClass(variant, tone), className].filter(Boolean).join(" ");
}

type CommonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type NativeButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, variant = "primary", tone = "light", className = "" } = props;
  const classes = buttonClass(variant, tone, className);
  const content = (
    <>
      {variant === "whatsapp" ? <Icon name="whatsapp" className="size-5 shrink-0" /> : null}
      <span>{children}</span>
    </>
  );

  if (props.href !== undefined) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _children, variant: _variant, tone: _tone, className: _className, href: _href, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}

/**
 * A row of buttons with at least 12px between them. `stack` (heroes and the
 * closing band): full width and stacked on phones, side by side from sm.
 * Otherwise they sit at their natural width and wrap.
 */
export function ButtonGroup({
  children,
  stack = false,
  className = "",
}: {
  children: React.ReactNode;
  stack?: boolean;
  className?: string;
}) {
  return (
    <div
      className={[
        stack
          ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto"
          : "flex flex-wrap items-center gap-3",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
