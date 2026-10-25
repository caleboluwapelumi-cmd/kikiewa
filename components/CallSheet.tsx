"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CallSheetList } from "@/components/CallSheetList";
import { Icon } from "@/components/Icon";
import { callSheet } from "@/data/site";

/**
 * The mobile action bar's Call button and the sheet it opens: the main
 * line, then one row per location, each calling that number. A row whose
 * number is still TBC opens /contact instead.
 *
 * Built on a native modal <dialog>: it traps focus, closes on Escape,
 * returns focus to the Call button and makes the page behind inert. A tap
 * on the backdrop also closes it, and so does widening past md, where the
 * action bar is hidden.
 */
export function CallSheet({ className }: { className: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    if (!open) return;
    const wide = window.matchMedia("(min-width: 48rem)");
    const onChange = () => {
      if (wide.matches) dialogRef.current?.close();
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={show}
        className={className}
      >
        <Icon name="phone" className="size-5" />
        {callSheet.trigger}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // The dialog element itself only receives clicks on its backdrop.
          if (event.target === event.currentTarget) close();
        }}
        className="fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none border-t border-border bg-background p-0 text-foreground backdrop:bg-foreground/40"
      >
        <div className="pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between gap-space-md border-b border-border py-space-sm pr-space-xs pl-space-lg">
            <h2 id={titleId} className="text-headline-sm text-primary">
              {callSheet.title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={callSheet.close}
              className="flex size-11 items-center justify-center text-primary hover:text-secondary"
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <CallSheetList onNavigate={close} />
        </div>
      </dialog>
    </>
  );
}
