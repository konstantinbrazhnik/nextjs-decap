import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    const site_id = searchParams.get('site_id');

    // We only support GitHub for now
    if (provider !== 'github') {
        return new NextResponse('Unsupported provider', { status: 400 });
    }

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    if (!client_id || !client_secret) {
        return new NextResponse('Missing GitHub credentials', { status: 500 });
    }

    // Generate a random state for security
    const state = crypto.randomUUID();

    // Construct the redirect URL to GitHub
    const params = new URLSearchParams({
        client_id,
        scope: 'repo user', // Scopes required by Decap CMS
        state,
    });

    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
