import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

export function metaImagesPlugin(): Plugin {
  return {
    name: "vite-plugin-meta-images",
    transformIndexHtml(html) {
      const baseUrl = getDeploymentUrl();
      if (!baseUrl) {
        console.log("[meta-images] No deployment URL found, skipping meta updates.");
        return html;
      }

      const publicDir = path.resolve(process.cwd(), "client", "public");

      const possibleFiles = ["opengraph.png", "opengraph.jpg", "opengraph.jpeg"];
      const foundFile = possibleFiles.find(file =>
        fs.existsSync(path.join(publicDir, file))
      );

      if (!foundFile) {
        console.log("[meta-images] No OpenGraph image found.");
        return html;
      }

      const imageUrl = `${baseUrl}/${foundFile}`;

      console.log("[meta-images] Updating meta images to:", imageUrl);

      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/g,
        `<meta property="og:image" content="${imageUrl}" />`
      );

      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/g,
        `<meta name="twitter:image" content="${imageUrl}" />`
      );

      return html;
    },
  };
}

function getDeploymentUrl(): string | null {
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return null;
}
