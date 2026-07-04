import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FinTrack — Dashboard financiero",
    short_name: "FinTrack",
    description: "Dashboard personal de finanzas sincronizado con Notion",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5fb",
    theme_color: "#6c5dd3",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
