# USR Advisory – Final Calculators + AdSense Update

This is an UPDATE/PATCH package for the existing USR Advisory GitHub repository.

## Existing files changed
- index.html — added AdSense Auto Ads script and a Free Calculators link.
- about.html — added AdSense Auto Ads script.
- ai-training.html — added AdSense Auto Ads script.
- contact.html — added AdSense Auto Ads script.
- financial-services.html — added AdSense Auto Ads script and a Free Calculators link.
- market-intelligence.html — added AdSense Auto Ads script.
- gst-saathi/index.html — fixed the malformed `<head>` tag and added AdSense Auto Ads script.

## SEO / crawl files changed
- sitemap.xml — added the calculator hub and all 11 calculator URLs, plus the existing GST Saathi URL.
- robots.txt — allows crawling and points to the main sitemap.

## New files/folders
- calculators/ — calculator hub plus 11 individual calculator pages, shared CSS and JavaScript.

## AdSense
The following Auto Ads code is included on the indexable pages:
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1405026223432024" crossorigin="anonymous"></script>

No ad-slot IDs were invented. Auto Ads requires the site to be enabled/configured in the AdSense account.

## GitHub installation
1. Do NOT delete your existing repository files.
2. Upload/replace only the files listed above.
3. Upload the complete new `calculators/` folder.
4. Commit the changes.
5. Confirm:
   https://usr-advisory.in/calculators/
6. In Google Search Console, submit or refresh:
   https://usr-advisory.in/sitemap.xml

The calculator pages are designed for India, mobile use, simple inputs, useful results, internal linking and search-friendly page structure. Tax and financial results are estimates and should be checked against current official rules for important decisions.
