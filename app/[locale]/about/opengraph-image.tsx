import { ImageResponse } from "next/og";
import { loadOutfitFont } from "@/lib/og-fonts";
import { OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og-styles";

export const alt = "About Proppi - AI-Powered Real Estate Photo Editor";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const title = "About Proppi";
  const description =
    "Learn about our mission to transform real estate photography with AI";

  const [fontBold, fontRegular] = await Promise.all([
    loadOutfitFont(title, 700),
    loadOutfitFont(description, 400),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${OG_COLORS.background} 0%, ${OG_COLORS.backgroundGradientEnd} 100%)`,
        padding: "60px",
        fontFamily: "Outfit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements - Abstract shapes */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "60px",
          width: "300px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: `${OG_COLORS.accent}25`,
            }}
          />
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: `${OG_COLORS.secondary}80`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginLeft: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: `3px solid ${OG_COLORS.accent}40`,
            }}
          />
          <div
            style={{
              width: "100px",
              height: "60px",
              borderRadius: "30px",
              backgroundColor: `${OG_COLORS.accent}15`,
            }}
          />
        </div>
      </div>

      {/* Bottom decorative arc */}
      <div
        style={{
          position: "absolute",
          bottom: "-200px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          borderRadius: "50%",
          border: `2px solid ${OG_COLORS.secondary}`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: "24px",
          maxWidth: "700px",
          zIndex: 1,
        }}
      >
        {/* Small badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: OG_COLORS.accent,
            }}
          />
          <span
            style={{
              fontSize: "18px",
              color: OG_COLORS.accent,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Our Story
          </span>
        </div>

        {/* Page title */}
        <div
          style={{
            fontSize: OG_FONTS.heading,
            fontWeight: 700,
            color: OG_COLORS.text,
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: OG_FONTS.subheading,
            color: OG_COLORS.text,
            opacity: 0.7,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${OG_COLORS.border}`,
          paddingTop: "24px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: OG_FONTS.body,
            fontWeight: 700,
            color: OG_COLORS.accent,
          }}
        >
          Proppi
        </div>
        <div
          style={{
            fontSize: OG_FONTS.small,
            color: OG_COLORS.textMuted,
          }}
        >
          proppi.tech
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Outfit",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Outfit",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
