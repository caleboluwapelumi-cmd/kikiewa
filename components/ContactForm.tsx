"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { TbcLabel } from "@/components/Confirmable";
import { ChoiceGroup, choiceId } from "@/components/form/ChoiceGroup";
import { ErrorSummary, TextAreaField, TextField } from "@/components/form/Field";
import { contact, contactPage, type ContactTopic } from "@/data/site";
import { formatNigerianPhone, normaliseNigerianPhone, type FieldErrors } from "@/lib/validation";
import { isUsableWhatsAppNumber, whatsappLink } from "@/lib/whatsapp";

/**
 * Contact form (site plan, section 7): what it's about, name, phone and
 * message, sent as a pre-filled WhatsApp message to the business number.
 * Same validation and error pattern as /book. Nothing is stored or sent
 * anywhere else. While the number is TBC the form says so instead.
 */

const t = contactPage.form;

export function ContactForm() {
  const [topic, setTopic] = useState<ContactTopic | undefined>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{ kind: "opened"; href: string } | { kind: "tbc" } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const numberReady = isUsableWhatsAppNumber(contact.whatsapp);

  function clearError(key: string) {
    if (!errors[key]) return;
    const rest = { ...errors };
    delete rest[key];
    setErrors(rest);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found: FieldErrors = {};
    const e164 = normaliseNigerianPhone(phone);
    if (!topic) found.topic = t.errors.topic;
    if (!name.trim()) found.name = t.errors.name;
    if (!phone.trim()) found.phone = t.errors.phoneRequired;
    else if (!e164) found.phone = t.errors.phoneInvalid;
    if (!message.trim()) found.message = t.errors.message;
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus(null);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const topicLabel = t.topics.find((entry) => entry.value === topic)?.label ?? "";
    const text = [
      contactPage.message.greeting,
      "",
      message.trim(),
      "",
      `${contactPage.message.topic}: ${topicLabel}`,
      `${contactPage.message.name}: ${name.trim()}`,
      `${contactPage.message.phone}: ${formatNigerianPhone(e164!)}`,
    ].join("\n");

    if (!numberReady) {
      setStatus({ kind: "tbc" });
      return;
    }
    const href = whatsappLink(contact.whatsapp, text);
    window.open(href, "_blank", "noopener,noreferrer");
    setStatus({ kind: "opened", href });
  }

  const ids: Record<string, string> = {
    topic: choiceId("topic", t.topics[0].value),
    name: "contact-name",
    phone: "contact-phone",
    message: "contact-message",
  };
  const errorList = (["topic", "name", "phone", "message"] as const).flatMap((key) =>
    errors[key] ? [[ids[key], errors[key]!] as [string, string]] : [],
  );

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
      <ErrorSummary ref={summaryRef} title={t.errors.summary} errors={errorList} />
      <ChoiceGroup
        name="topic"
        legend={t.topicLegend}
        columns="sm:grid-cols-3"
        compact
        choices={t.topics.map((entry) => ({ value: entry.value, label: entry.label }))}
        value={topic}
        onChange={(value) => {
          setTopic(value as ContactTopic);
          clearError("topic");
        }}
        error={errors.topic}
      />
      <TextField
        id="contact-name"
        label={t.name}
        value={name}
        onValueChange={(value) => {
          setName(value);
          clearError("name");
        }}
        autoComplete="name"
        maxLength={80}
        error={errors.name}
      />
      <TextField
        id="contact-phone"
        label={t.phone}
        hint={t.phoneHint}
        value={phone}
        onValueChange={(value) => {
          setPhone(value);
          clearError("phone");
        }}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={20}
        error={errors.phone}
      />
      <TextAreaField
        id="contact-message"
        label={t.message}
        value={message}
        onValueChange={(value) => {
          setMessage(value);
          clearError("message");
        }}
        maxLength={1000}
        error={errors.message}
      />
      <p className="text-body-sm text-muted">
        {t.privacyBefore}
        <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-secondary">
          {t.privacyLink}
        </Link>
        {t.privacyAfter}
      </p>
      <div className="flex flex-col items-start gap-space-md border-t border-border pt-space-lg">
        <Button type="submit">{t.send}</Button>
        {numberReady ? null : <TbcLabel className="normal-case tracking-normal">{t.whatsappTbc}</TbcLabel>}
      </div>
      <div role="status" aria-live="polite">
        {status?.kind === "opened" ? (
          <p className="flex flex-col items-start gap-space-sm border-l-2 border-accent pl-space-md text-body-md text-foreground">
            {t.opened}
            <Button href={status.href} target="_blank" rel="noopener noreferrer" variant="whatsapp">
              {t.reopen}
            </Button>
          </p>
        ) : status?.kind === "tbc" ? (
          <p className="border-l-2 border-accent pl-space-md text-body-md text-foreground">{t.whatsappTbc}</p>
        ) : null}
      </div>
    </form>
  );
}
