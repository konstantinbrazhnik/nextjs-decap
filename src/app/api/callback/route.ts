import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return new NextResponse('Missing code', { status: 400 });
  }

  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return new NextResponse('Missing GitHub credentials', { status: 500 });
  }

  try {
    // Exchange code for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json() as any;

    if (data.error) {
      return new NextResponse(`GitHub Error: ${data.error_description}`, { status: 400 });
    }

    const token = data.access_token;

    // Return the script that sends the token back to the main window (Decap CMS)
    // Decap CMS opens this window in a popup and listens for the message
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
        <h1>Authenticating...</h1>
        <p id="status">Sending handshake...</p>
        <script>
          const token = "${token}";
          const provider = "github";
          
          function sendHandshake() {
            // Step 1: Send "authorizing:github" to initiate handshake
            console.log("Sending handshake: authorizing:" + provider);
            if (window.opener) {
               window.opener.postMessage("authorizing:" + provider, "*");
            } else {
               document.getElementById("status").innerText = "Error: No window.opener";
            }
          }

          function sendAuthData() {
            // Step 2: Send the actual token
            const data = JSON.stringify({ token, provider });
            const message = "authorization:" + provider + ":success:" + data;
            console.log("Sending auth data:", message);
            window.opener.postMessage(message, "*");
            document.getElementById("status").innerText = "Authentication successful! You can close this window.";
          }

          window.addEventListener("message", (event) => {
            console.log("Received message:", event.data);
            // Step 1b: CMS replies with the same "authorizing:github" message
            if (event.data === "authorizing:" + provider) {
              console.log("Handshake completed.");
              sendAuthData();
            }
          });
          
          // Send initial handshake immediately
          sendHandshake();
          
          // Fallback: If no handshake received after 1s (maybe CMS is already listening for success?), send auth data anyway
          setTimeout(() => {
             console.log("Handshake timeout, forcing auth data send...");
             sendAuthData();
          }, 1000);
        </script>
      </body>
      </html>
    `;

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error('OAuth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
