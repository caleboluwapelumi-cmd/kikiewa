/**
 * Small print at the foot of a page, just above the closing band (the
 * aesthetics disclaimer). Plain small print under a hairline.
 */
export function PageNote({ text }: { text: string }) {
  return (
    <div className="w-full border-t border-border bg-background">
      <div className="shell py-space-lg">
        <p className="max-w-[72ch] text-pretty text-body-sm text-muted">{text}</p>
      </div>
    </div>
  );
}
