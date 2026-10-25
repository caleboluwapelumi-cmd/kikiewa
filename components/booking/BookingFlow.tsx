"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { ChoiceGroup, choiceId, type Choice } from "@/components/form/ChoiceGroup";
import { ErrorSummary, TextAreaField, TextField } from "@/components/form/Field";
import { Icon } from "@/components/Icon";
import {
  bookPage,
  contactHref,
  locations,
  serviceCategories,
  servicePage,
  type LocationId,
} from "@/data/site";
import { formatTime } from "@/lib/format";
import {
  bookingDates,
  isSlotOffered,
  longDate,
  preferredSlots,
  shortDateParts,
  usesExampleTimes,
} from "@/lib/booking/availability";
import { useBookingDraft } from "@/lib/booking/draft";
import { bookableItems, resolveService, type ServiceChoice } from "@/lib/booking/services";
import { submitBooking } from "@/lib/booking/submit";
import type { BookingDetails, BookingRequest, BookingStep, BookingStepNumber } from "@/lib/booking/types";
import { formatNigerianPhone, isValidEmail, normaliseNigerianPhone, type FieldErrors } from "@/lib/validation";

/**
 * /book (site plan, section 7): five steps, then a confirmation screen.
 *
 * - The choices (service, location, date, time) and the step live in the
 *   URL, so refresh, back and forward all work and a link can preselect a
 *   service or a location (?service=facials, ?location=ebute). Selections
 *   replace the history entry; moving between steps pushes one.
 * - Personal details live in sessionStorage (lib/booking/draft.ts), never
 *   in the URL.
 * - A step can't be reached until the ones before it are complete: a URL
 *   that skips ahead lands on the first incomplete step.
 * - Focus moves to each step's heading, and to the error summary when a
 *   step is sent with problems.
 * - Sending opens WhatsApp to that location (lib/booking/submit.ts).
 * - On phones the Continue and Back buttons stick to the bottom of the
 *   screen while the step is in view (the floating action bar is hidden on
 *   /book, so nothing covers them).
 */

const STEP_COUNT = 5;
const t = bookPage;

type UrlKey = "service" | "location" | "date" | "time" | "step";

function parseStep(raw: string | null): BookingStep {
  if (raw === "sent") return "sent";
  const value = Number(raw);
  return value >= 1 && value <= STEP_COUNT ? (value as BookingStepNumber) : 1;
}

