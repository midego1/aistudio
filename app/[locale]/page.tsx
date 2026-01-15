import { LandingPage } from "@/components/landing/landing-page";
import { constructMetadata } from "@/lib/constructMetadata";

export const metadata = constructMetadata({
  canonical: "/",
});

export default function Page() {
  return <LandingPage />;
}
