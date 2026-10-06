# USR Advisory – Free Tools Final High-Quality Patch

## Replacement files
Replace the existing `tools/` folder with this `tools/` folder. No other USR website files are required for this patch.

## 12 tools included
1. JPG to PDF
2. PDF to Word
3. PDF to JPG
4. Compress PDF
5. Merge PDF
6. Word to PDF
7. PDF to PNG
8. Images to PDF
9. Image Compressor
10. Image Resizer
11. PPT to Word
12. Word to PowerPoint

## Quality fixes
- JPG/Images to PDF now preserves PNG as PNG and JPEG as JPEG instead of blindly labelling every image as JPEG.
- PDF to JPG/PNG uses higher render resolution and quality-focused canvas rendering.
- PDF to Word has two modes: **Exact layout (high-fidelity)** and **Editable text**. Exact layout embeds each PDF page at its original page size so the visual appearance is preserved.
- Word to PDF renders individual Word pages instead of sending the entire preview container through a generic HTML-to-PDF flow.
- Compress PDF now uses QPDF WASM optimization rather than rasterizing every page into a JPEG. It will not intentionally return a larger file than the original.
- Word conversion dependencies are loaded in the correct order: JSZip before docx-preview.
- docx-preview is pinned to 0.4.1.

## SEO / AdSense
All 12 tool pages include the USR AdSense code, unique SEO titles/descriptions, canonical URLs, robots metadata, Open Graph metadata, Twitter card metadata and SoftwareApplication/WebApplication structured data.

## Important fidelity note
Browser-based document conversion cannot reproduce every proprietary Microsoft Office or PDF feature exactly. The new workflows are designed to prioritize visual fidelity and to fail clearly rather than silently producing a misleading low-quality file. For PDF-to-Word, exact visual fidelity and fully editable Word objects are inherently different goals; the tool exposes both modes.

## Compression engine note
The compressor loads `qpdf-wasm-esm-embedded` 1.1.1 from jsDelivr at runtime. QPDF is Apache-2.0 licensed.
