<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1HdTRXM9rKOPpmEMqX8eQ8z3Ylndi3lgI

## Run Locally

**Prerequisites:** Node.js (recommended 18+)


1. Install dependencies:
   `npm install`
2. Create `.env.local` (optional) and set:
   `GEMINI_API_KEY=YOUR_KEY` (see [.env.example](.env.example))
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project uses Vite and is configured to build with relative asset paths for GitHub Pages.

1. Push to a GitHub repo (default branch: `main`).
2. (Optional) In your GitHub repo, add Actions secret:
   - `GEMINI_API_KEY` (Settings → Secrets and variables → Actions)
   - Note: This is a client-side app. Any API key embedded at build time can be extracted by users.
3. Enable Pages deployment:
   - Settings → Pages → Build and deployment → Source: GitHub Actions
4. Push to `main`. The workflow at `.github/workflows/deploy.yml` builds and deploys `dist/` to Pages automatically.
