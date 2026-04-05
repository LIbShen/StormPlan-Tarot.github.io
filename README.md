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

## License

MIT License

Copyright (c) 2026 libshen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

