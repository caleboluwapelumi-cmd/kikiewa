/**
 * The skin-treatment note at the foot of a skin & aesthetics page, just
 * above the closing band (copy deck section 3, "Footer note"). Plain small
 * print under a hairline.
 */
export function SkinNote({ text }: { text: string }) {
  return (
    <div className="w-full border-t border-border bg-background">
      <div className="shell py-space-lg">
        <p className="max-w-[72ch] text-pretty text-body-sm text-muted">{text}</p>
      </div>
    </div>
  );
}
