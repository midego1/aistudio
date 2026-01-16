import { Toaster } from "@/components/ui/sonner";
import { constructMetadata } from "@/lib/constructMetadata";
import OrangeBlob from "@/components/landing/blobs/orange-blob";
import BlueBlob from "@/components/landing/blobs/blue-blob";

export const metadata = constructMetadata({
  title: "VastgoedFotoAI.nl",
  description: "Transform property photos with AI",
  noIndex: true,
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#f8f8fa]">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-30 animate-spin-slower">
         <OrangeBlob className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] translate-y-1/2 -translate-x-1/3 pointer-events-none opacity-30 animate-float-slow">
         <BlueBlob className="w-full h-full" />
      </div>

      <div className="w-full max-w-md relative z-10">{children}</div>
      <Toaster position="top-center" />
    </div>
  );
}
