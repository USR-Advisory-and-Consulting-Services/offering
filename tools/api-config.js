/*
 * USR Free Tools API endpoint.
 *
 * GitHub Pages cannot run LibreOffice/Ghostscript/PDF conversion servers itself.
 * Deploy the /tools-api service from this package to a server/container, then set:
 * window.USR_TOOLS_API_BASE = 'https://YOUR-API-DOMAIN/api';
 *
 * If the API is served from the same origin, use '/api'.
 */
window.USR_TOOLS_API_BASE = window.USR_TOOLS_API_BASE || '/api';
