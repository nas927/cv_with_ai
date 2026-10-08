import type {
    Profile,
} from '../types/cv';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { initDB, addData, getLastFiveEntries } from './db';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
function updateDB(profile: Profile, setFiveEntries: (entries: any[]) => void, database: IDBDatabase | null, cvName: string) {
    if (database)
        initDB().then((db) => {
            addData(db as IDBDatabase, {
                entreprise: profile.job,
                titre: profile.title,
                cvName: cvName,
                description: profile.about,
            });
            getLastFiveEntries(db as IDBDatabase).then((entries) => {
                console.log('Last five entries:', entries);
                setFiveEntries(entries);
            }).catch((error) => {
                console.error('Error retrieving last five entries:', error);
                setFiveEntries([]);
            });
        });
}

async function reqPuppeter(html: string)
{
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8" />
                    <style>
                        body {
                            font-family: "Noto Color Emoji", "Segoe UI Emoji", Arial, sans-serif;
                        }
                        ${Array.from(document.styleSheets)
                            .map((sheet) => {
                                try {
                                    return Array.from(sheet.cssRules)
                                        .map(rule => rule.cssText)
                                        .join('');
                                } catch {
                                    return '';
                                }
                            })
                            .join('')}
                    </style>
                </head>

                <body>
                    ${html}
                </body>
                </html>
            `,
        }),
    });

    return response;
}

const exportPdf = async (profile: Profile, setFiveEntries: (entries: any[]) => void, database: IDBDatabase | null, setCvGenerating: (value: boolean) => void) => {
    const element = document.querySelector('#cv-document') as HTMLElement | null;
    if (!element) return;

    const previousTransform = element.style.transform;
    element.classList.add('pdf-exporting');
    element.style.transform = 'none';
    
    try {
        const html = element.outerHTML;
        const response = await reqPuppeter(html);
        if (!response.ok)
            throw new Error('Erreur génération PDF');
        const cvName = `${(profile.job + ' ' + profile.title).replace(/[\s+ | !"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]/g, '-').toLowerCase()}-cv.pdf`;
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = cvName;
        
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        URL.revokeObjectURL(url);
        updateDB(profile, setFiveEntries, database, cvName);
    } finally {
        element.classList.remove('pdf-exporting');
        element.style.transform = previousTransform;
        setCvGenerating(false);
    }
};

const loadPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
  
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;
  
    let fullText = "";
  
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
  
      const textContent = await page.getTextContent();
  
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
  
      fullText += pageText + "\n";
    }
  
    return {
      text: fullText,
      pages: pdf.numPages
    };
  };

export { exportPdf, loadPDF };