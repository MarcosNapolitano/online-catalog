// app/api/catalog/pdf/route.ts
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";

export async function GET() {
  // const browser = await puppeteer.launch({
  //   headless: true,
  //   executablePath:
  //     process.env.NODE_ENV === "production"
  //       ? await chromium.executablePath()
  //       : undefined,
  //   args: chromium.args,
  // });
  //
  // const page = await browser.newPage();
  //
  // // Abre tu home/index
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:3000";
  // await page.goto(baseUrl, { waitUntil: "networkidle0" });
  // await page.setViewport({ width: 1920, height: 1080 });
  //
  // // Selecciona todas las secciones del catálogo (ejemplo: div.catalog-page)
  // await page.waitForSelector(".section", { timeout: 10000 });
  // const sectionHandles = await page.$$(".section");
  //
  // // Array donde guardamos cada PDF de sección
  // const pdfBuffers: Buffer[] = [];
  //
  // for (const handle of sectionHandles) {
  //   // Renderiza solo esa sección
  //   const sectionHTML = await page.evaluate(
  //     (el) => el.outerHTML,
  //     handle
  //   );
  //
  //   // Creamos una página temporal con solo esa sección
  //   await page.setContent(sectionHTML, { waitUntil: "networkidle0" });
  //
  //   const pdf = new Buffer(await page.pdf({
  //     format: "A4",
  //     printBackground: true,
  //     margin: { top: 0, right: 0, bottom: 0, left: 0 },
  //   }));
  //
  //   pdfBuffers.push(pdf);
  // }
  //
  // await browser.close();
  //
  // // Unir todos los PDFs en uno solo
  // const mergedPdf = await PDFDocument.create();
  //
  // for (const buffer of pdfBuffers) {
  //   const pdf = await PDFDocument.load(buffer);
  //   const copied = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
  //   copied.forEach((page) => mergedPdf.addPage(page));
  // }
  //
  // const finalPdf = await mergedPdf.save();
  //
  // return new Response(new Uint8Array(finalPdf), {
  //   headers: {
  //     "Content-Type": "application/pdf",
  //     "Content-Disposition": 'inline; filename="catalogo.pdf"',
  //   },
  // });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 3000, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000', {
    waitUntil: 'networkidle2',
  });


  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      img.referrerPolicy = 'no-referrer';
    });
  });

  await page.waitForNetworkIdle({
    idleTime: 1000,
    timeout: 10000,
  });
  // Saves the PDF to hn.pdf.
  const pdf = await page.pdf({
    printBackground: true,
    format: "A4"
  });
  
  await browser.close();

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="catalogo.pdf"',
    },
  });

};

