import { AboutPage } from "@/components/landing/about-page";
import { constructMetadata } from "@/lib/constructMetadata";

export const metadata = constructMetadata({
  title: "About - Proppi",
  description:
    "Learn about Proppi, the AI-powered photo enhancement platform for real estate professionals.",
  canonical: "/about",
});

export default function Page() {
  return <AboutPage />;
}
