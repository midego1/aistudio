import { ImageResponse } from "next/og";
import { loadOutfitFont } from "@/lib/og-fonts";
import { OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og-styles";

export const alt = "Pricing - Proppi";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const title = "Simple Pricing";
  const description =
    "Pay per project, no subscriptions. Transparent pricing for real estate professionals.";

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
      {/* Price tag decoration */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Stylized price indicator */}
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            backgroundColor: `${OG_COLORS.accent}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px solid ${OG_COLORS.accent}30`,
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: OG_COLORS.accent,
            }}
          >
            $
          </div>
        </div>
        {/* Small decorative circles */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: OG_COLORS.accent,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: `${OG_COLORS.accent}60`,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: `${OG_COLORS.accent}30`,
            }}
          />
        </div>
      </div>

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `linear-gradient(45deg, ${OG_COLORS.secondary}60 0%, transparent 70%)`,
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
          maxWidth: "650px",
          zIndex: 1,
        }}
      >
        {/* Badge */}
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
            Pricing
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

        {/* Trust indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: "14px" }}>✓</span>
          </div>
          <span
            style={{
              fontSize: "18px",
              color: OG_COLORS.textMuted,
            }}
          >
            No hidden fees
          </span>
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
