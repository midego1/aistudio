import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import { loadOutfitFont } from "@/lib/og-fonts";
import { OG_COLORS, OG_FONTS, OG_SIZE } from "@/lib/og-styles";

export const alt = "Proppi Blog";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title || "Blog Post";
  const category = post?.category || "Article";

  // Combine all text for font loading
  const allText = `${title}${category}Proppi Blog proppi.tech`;
  const [fontBold, fontRegular] = await Promise.all([
    loadOutfitFont(allText, 700),
    loadOutfitFont(allText, 400),
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
      {/* Large decorative quote mark */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "60px",
          fontSize: "300px",
          color: `${OG_COLORS.accent}08`,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {'"'}
      </div>

      {/* Decorative lines */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "100px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "4px",
            backgroundColor: `${OG_COLORS.accent}40`,
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: `${OG_COLORS.accent}25`,
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "20px",
            height: "4px",
            backgroundColor: `${OG_COLORS.accent}15`,
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Bottom decorative element */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "200px",
          borderRadius: "50%",
          border: `1px solid ${OG_COLORS.secondary}`,
        }}
      />

      {/* Category badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            backgroundColor: OG_COLORS.accent,
            color: "white",
            padding: "10px 24px",
            borderRadius: "24px",
            fontSize: "18px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {category}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: "24px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: title.length > 50 ? 48 : 56,
            fontWeight: 700,
            color: OG_COLORS.text,
            lineHeight: 1.2,
            maxWidth: "900px",
            letterSpacing: "-1px",
          }}
        >
          {title}
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
            display: "flex",
            alignItems: "center",
            gap: "12px",
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
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: OG_COLORS.textMuted,
            }}
          />
          <div
            style={{
              fontSize: OG_FONTS.small,
              color: OG_COLORS.textMuted,
            }}
          >
            Blog
          </div>
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
