# Next.js + Decap CMS + OpenNext Starter

This is an AI-ready starter project for building a Next.js application with Decap CMS, deployed to Cloudflare Pages via OpenNext.

## Features

- **Next.js 15 (App Router)**: Modern React framework.
- **Cloudflare Pages**: Deployed via `@opennextjs/cloudflare`.
- **Decap CMS**: Git-based CMS for content management.
- **Custom OAuth**: Integrated GitHub OAuth flow using Next.js API Routes (no external auth service needed).
- **TypeScript & Tailwind CSS**: Type safety and utility-first styling.
- **AI-Ready**: Context files and clean architecture for AI agent iteration.

## Prerequisites

- Node.js 18+
- Cloudflare Account
- GitHub Account

## Setup

1.  **Clone & Install**:
    ```bash
    git clone <your-repo>
    cd nextjs-decap
    npm install
    ```

2.  **Cloudflare Pages Setup**:
    - Create a new Pages project in Cloudflare dashboard.
    - Connect it to your GitHub repository.
    - **Build Settings**:
        - Framework preset: `None`
        - Build command: `npm run deploy` (or `npm run build` + `npm run build:worker` manually)
        - Output directory: `.open-next/assets`
    - **Environment Variables**:
        - `GITHUB_CLIENT_ID`: From your GitHub OAuth App.
        - `GITHUB_CLIENT_SECRET`: From your GitHub OAuth App.

3.  **GitHub OAuth App**:
    - Create a new OAuth App in GitHub Developer Settings.
    - **Homepage URL**: `https://your-site.pages.dev`
    - **Authorization callback URL**: `https://your-site.pages.dev/api/callback`

## Development

- **Local Dev**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.
    Access the CMS at `http://localhost:3000/admin`.
    *Note: OAuth flow requires a live domain or ngrok for callbacks to work properly.*

- **Testing**:
    ```bash
    npm test
    ```

## Architecture

- `app/api/auth`: Handles the OAuth redirect to GitHub.
- `app/api/callback`: Handles the code exchange and posts the token back to Decap CMS.
- `public/admin`: Contains the Decap CMS entry point and configuration.
- `content/`: Stores the markdown content created by the CMS.

## AI Agents

Refer to [CONTEXT.md](./CONTEXT.md) for architectural details and coding standards.
