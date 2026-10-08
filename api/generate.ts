import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { minify } from "html-minifier-terser";

export const runtime = "nodejs";

export async function POST(req: Request) {
    let browser;

    try {
        const { html, filename = "cv.pdf" } = await req.json();
        
        if (!html) {
            return new Response("HTML manquant", {
                status: 400,
            });
        }
        const htmlContent = await minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            });

        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();

        // Taille écran proche A4
        await page.setViewport({
            width: 794,
            height: 900,
            deviceScaleFactor: 1,
        });

        await page.setContent(htmlContent, {
            waitUntil: "domcontentloaded",
        });

        // Désactive animations React/CSS
        await page.addStyleTag({
            content: `
                *,
                *::before,
                *::after {
                    animation: none !important;
                    transition: none !important;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    background: white;
                }

                @page {
                    size: A4;
                    margin: 0;
                }
            `,
        });


        // Attend les polices
        await page.evaluate(async () => {
            await document.fonts.ready;
        });


        // Attend les images
        await page.evaluate(async () => {
            const images = Array.from(document.images);

            await Promise.all(
                images.map((img) => {
                    if (img.complete) return;

                    return new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.onerror = () => resolve();
                    });
                })
            );
        });


        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,

            // Respecte tes CSS @page
            preferCSSPageSize: true,

            margin: {
                top: "0mm",
                right: "0mm",
                bottom: "0mm",
                left: "0mm",
            },

            displayHeaderFooter: false,
        });


        return new Response(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        });


    } catch (error) {
        console.error("PDF ERROR:", error);

        return new Response(
            JSON.stringify({
                error: "Impossible de générer le PDF",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}