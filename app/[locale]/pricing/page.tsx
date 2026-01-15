import { PricingPage } from "@/components/landing/pricing-page";
import { constructMetadata } from "@/lib/constructMetadata";

export const metadata = constructMetadata({
  title: "Pricing - Proppi",
  description:
    "Simple, transparent pricing. Pay per project, no subscriptions.",
  canonical: "/pricing",
});

export default function Page() {
  return <PricingPage />;
}
