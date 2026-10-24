/**
 * Inline icon set.
 *
 * The Stitch export used the hosted Material Symbols font; drawing the few
 * glyphs we need inline keeps the page free of third-party font requests and
 * keeps stroke weight consistent with the rest of the design.
 */

export type IconName =
  | "arrowRight"
  | "badge"
  | "book"
  | "brush"
  | "calendar"
  | "chevronDown"
  | "close"
  | "clock"
  | "compass"
  | "download"
  | "face"
  | "hand"
  | "home"
  | "hospital"
  | "medical"
  | "menu"
  | "notes"
  | "phone"
  | "pin"
  | "sanitizer"
  | "school"
  | "scissors"
  | "shield"
  | "sparkle"
  | "spa"
  | "syringe"
  | "verified"
  | "whatsapp";

const paths: Record<IconName, React.ReactNode> = {
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  badge: (
    <>
      <rect x="4" y="4" width="16" height="12" rx="1" />
      <path d="M9 9h6M9 12h4" />
      <path d="m8 16-1 4 5-2 5 2-1-4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h5v17H6a2 2 0 0 0-2 2z" />
      <path d="M20 5a2 2 0 0 0-2-2h-5v17h5a2 2 0 0 1 2 2z" />
    </>
  ),
  brush: (
    <>
      <path d="M15 3 21 9 11 19H5v-6z" />
      <path d="m13 5 6 6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 20h16" />
    </>
  ),
  face: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="7" />
      <path d="M9.5 10h.01M14.5 10h.01" />
      <path d="M10 15h4" />
    </>
  ),
  hand: (
    <>
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-1.5a1.5 1.5 0 0 1 3 0V14" />
      <path d="M9.5 3.5a1.5 1.5 0 0 1 3 0" />
    </>
  ),
  home: (
    <>
      <path d="M4 10 12 3l8 7" />
      <path d="M6 9v11h12V9" />
      <circle cx="12" cy="13" r="2" />
    </>
  ),
  hospital: (
    <>
      <path d="M5 21V8l7-5 7 5v13" />
      <path d="M12 9v6M9 12h6" />
    </>
  ),
  medical: (
    <>
      <path d="M8 3v5a4 4 0 0 0 8 0V3" />
      <path d="M6 3h4M14 3h4" />
      <path d="M12 12v3a4 4 0 0 0 7 2.5" />
      <circle cx="19" cy="18" r="2" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  notes: (
    <>
      <path d="M5 3h10l4 4v14H5z" />
      <path d="M15 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  sanitizer: (
    <>
      <path d="M9 7h6a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3" />
      <path d="M10 7V4h4v3" />
      <path d="M16 3h4M18 1v4" />
      <path d="M10 13h4" />
    </>
  ),
  school: (
    <>
      <path d="M12 4 2 9l10 5 10-5z" />
      <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7.8 16.2 19 4M16.2 16.2 5 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sparkle: (
    <path d="M12 3 13.9 9.1 20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z" />
  ),
  spa: (
    <>
      <path d="M12 21c0-5 3.5-9 9-9 0 5-3.5 9-9 9" />
      <path d="M12 21c0-5-3.5-9-9-9 0 5 3.5 9 9 9" />
      <path d="M12 21c-2-4-2-8 0-12 2 4 2 8 0 12" />
    </>
  ),
  syringe: (
    <>
      <path d="M9 3h6" />
      <path d="M12 3v3" />
      <path d="M8 6h8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
      <path d="M12 17v4" />
      <path d="M10 9h4M10 12h4" />
    </>
  ),
  verified: (
    <>
      <path d="m12 3 2.2 2.1 3-.4.6 3 2.6 1.5-1.4 2.7 1.4 2.7-2.6 1.5-.6 3-3-.4L12 21l-2.2-2.1-3 .4-.6-3L3.6 12.8 5 10.1 3.6 7.4l2.6-1.5.6-3 3 .4z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // Chat bubble with a handset: reads as WhatsApp without using its logo
  whatsapp: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" />
      <path d="M9.2 8.6c.2-.3.5-.4.8-.3l.9 1.6c.1.2 0 .5-.1.7l-.5.6a5.5 5.5 0 0 0 2.6 2.6l.6-.5c.2-.1.5-.2.7-.1l1.6.9c.1.3 0 .6-.3.8a2.4 2.4 0 0 1-2.4.4 7.6 7.6 0 0 1-4.3-4.3 2.4 2.4 0 0 1 .4-2.4z" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
