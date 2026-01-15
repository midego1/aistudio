import { ImageResponse } from "next/og";
import { loadOutfitFont } from "@/lib/og-fonts";
import { OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og-styles";

export const alt = "Help Center - Proppi";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const title = "Help Center";
  const description =
    "Guides, tutorials, and answers to help you get the most out of Proppi";

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
      {/* Question mark pattern decoration */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: `${OG_COLORS.accent}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              color: OG_COLORS.accent,
            }}
          >
            ?
          </div>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: `2px solid ${OG_COLORS.secondary}`,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            marginLeft: "30px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              border: `2px solid ${OG_COLORS.accent}30`,
            }}
          />
          <div
            style={{
              width: "70px",
              height: "50px",
              borderRadius: "25px",
              backgroundColor: `${OG_COLORS.secondary}80`,
            }}
          />
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "0",
          right: "0",
          height: "150px",
          background: `linear-gradient(180deg, transparent 0%, ${OG_COLORS.secondary}30 100%)`,
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
            Support
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

        {/* Help categories hint */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "8px",
          }}
        >
          {["Guides", "FAQs", "Contact"].map((item) => (
            <div
              key={item}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: `${OG_COLORS.secondary}80`,
                fontSize: "16px",
                color: OG_COLORS.text,
              }}
            >
              {item}
            </div>
          ))}
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
