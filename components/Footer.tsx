import Link from "next/link";
import { footer, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface pt-space-xl pb-space-lg">
      <div className="shell">
        <div className="grid grid-cols-1 gap-gutter-desktop border-b border-border pb-space-xl md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-4">
            <span className="text-headline-sm uppercase tracking-widest text-primary">
              {site.name}
            </span>
            <p className="max-w-sm text-body-md text-muted">{footer.blurb}</p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <span className="border border-border bg-background px-space-sm py-space-xs text-label-sm uppercase text-secondary">
                {footer.licenceChip}
              </span>
            </div>
          </div>

          <nav aria-label="Divisions" className="flex flex-col gap-space-sm lg:col-span-3">
            <h2 className="mb-space-xs text-label-md uppercase text-primary">
              Divisions
            </h2>
            {footer.divisionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-md text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-space-sm lg:col-span-3">
            <h2 className="mb-space-xs text-label-md uppercase text-primary">
              Lagos Practices
            </h2>
            {footer.practices.map((practice) => (
              <div key={practice.name} className="flex flex-col gap-space-xs">
                <span className="text-title-md text-foreground">{practice.name}</span>
                <span className="text-body-sm text-muted">{practice.detail}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm lg:col-span-2">
            <h2 className="mb-space-xs text-label-md uppercase text-primary">
              Inquiries
            </h2>
            <span className="text-body-sm text-muted">{footer.inquiries.label}</span>
            <span className="text-body-md text-foreground">
              {footer.inquiries.email}
            </span>
            <span className="pt-space-xs text-body-sm text-muted">
              {footer.inquiries.hours}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-space-sm pt-space-md text-muted md:flex-row">
          <span className="text-body-sm">
            © {site.copyrightYear} {site.name} · {site.city}.
          </span>
          <nav aria-label="Legal" className="flex items-center gap-space-md text-body-sm">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
