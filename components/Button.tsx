import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "quiet"
  | "subtle"
  | "inverse"
  | "inverseOutline";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Sharp-cornered editorial button. Renders as a link — every action on the
 * site navigates.
 *
 * States: colour shifts on hover, a 1px press on active, and the shared
 * focus ring from globals.css. Transitions are short and skipped entirely
 * under prefers-reduced-motion.
 */

const base =
  "group inline-flex items-center justify-center gap-space-sm rounded-xs text-label-md uppercase whitespace-nowrap transition-[color,background-color,border-color,text-decoration-color,transform] duration-200 ease-out-soft active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-on-primary",
  // Underlined text action, used beside a primary button. No side padding,
  // so it lines up with the text column when the buttons wrap.
  quiet:
    "text-primary underline decoration-border-strong decoration-1 underline-offset-8 hover:text-secondary hover:decoration-secondary",
  // Hairline secondary action on a light surface
  subtle:
    "border border-border-strong text-primary hover:border-primary hover:bg-surface",
  // Solid light action on a plum surface
  inverse: "bg-on-primary text-primary hover:bg-surface",
  // Hairline secondary action on a plum surface
  inverseOutline:
    "border border-on-primary/40 text-on-primary hover:border-on-primary hover:bg-on-primary/10",
};

// Heights keep every action at or above a 44px touch target.
const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-5",
  md: "h-12 px-6",
  lg: "h-14 px-8",
};

const quietSizes: Record<ButtonSize, string> = {
  sm: "h-11",
  md: "h-12",
  lg: "h-14",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: "leading" | "trailing";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "trailing",
  className = "",
}: ButtonProps) {
  const glyph = icon ? (
    <Icon
      name={icon}
      className={
        iconPosition === "trailing"
          ? "size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
          : "size-4 shrink-0"
      }
    />
  ) : null;

  return (
    <Link
      href={href}
      className={[
        base,
        variants[variant],
        variant === "quiet" ? quietSizes[size] : sizes[size],
        className,
      ].join(" ")}
    >
      {icon && iconPosition === "leading" ? glyph : null}
      <span>{children}</span>
      {icon && iconPosition === "trailing" ? glyph : null}
    </Link>
  );
}
