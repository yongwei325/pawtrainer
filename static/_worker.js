/**
 * Cloudflare Pages Advanced Mode Worker — Auth proxy for Decap CMS (GitHub backend).
 *
 * Two modes (auto-detected):
 *   PAT mode:   GITHUB_PAT env var is set → returns token directly, NO OAuth popup.
 *   OAuth mode: GITHUB_CLIENT_ID + GITHUB_CLIENT_SECRET → full GitHub OAuth flow.
 *
 * Endpoint: https://pawtrainer.pages.dev/api/auth
 *
 * Required Cloudflare Pages environment variables:
 *   PAT mode:   GITHUB_PAT (a GitHub Personal Access Token with `repo` scope)
 *   OAuth mode: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Auth endpoint
    if (url.pathname === '/api/auth') {
      return handleAuth(request, env);
    }

    // Everything else: static assets
    return env.ASSETS.fetch(request);
  }
};

async function handleAuth(request, env) {
  const url = new URL(request.url);
  const origin = url.origin; // https://pawtrainer.pages.dev

  // ── PAT mode: return token directly ──
  const PAT = env.GITHUB_PAT;
  if (PAT) {
    const payload = JSON.stringify({ token: PAT, provider: 'github' });
    const safeOrigin = origin.replace(/'/g, "\\'");

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Auth · PawTrainer</title>
</head>
<body>
  <p>Signing in with Personal Access Token…</p>
  <script>
    (function () {
      window.opener.postMessage('authorizing:github', '*');
      window.opener.postMessage(
        'authorization:github:success:${payload.replace(/'/g, "\\'")}',
        '${safeOrigin}'
      );
    })();
  </script>
</body>
</html>`;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // ── OAuth mode: full GitHub OAuth flow ──
  const CLIENT_ID = env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;
  const code = url.searchParams.get('code');

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response(
      'Neither GITHUB_PAT nor GITHUB_CLIENT_ID/CLIENT_SECRET configured. Please set one set of credentials in Cloudflare Pages environment variables.',
      { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  // Step 1: redirect to GitHub authorize
  if (!code) {
    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: 'public_repo',
      state,
      allow_signup: 'true',
      prompt: 'consent',
    });
    return Response.redirect(
      `https://github.com/login/oauth/authorize?${params.toString()}`,
      302
    );
  }

  // Step 2: exchange code for access token
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
    return new Response('GitHub did not return an access token.', {
      status: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Step 3: return token to Decap
  const payload = JSON.stringify({ token, provider: 'github' });
  const safeOrigin = origin.replace(/'/g, "\\'");

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
        if (e.origin !== '${safeOrigin}') return;
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
