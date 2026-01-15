import { ContactPage } from "@/components/landing/contact-page";
import { constructMetadata } from "@/lib/constructMetadata";

export const metadata = constructMetadata({
  title: "Contact - Proppi",
  description: "Get in touch with us. We'd love to hear from you.",
  canonical: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
