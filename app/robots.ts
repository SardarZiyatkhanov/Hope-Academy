import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/student", "/student/"],
    },
    sitemap: "https://hopeacademy.az/sitemap.xml",
  };
}
