# USR Advisory Free Tools — High-Fidelity Edition

This package contains the 12-tool frontend plus a separate conversion API designed for professional document fidelity.

## Important deployment architecture

GitHub Pages can host the `/tools/` frontend, but it cannot execute LibreOffice, Ghostscript or Python conversion code. For high-fidelity Office/PDF conversion, deploy `/tools-api/` to a server/container and point `tools/api-config.js` at its HTTPS `/api` URL.

Example:

```js
window.USR_TOOLS_API_BASE = 'https://YOUR-API-DOMAIN/api';
```

Do **not** put private API keys or server credentials into GitHub Pages JavaScript.

## Conversion engine

The API uses:
- LibreOffice for DOCX/PPTX office rendering/conversion
- Ghostscript for PDF optimization
- PyMuPDF for high-resolution PDF page rendering
- pdf2docx for PDF-to-DOCX conversion
- Pillow for image compression/resizing
- pypdf for PDF merging
- python-pptx for Word-to-PowerPoint page-faithful presentation output

The Word-to-PPT conversion intentionally prioritizes visual fidelity by placing rendered document pages onto presentation slides. This preserves appearance better than extracting plain text, but the resulting slide content is not equivalent to a fully editable native PowerPoint layout.

## Security / privacy

Use HTTPS for the API. Limit upload size, rate-limit requests, and configure the hosting platform to remove temporary files after processing. The included API uses short-lived job directories.

## SEO

Each tool page has a unique search-focused title and description, canonical URL, robots directives, Open Graph metadata, WebApplication schema and BreadcrumbList schema. The tools hub is also optimized for discovery of the 12 individual utilities.

## AdSense

The existing USR AdSense publisher code remains on the HTML pages. Google recommends placing the AdSense site code between `<head>` and `</head>` and on every page where ads should appear.

`ads.txt` remains:

`google.com, pub-1405026223432024, DIRECT, f08c47fec0942fa0`
