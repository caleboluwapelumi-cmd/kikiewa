import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";

export type ButtonVariant = "primary" | "outline" | "quiet" | "subtle";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Sharp-cornered editorial button. Renders as a link — every action on the
 * home page navigates.
 */

const base =
  "group inline-flex items-center justify-center gap-space-sm rounded-xs text-label-md uppercase transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-sm",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-on-primary",
  // Underlined text action, used beside a primary button
  quiet:
    "text-primary underline decoration-secondary underline-offset-8 hover:text-secondary",
  // Low-contrast filled action on a light card
  subtle: "bg-surface text-primary hover:bg-surface-3",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-space-md py-space-sm",
  md: "px-6 py-3",
  lg: "px-8 py-4",
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
          ? "size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
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
        variant === "quiet" ? sizes[size].replace("px-8", "px-6") : sizes[size],
        className,
      ].join(" ")}
    >
      {icon && iconPosition === "leading" ? glyph : null}
      <span>{children}</span>
      {icon && iconPosition === "trailing" ? glyph : null}
    </Link>
  );
}
