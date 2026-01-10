"use client";

import React from "react";

interface HtmlPreviewRendererProps {
    htmlCode: string;
    cssCode: string;
    jsCode: string;
    templateName: string;
}

export default function HtmlPreviewRenderer({
    htmlCode,
    cssCode,
    jsCode,
    templateName,
}: HtmlPreviewRendererProps) {
    const getFullHtml = () => {
        // Check if the code is already a full HTML document
        const isFullDocument =
            htmlCode.trim().toLowerCase().startsWith("<!doctype html") ||
            htmlCode.trim().toLowerCase().startsWith("<html");

        if (isFullDocument) {
            let processedHtml = htmlCode;

            // Inject CSS into <head>
            if (cssCode) {
                if (processedHtml.includes("</head>")) {
                    processedHtml = processedHtml.replace(
                        "</head>",
                        `<style>${cssCode}</style></head>`
                    );
                } else {
                    processedHtml = processedHtml.replace(
                        "<html>",
                        `<html><head><style>${cssCode}</style></head>`
                    );
                }
            }

            // Inject JS before </body>
            if (jsCode) {
                if (processedHtml.includes("</body>")) {
                    processedHtml = processedHtml.replace(
                        "</body>",
                        `<script>${jsCode}</script></body>`
                    );
                } else {
                    processedHtml = processedHtml.replace(
                        "</html>",
                        `<script>${jsCode}</script></html>`
                    );
                }
            }

            return processedHtml;
        }

        // Legacy/Fragment Mode: Wrap content in default structure
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName}</title>
    <style>${cssCode}</style>
</head>
<body>
    ${htmlCode}
    <script>${jsCode}</script>
</body>
</html>
        `.trim();
    };

    return (
        <div className="w-full h-screen bg-white">
            <iframe
                srcDoc={getFullHtml()}
                className="w-full h-full border-0"
                title={templateName}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
        </div>
    );
}
