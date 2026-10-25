import { Button, type ButtonTone } from "@/components/Button";
import { contact } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * WhatsApp button with a pre-filled message. While the business number is
 * TBC it opens the contact page instead (lib/whatsapp.ts).
 */
type WhatsAppActionProps = {
  label: string;
  message: string;
  /** "dark" on plum surfaces. */
  tone?: ButtonTone;
  /** A specific number (a location's); defaults to the business number. */
  number?: string | null;
};

export function WhatsAppAction({ label, message, tone = "light", number }: WhatsAppActionProps) {
  return (
    <Button href={whatsappLink(number ?? contact.whatsapp, message)} variant="whatsapp" tone={tone}>
      {label}
    </Button>
  );
}
