import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hope Academy — Edu and Career Counselling",
    short_name: "Hope Academy",
    description: "Bakıdan bütün dünyaya — təhsil məsləhəti və müraciət platforması",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e2454",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
