import { Button, type ButtonVariant } from "@/components/Button";
import { TbcLabel } from "@/components/Confirmable";
import { contact } from "@/data/site";
import { WHATSAPP_FALLBACK_HREF, whatsappLink } from "@/lib/whatsapp";

/**
 * WhatsApp button with a pre-filled message. While the business number is
 * TBC it opens the contact page instead, and says so underneath.
 */
type WhatsAppActionProps = {
  label: string;
  message: string;
  variant?: ButtonVariant;
};

export function WhatsAppAction({ label, message, variant = "primary" }: WhatsAppActionProps) {
  const href = whatsappLink(contact.whatsapp, message);
  const isFallback = href === WHATSAPP_FALLBACK_HREF;

  return (
    <div className="flex flex-col items-start gap-space-sm">
      <Button href={href} variant={variant} icon="whatsapp" iconPosition="leading">
        {label}
      </Button>
      {isFallback ? (
        <p className="text-body-sm text-muted">
          WhatsApp number: <TbcLabel />. Until it is, this opens our contact page.
        </p>
      ) : null}
    </div>
  );
}
