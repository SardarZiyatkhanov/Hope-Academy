import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logoData = readFileSync(join(process.cwd(), "public/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logoData.toString("base64")}`;
  const poppinsBold = readFileSync(join(process.cwd(), "assets/fonts/Poppins-Bold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0e2454",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(43,109,232,0.35) 0%, rgba(43,109,232,0) 45%), radial-gradient(circle at 80% 85%, rgba(232,160,32,0.25) 0%, rgba(232,160,32,0) 45%)",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={140}
          height={140}
          style={{ borderRadius: "50%", marginBottom: 32 }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "Poppins",
            color: "#ffffff",
            letterSpacing: -1,
          }}
        >
          Hope Academy
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 28,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
            letterSpacing: 6,
          }}
        >
          Edu and Career Counselling
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            maxWidth: 820,
          }}
        >
          Bakıdan bütün dünyaya təhsil səyahətiniz
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Poppins",
          data: poppinsBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
