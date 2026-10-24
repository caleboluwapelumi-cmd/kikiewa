import { Button, type ButtonVariant } from "@/components/Button";
import { contact } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * WhatsApp button with a pre-filled message. While the business number is
 * TBC it opens the contact page instead (lib/whatsapp.ts).
 */
type WhatsAppActionProps = {
  label: string;
  message: string;
  variant?: ButtonVariant;
};

export function WhatsAppAction({ label, message, variant = "primary" }: WhatsAppActionProps) {
  return (
    <Button
      href={whatsappLink(contact.whatsapp, message)}
      variant={variant}
      icon="whatsapp"
      iconPosition="leading"
    >
      {label}
    </Button>
  );
}
