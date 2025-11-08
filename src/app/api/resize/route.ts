import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "No image file uploaded" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const width = parseInt(String(form.get("width") ?? "0"), 10) || undefined;
    const height = parseInt(String(form.get("height") ?? "0"), 10) || undefined;
    const format = String(form.get("format") ?? "png").toLowerCase();
    const enhance = String(form.get("enhance") ?? "false") === "true";
    const grayscale = String(form.get("grayscale") ?? "false") === "true";

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    let image = sharp(inputBuffer);

    if (width || height) {
      image = image.resize({ width, height, fit: "inside" });
    }
    if (grayscale) {
      image = image.grayscale();
    }
    if (enhance) {
      image = image.sharpen();
    }

    let mime = "image/png";
    switch (format) {
      case "jpeg":
      case "jpg":
        image = image.jpeg({ quality: 85 });
        mime = "image/jpeg";
        break;
      case "webp":
        image = image.webp({ quality: 85 });
        mime = "image/webp";
        break;
      case "png":
      default:
        image = image.png();
        mime = "image/png";
        break;
    }

    const out = await image.toBuffer();
    return new Response(out, {
      status: 200,
      headers: {
        "content-type": mime,
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("Resize error", err);
    return new Response(JSON.stringify({ error: err?.message || "Resize failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}