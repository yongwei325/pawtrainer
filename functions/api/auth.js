/**
 * Cloudflare Pages Function — OAuth proxy for Decap CMS (GitHub backend).
 *
 * Endpoint: https://pawtrainer.pages.dev/api/auth
 * Usage in static/admin/config.yml:
 *   backend:
 *     name: github
 *     base_url: https://pawtrainer.pages.dev/api/auth
 *
 * Required Cloudflare Pages environment variables:
 *   GITHUB_CLIENT_ID     (from your GitHub OAuth app)
 *   GITHUB_CLIENT_SECRET (from your GitHub OAuth app → Generate a new client secret)
 *
 * Flow:
 *   1. Decap opens this endpoint in a popup.
 *   2. We redirect to GitHub /login/oauth/authorize.
 *   3. GitHub redirects back here with ?code=...
 *   4. We exchange code for access_token.
 *   5. We return an HTML page that posts the token back to Decap.
 */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response(
      'OAuth credentials not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages environment variables.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  // Step 1: initial request from Decap → redirect to GitHub authorize
  if (!code) {
    const redirectUri = encodeURIComponent(url.origin + url.pathname);
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo`;
    return Response.redirect(githubUrl, 302);
  }

  // Step 2: GitHub callback → exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response(
      `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`,
      { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  const token = tokenData.access_token;
  if (!token) {
    return new Response(
      'GitHub did not return an access token.',
      { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  // Step 3: return a tiny page that hands the token back to Decap via postMessage
  const payload = JSON.stringify({ token, provider: 'github' });
  const origin = url.origin.replace(/'/g, "\\'");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Auth Complete · PawTrainer</title>
</head>
<body>
  <p>Authentication complete. You can close this window.</p>
  <script>
    (function () {
      function receiveMessage(e) {
        if (e.origin !== '${origin}') return;
        window.opener.postMessage(
          'authorization:github:success:${payload.replace(/'/g, "\\'")}',
          e.origin
        );
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
