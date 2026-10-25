/**
 * Labelled form fields for /book and /contact. Each field links its hint
 * and error through aria-describedby and sets aria-invalid, so a screen
 * reader hears the label, the hint and the problem together. Errors are
 * always words, never colour alone.
 */

const controlBase =
  "w-full rounded-input border bg-card px-space-md text-body-md text-foreground transition-colors duration-200 placeholder:text-muted hover:border-primary focus-visible:border-primary";

export function controlClass(invalid: boolean): string {
  return [controlBase, invalid ? "border-error" : "border-border-strong"].join(" ");
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="flex items-start gap-space-sm text-body-sm font-semibold text-error">
      <span aria-hidden="true" className="mt-[0.55rem] inline-block h-px w-3 shrink-0 bg-error" />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  );
}

type FieldShellProps = {
  id: string;
  label: string;
  /** "optional", shown after the label. */
  optional?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

function FieldShell({ id, label, optional, hint, error, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-space-sm">
      <label htmlFor={id} className="text-title-md text-foreground">
        {label}
        {optional ? <span className="ml-space-sm text-body-sm font-normal text-muted">({optional})</span> : null}
      </label>
      {hint ? (
        <p id={id + "-hint"} className="-mt-space-xs text-body-sm text-muted">
          {hint}
        </p>
      ) : null}
      <FieldError id={id + "-error"}>{error}</FieldError>
      {children}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? id + "-hint" : "", error ? id + "-error" : ""].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type TextFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "value"> & {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  optional?: string;
  hint?: string;
  error?: string;
};

export function TextField({ id, label, value, onValueChange, optional, hint, error, className = "", ...rest }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={[controlClass(Boolean(error)), "h-12", className].join(" ")}
        {...rest}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "onChange" | "value"> & {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  optional?: string;
  hint?: string;
  error?: string;
};

export function TextAreaField({ id, label, value, onValueChange, optional, hint, error, ...rest }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        id={id}
        name={id}
        value={value}
        rows={4}
        onChange={(event) => onValueChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={[controlClass(Boolean(error)), "min-h-32 py-space-sm"].join(" ")}
        {...rest}
      />
    </FieldShell>
  );
}

/**
 * List of problems above a form, focused when the form is sent with
 * errors. Each item jumps to its field.
 */
export function ErrorSummary({
  title,
  errors,
  ref,
}: {
  title: string;
  /** [field id, message] in field order. */
  errors: [string, string][];
  ref?: React.Ref<HTMLDivElement>;
}) {
  if (errors.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
      className="rounded-input border border-error border-l-4 bg-card p-space-lg"
    >
      <h3 id="error-summary-title" className="font-body text-title-md text-error">
        {title}
      </h3>
      <ul className="mt-space-sm flex flex-col gap-space-xs">
        {errors.map(([id, message]) => (
          <li key={id}>
            <a
              href={"#" + id}
              onClick={(event) => {
                const field = document.getElementById(id);
                if (!field) return;
                event.preventDefault();
                field.focus();
                field.scrollIntoView({ block: "center" });
              }}
              className="text-body-md text-error underline underline-offset-4 hover:text-foreground"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
