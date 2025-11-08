import { NextRequest } from "next/server";
import { Document, Packer, Paragraph } from "docx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text ?? "").trim();
    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const paragraphs = text.split(/\n+/).map((line) => new Paragraph(line));
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);

    return new Response(buffer, {
      status: 200,
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "content-disposition": `attachment; filename="converted.docx"`,
      },
    });
  } catch (err: any) {
    console.error("convert-text error", err);
    return new Response(JSON.stringify({ error: err?.message || "Conversion failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}