# USR Advisory – Calculator Enhancement, GST Saathi, SEO & AdSense Update

This package updates the existing USR Advisory & Consulting Services GitHub website. It does **not** redesign the main website.

## What was improved

### Calculators
All calculator pages were reviewed and upgraded for practical use:

- **EMI Calculator** — EMI, total interest, total repayment and illustrative processing fee + GST.
- **Loan Calculator** — repayment planning with interest, tenure and processing-fee estimate.
- **Loan Eligibility Calculator** — affordable EMI, existing EMI burden, FOIR/EMI-to-income cap and indicative loan amount.
- **SIP Calculator** — corpus, invested amount, gains, annual step-up and inflation-adjusted value.
- **Income Tax Calculator** — FY 2026-27 / Tax Year 2026-27 planning with old/new comparison, standard deductions and common old-regime deductions.
- **Old vs New Tax Regime Calculator** — direct comparison using HRA, 80C, 80D, NPS and other eligible deductions.
- **Salary / In-Hand Salary Calculator** — CTC-to-gross breakdown, employer PF, gratuity, employee PF, professional tax, income tax and monthly take-home pay.
- **HRA Calculator** — FY selector, old/new regime, months occupied and the **eight-city 50% HRA list for FY 2026-27: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad**.
- **Capital Gains Tax Calculator** — listed equity/equity-oriented mutual fund STCG/LTCG estimate with expenses and LTCG threshold.
- **Currency Converter** — no manual exchange-rate field. Rates are fetched automatically from reference-rate APIs with a fallback provider.
- **Age Calculator** — exact age plus next birthday and days remaining.
- **GST Saathi** — existing GST utility retained and linked prominently from the calculator hub.

### GST Saathi
- Added/strengthened visibility from `/calculators/`.
- Improved title and meta description for search.
- Added a direct link back to the complete calculator collection.

### SEO
- Updated calculator hub title/description.
- Updated individual calculator titles/descriptions around high-intent Indian search terms.
- Retained canonical URLs, Open Graph metadata and structured-data markup.
- Calculator hub schema now includes GST Saathi.
- Sitemap retains all calculator URLs and GST Saathi.

### AdSense
- AdSense Auto Ads code is present across the site's HTML pages using the existing publisher ID.
- Added `ads.txt` for the same publisher ID.
- No invented ad-slot IDs were added.

## Important tax note
The tax calculators are planning tools, not tax-return filing engines. They use common individual/salary assumptions for FY/Tax Year 2026-27 and do not attempt to cover every special-rate income, complex surcharge, business-income case, capital-gains interaction or other exceptional provision.

## GitHub installation

### Option A — easiest
Replace the current repository with the files in the **complete updated ZIP** if you want the whole verified website package.

### Option B — replace only changed files
Use the separate **PATCH ZIP** and replace only those files/folders in the existing GitHub repository.

After deployment, check:

- `https://usr-advisory.in/calculators/`
- `https://usr-advisory.in/calculators/hra/`
- `https://usr-advisory.in/calculators/currency-converter/`
- `https://usr-advisory.in/gst-saathi/`
- `https://usr-advisory.in/sitemap.xml`
- `https://usr-advisory.in/ads.txt`

For important financial or tax decisions, verify the applicable current rules and your personal circumstances.
