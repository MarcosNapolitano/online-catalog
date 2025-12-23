import fs from "fs";
import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";


export const runtime = "nodejs";
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
(pdfjsLib as any).GlobalWorkerOptions.workerPort = null;

export async function POST(request: Request) {

  const data = await request.bytes();
  const pdf = await pdfjsLib.getDocument({ data: data }).promise;

  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items.map(item => (item as TextItem).str).join(" ");

    fullText += `\n\n--- Página ${pageNum} ---\n`;
    fullText += pageText;
  }

  console.log(fullText)
  return new NextResponse(fullText, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="test.txt"',
    },
  })

}