/** Updates the URL through the History API (Next keeps useSearchParams in sync). */
function updateUrl(patch: Partial<Record<UrlKey, string | null>>, mode: "push" | "replace") {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  const query = params.toString();
  const url = query ? "?" + query : window.location.pathname;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

function validateDetails(details: BookingDetails): FieldErrors {
  const errors: FieldErrors = {};
  if (!details.name.trim()) errors.name = t.errors.name;
  if (!details.phone.trim()) errors.phone = t.errors.phoneRequired;
  else if (!normaliseNigerianPhone(details.phone)) errors.phone = t.errors.phoneInvalid;
  if (details.email.trim() && !isValidEmail(details.email)) errors.email = t.errors.email;
  return errors;
}

function serviceLabel(choice: ServiceChoice): string {
  return choice.item ? `${choice.category.name}: ${choice.item.name}` : `${choice.category.name} (${t.service.notSure.toLowerCase()})`;
}

function dayName(offset: number, iso: string): string {
  if (offset === 0) return t.dateTime.today;
  if (offset === 1) return t.dateTime.tomorrow;
  return shortDateParts(iso).day;
}

export function BookingFlow() {
  const searchParams = useSearchParams();
  const [details, updateDetails, clearDetails, ready] = useBookingDraft();
  // Read once: the date list stays stable while the form is open.
  const [now] = useState(() => new Date());
  const [errorState, setErrorState] = useState<{ step: BookingStep; errors: FieldErrors }>({ step: 1, errors: {} });
  const [consent, setConsent] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Current choices, from the URL
  const service = resolveService(searchParams.get("service"));
  const location = locations.find((entry) => entry.id === searchParams.get("location"));
  const date = searchParams.get("date") ?? undefined;
  const time = searchParams.get("time") ?? undefined;
  const slotOffered = Boolean(location && date && time && isSlotOffered(location, date, time, now));
  const detailErrors = validateDetails(details);

  const firstIncomplete: BookingStepNumber = !service
    ? 1
    : !location
      ? 2
      : !slotOffered
        ? 3
        : Object.keys(detailErrors).length
          ? 4
          : 5;

  const requested = parseStep(searchParams.get("step"));
  const step: BookingStep =
    requested === "sent"
      ? firstIncomplete === 5
        ? "sent"
        : firstIncomplete
      : (Math.min(requested, firstIncomplete) as BookingStepNumber);

  const errors = errorState.step === step ? errorState.errors : {};

  // Move focus to the new step's heading whenever the step changes after
  // the first render (Continue, Back, the progress links, browser back).
  const shownStep = useRef<BookingStep | null>(null);
  useEffect(() => {
    if (!ready) return;
    if (shownStep.current !== null && shownStep.current !== step) {
      const heading = headingRef.current;
      if (heading) {
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "start" });
      }
    }
    shownStep.current = step;
  }, [step, ready]);

  if (!ready) return <BookingLoading />;

  function goTo(next: BookingStep) {
    setErrorState({ step: next, errors: {} });
    updateUrl({ step: next === 1 ? null : String(next) }, "push");
  }

  function fail(found: FieldErrors) {
    setErrorState({ step, errors: found });
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  function clearError(key: string) {
    if (!errors[key]) return;
    const rest = { ...errors };
    delete rest[key];
    setErrorState({ step, errors: rest });
  }

  function handleContinue(event: React.FormEvent) {
    event.preventDefault();
    if (step === 1 && !service) return fail({ service: t.errors.service });
    if (step === 2 && !location) return fail({ location: t.errors.location });
    if (step === 3) {
      const found: FieldErrors = {};
      if (!date || !location || !bookingDates(location, now).some((entry) => entry.iso === date)) {
        found.date = t.errors.date;
      } else if (!slotOffered) {
        found.time = t.errors.time;
      }
      if (Object.keys(found).length) return fail(found);
    }
    if (step === 4 && Object.keys(detailErrors).length) return fail(detailErrors);
    if (typeof step === "number" && step < STEP_COUNT) goTo((step + 1) as BookingStepNumber);
  }

  function buildRequest(): BookingRequest | null {
    if (!service || !location || !date || !time) return null;
    const phone = normaliseNigerianPhone(details.phone);
    if (!phone) return null;
    return {
      serviceSlug: service.slug,
      locationId: location.id,
      preferredDate: date,
      preferredTime: time,
      customer: {
        name: details.name.trim(),
        phone,
        email: details.email.trim() || undefined,
        notes: details.notes.trim() || undefined,
      },
      consent: true,
      consentedAt: new Date().toISOString(),
    };
  }

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!consent) return fail({ consent: t.errors.consent });
    const request = buildRequest();
    if (!request) return;
    const result = submitBooking(request);
    // Opened straight from the click, so pop-up blockers allow it. The
    // confirmation screen links to it again in case it didn't open.
    if (result.method === "whatsapp") window.open(result.href, "_blank", "noopener,noreferrer");
    goTo("sent");
  }

  function startAgain() {
    clearDetails();
    setConsent(false);
    setErrorState({ step: 1, errors: {} });
    window.history.pushState(null, "", window.location.pathname);
  }

  const errorList = Object.entries(errors).flatMap(([key, message]) => {
    if (!message) return [];
    const target: Record<string, string> = {
      service: service ? choiceId("treatment", service.slug) : choiceId("category", serviceCategories[0].slug),
      location: choiceId("location", locations[0].id),
      date: location ? choiceId("date", bookingDates(location, now)[0]?.iso ?? "") : "",
      time: location && date ? choiceId("time", preferredSlots(location, date, now)[0] ?? "") : "",
      name: "name",
      phone: "phone",
      email: "email",
      consent: "consent",
    };
    if (key === "service" && !service) target.service = choiceId("category", serviceCategories[0].slug);
    return [[target[key] ?? key, message] as [string, string]];
  });

  const stepHeading = (title: string) => (
    <div className="mb-space-xl flex flex-col gap-space-sm">
      {typeof step === "number" ? (
        <p className="text-label-sm uppercase text-secondary">
          {t.stepWord} {step} {t.ofWord} {STEP_COUNT}
        </p>
      ) : null}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-headline-lg text-primary focus:outline-none"
      >
        {title}
      </h2>
    </div>
  );

  const actions = (continueLabel: string = t.continue) => (
    <div className="sticky bottom-0 z-10 -mx-space-lg mt-space-xl -mb-space-lg flex items-center gap-3 rounded-b-card border-t border-border bg-card/95 px-space-lg pt-space-md pb-[calc(var(--spacing-space-md)+env(safe-area-inset-bottom))] backdrop-blur-md md:static md:mx-0 md:mb-0 md:flex-wrap md:rounded-none md:bg-transparent md:px-0 md:pt-space-lg md:pb-0 md:backdrop-blur-none">
      <Button type="submit" className="flex-1 md:flex-none">
        {continueLabel}
      </Button>
      {typeof step === "number" && step > 1 ? (
        <Button variant="secondary" onClick={() => goTo((step - 1) as BookingStepNumber)}>
          {t.back}
        </Button>
      ) : null}
    </div>
  );

  const summary = (
    <ErrorSummary ref={summaryRef} title={t.errors.summary} errors={errorList} />
  );

  /* Step bodies ------------------------------------------------------- */

  let body: React.ReactNode;

  if (step === 1) {
    const category = service?.category;
    const categoryChoices: Choice[] = serviceCategories.map((entry) => ({
      value: entry.slug,
      label: entry.name,
      description: entry.cardLine,
      icon: <Icon name={entry.icon} className="size-5" />,
    }));
    const items = category && !category.consultationLed ? bookableItems(category) : [];
    const treatmentChoices: Choice[] = category
      ? [
          ...items.map((item) => ({
            value: item.slug,
            label: item.name,
            description: item.summary,
            tag: item.confirmed ? undefined : servicePage.suggestedTag,
          })),
          { value: category.slug, label: t.service.notSure, description: t.service.notSureHint },
        ]
      : [];

    body = (
      <form noValidate onSubmit={handleContinue}>
        {stepHeading(t.steps[0].heading)}
        <div className="flex flex-col gap-space-xl">
          {summary}
          <ChoiceGroup
            name="category"
            legend={t.service.categoryLegend}
            legendHidden
            choices={categoryChoices}
            value={category?.slug}
            onChange={(value) => {
              clearError("service");
              updateUrl({ service: value }, "replace");
            }}
            error={errors.service}
          />
          {category?.consultationLed && service?.item ? (
            <div className="flex flex-col gap-space-sm border-l-2 border-accent bg-surface px-space-lg py-space-md">
              <p className="text-title-md text-primary">{service.item.name}</p>
              <p className="text-body-md text-foreground">{t.service.consultationNote}</p>
            </div>
          ) : null}
          {category && !category.consultationLed ? (
            items.length ? (
              <ChoiceGroup
                name="treatment"
                legend={t.service.treatmentLegend}
                choices={treatmentChoices}
                value={service?.slug}
                onChange={(value) => updateUrl({ service: value }, "replace")}
              />
            ) : (
              <p className="border-l-2 border-accent pl-space-md text-body-md text-muted">{t.service.menuComing}</p>
            )
          ) : null}
        </div>
        {actions()}
      </form>
    );
  } else if (step === 2) {
    body = (
      <form noValidate onSubmit={handleContinue}>
        {stepHeading(t.steps[1].heading)}
        <div className="flex flex-col gap-space-xl">
          {summary}
          <ChoiceGroup
            name="location"
            legend={t.location.legend}
            legendHidden
            hint={t.location.hint}
            choices={locations.map((entry) => ({
              value: entry.id,
              label: entry.title,
              description: (
                <span className="flex flex-col gap-space-xs">
                  <span>{entry.area}</span>
                  <Confirmable value={entry.address} />
                </span>
              ),
              icon: <Icon name="pin" className="size-5" />,
            }))}
            value={location?.id}
            onChange={(value) => {
              clearError("location");
              updateUrl({ location: value as LocationId }, "replace");
            }}
            error={errors.location}
          />
        </div>
        {actions()}
      </form>
    );
  } else if (step === 3 && location) {
    const dates = bookingDates(location, now);
    const dateValid = Boolean(date && dates.some((entry) => entry.iso === date));
    const slots = date && dateValid ? preferredSlots(location, date, now) : [];
    body = (
      <form noValidate onSubmit={handleContinue}>
        {stepHeading(t.steps[2].heading)}
        <div className="flex flex-col gap-space-xl">
          <p className="max-w-[60ch] text-body-md text-muted">{t.dateTime.hint}</p>
          {usesExampleTimes(location) ? (
            <p className="w-fit rounded-chip border border-dashed border-border-strong px-space-md py-space-sm text-label-sm uppercase text-muted">
              {t.dateTime.exampleTimes}
            </p>
          ) : null}
          {summary}
          <ChoiceGroup
            name="date"
            legend={t.dateTime.dateLegend}
            compact
            columns="grid-cols-3 sm:grid-cols-4 lg:grid-cols-7"
            choices={dates.map((entry) => ({
              value: entry.iso,
              label: dayName(entry.offset, entry.iso),
              description: shortDateParts(entry.iso).date,
            }))}
            value={dateValid ? date : undefined}
            onChange={(value) => {
              clearError("date");
              const keepTime = time && preferredSlots(location, value, now).includes(time);
              updateUrl({ date: value, time: keepTime ? time : null }, "replace");
            }}
            error={errors.date}
          />
          {date && dateValid ? (
            slots.length ? (
              <ChoiceGroup
                name="time"
                legend={t.dateTime.timeLegend}
                compact
                columns="grid-cols-3 sm:grid-cols-4"
                choices={slots.map((slot) => ({ value: slot, label: formatTime(slot) }))}
                value={slotOffered ? time : undefined}
                onChange={(value) => {
                  clearError("time");
                  updateUrl({ time: value }, "replace");
                }}
                error={errors.time}
              />
            ) : (
              <p className="text-body-md text-muted">{t.dateTime.noTimes}</p>
            )
          ) : (
            <p className="text-body-md text-muted">{t.dateTime.chooseDateFirst}</p>
          )}
        </div>
        {actions()}
      </form>
    );
  } else if (step === 4) {
    body = (
      <form noValidate onSubmit={handleContinue}>
        {stepHeading(t.steps[3].heading)}
        <div className="flex max-w-xl flex-col gap-space-lg">
          {summary}
          <TextField
            id="name"
            label={t.details.name}
            value={details.name}
            onValueChange={(name) => {
              updateDetails({ name });
              clearError("name");
            }}
            autoComplete="name"
            maxLength={80}
            error={errors.name}
          />
          <TextField
            id="phone"
            label={t.details.phone}
            hint={t.details.phoneHint}
            value={details.phone}
            onValueChange={(phone) => {
              updateDetails({ phone });
              clearError("phone");
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            error={errors.phone}
          />
          <TextField
            id="email"
            label={t.details.email}
            optional={t.details.optional}
            value={details.email}
            onValueChange={(email) => {
              updateDetails({ email });
              clearError("email");
            }}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            error={errors.email}
          />
          <TextAreaField
            id="notes"
            label={t.details.notes}
            optional={t.details.optional}
            hint={t.details.notesHint}
            value={details.notes}
            onValueChange={(notes) => updateDetails({ notes })}
            maxLength={500}
          />
          <p className="text-body-sm text-muted">{t.details.privacyNote}</p>
        </div>
        {actions()}
      </form>
    );
  } else if (step === 5 && service && location && date && time) {
    const phone = normaliseNigerianPhone(details.phone);
    const rows: { label: string; value: React.ReactNode; edit: BookingStepNumber }[] = [
      { label: t.review.service, value: serviceLabel(service), edit: 1 },
      { label: t.review.location, value: location.title, edit: 2 },
      { label: t.review.dateTime, value: `${longDate(date)}, ${formatTime(time)}`, edit: 3 },
      { label: t.review.name, value: details.name.trim(), edit: 4 },
      { label: t.review.phone, value: phone ? formatNigerianPhone(phone) : details.phone, edit: 4 },
      ...(details.email.trim() ? [{ label: t.review.email, value: details.email.trim(), edit: 4 as const }] : []),
      ...(details.notes.trim() ? [{ label: t.review.notes, value: details.notes.trim(), edit: 4 as const }] : []),
    ];
    body = (
      <form noValidate onSubmit={handleSend}>
        {stepHeading(t.steps[4].heading)}
        <div className="flex flex-col gap-space-xl">
          {summary}
          {service.consultation ? (
            <p className="border-l-2 border-accent pl-space-md text-body-md text-foreground">{t.service.consultationNote}</p>
          ) : null}
          <dl className="divide-y divide-border border-y border-border-strong">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-1 gap-space-xs py-space-md sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-space-md">
                <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
                <dd className="text-body-md break-words whitespace-pre-line text-foreground">{row.value}</dd>
                <dd>
                  <button
                    type="button"
                    onClick={() => goTo(row.edit)}
                    className="inline-flex min-h-12 items-center text-body-sm font-semibold text-primary underline decoration-border-strong underline-offset-4 transition-colors duration-200 hover:text-secondary hover:decoration-secondary"
                  >
                    {t.change}
                    <span className="sr-only"> {row.label.toLowerCase()}</span>
                  </button>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-space-sm">
            {errors.consent ? (
              <p id="consent-error" className="text-body-sm font-semibold text-error">
                <span className="sr-only">Error: </span>
                {errors.consent}
              </p>
            ) : null}
            <label
              htmlFor="consent"
              className={[
                "flex cursor-pointer items-start gap-space-md rounded-input border bg-card p-space-md has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-secondary",
                errors.consent ? "border-error" : "border-border-strong",
              ].join(" ")}
            >
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                  clearError("consent");
                }}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-0.5 size-5 shrink-0 accent-primary"
              />
              <span className="text-body-md text-foreground">{t.review.consent}</span>
            </label>
            <p className="text-body-sm text-muted">
              {t.review.policiesBefore}
              <Link href="/booking-policy" className="text-primary underline underline-offset-4 hover:text-secondary">
                {t.review.bookingPolicy}
              </Link>
              {t.review.policiesAnd}
              <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-secondary">
                {t.review.privacy}
              </Link>
              {t.review.policiesAfter}
            </p>
          </div>
          <p className="text-body-sm text-muted">{t.review.sendNote}</p>
        </div>
        {actions(t.review.send)}
      </form>
    );
  } else if (step === "sent" && service && location && date && time) {
    const request = buildRequest();
    const result = request ? submitBooking(request) : null;
    const whatsapp = result?.method === "whatsapp";
    body = (
      <div>
        {stepHeading(whatsapp ? t.sent.heading : t.sent.fallbackHeading)}
        <div className="flex flex-col gap-space-xl">
          <p className="max-w-[60ch] text-pretty text-body-lg text-muted">{whatsapp ? t.sent.body : t.sent.fallbackBody}</p>
          {result ? (
            <div className="rounded-card border border-border bg-surface p-space-lg">
              <p className="mb-space-sm text-label-sm uppercase text-muted">{t.review.summaryHeading}</p>
              <p className="text-body-md break-words whitespace-pre-line text-foreground">{result.message}</p>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            {result && whatsapp ? (
              <Button href={result.href} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                {t.sent.reopen}
              </Button>
            ) : (
              <Button href={contactHref}>{t.sent.fallbackCta}</Button>
            )}
            <Button variant="secondary" onClick={startAgain}>
              {t.sent.another}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:gap-gutter-desktop">
      <div className="flex flex-col gap-space-xl lg:col-span-8">
        {step === "sent" ? null : <Progress step={step} onGo={goTo} />}
        <div className="rounded-card border border-border bg-card p-space-lg md:p-10 lg:p-12">{body}</div>
      </div>
      {step === "sent" || step === 5 ? null : (
        <aside aria-label={t.review.summaryHeading} className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[calc(var(--spacing-header-desktop)+1.5rem)] border-t border-border-strong pt-space-md">
            <p className="mb-space-md text-label-sm uppercase text-secondary">{t.review.summaryHeading}</p>
            <dl className="flex flex-col gap-space-md">
              {[
                { label: t.review.service, value: service ? serviceLabel(service) : null },
                { label: t.review.location, value: location?.title ?? null },
                {
                  label: t.review.dateTime,
                  value: date && slotOffered && time ? `${longDate(date)}, ${formatTime(time)}` : null,
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-space-xs">
                  <dt className="text-label-sm uppercase text-muted">{row.label}</dt>
                  <dd className={row.value ? "text-body-md text-foreground" : "text-body-md text-muted"}>
                    {row.value ?? t.review.notChosen}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      )}
    </div>
  );
}

/** Progress: five labelled steps; finished ones link back. */
function Progress({ step, onGo }: { step: BookingStepNumber; onGo: (step: BookingStepNumber) => void }) {
  return (
    <nav aria-label={t.progressLabel}>
      {/* Small screens: one line and a segmented bar */}
      <div className="md:hidden">
        <p className="text-label-sm uppercase text-muted">
          {t.stepWord} {step} {t.ofWord} {STEP_COUNT}: <span className="text-primary">{t.steps[step - 1].short}</span>
        </p>
        <div aria-hidden="true" className="mt-space-sm grid grid-cols-5 gap-1">
          {t.steps.map((entry, index) => (
            <span key={entry.short} className={["h-1 rounded-full", index < step ? "bg-primary" : "bg-border-strong"].join(" ")} />
          ))}
        </div>
      </div>
      <ol className="hidden grid-cols-5 border-t border-border-strong md:grid">
        {t.steps.map((entry, index) => {
          const number = (index + 1) as BookingStepNumber;
          const done = number < step;
          const current = number === step;
          const content = (
            <>
              <span
                aria-hidden="true"
                className={[
                  "grid size-7 place-items-center rounded-full text-label-sm tabular-nums",
                  current ? "bg-primary text-on-primary" : done ? "bg-surface-warm text-primary" : "border border-border-strong text-muted",
                ].join(" ")}
              >
                {done ? <Icon name="verified" className="size-3.5" /> : number}
              </span>
              <span className={["text-label-sm uppercase", current ? "text-primary" : done ? "text-foreground" : "text-muted"].join(" ")}>
                {entry.short}
                {done ? <span className="sr-only">, {t.completed}</span> : null}
              </span>
            </>
          );
          return (
            <li
              key={entry.short}
              aria-current={current ? "step" : undefined}
              className={["relative -mt-px border-t-2 pt-space-md", current || done ? "border-primary" : "border-transparent"].join(" ")}
            >
              {done ? (
                <button type="button" onClick={() => onGo(number)} className="flex min-h-12 items-center gap-space-sm text-left hover:text-secondary">
                  {content}
                </button>
              ) : (
                <span className="flex min-h-12 items-center gap-space-sm">{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Shown before the form loads, and inside the page's Suspense fallback.
 * It holds the room of the step 1 form (886px at its shortest, 1440px wide)
 * so the swap doesn't push the call section down: that section starts below
 * the fold on phones and desktops, so no visible content shifts.
 */
export function BookingLoading() {
  return (
    <div className="flex min-h-[55rem] items-start rounded-card border border-border bg-card p-space-lg md:p-10 lg:p-12">
      <p className="text-body-md text-muted" role="status">
        {t.loading}
      </p>
    </div>
  );
}
