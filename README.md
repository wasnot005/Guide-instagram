# Guide-instagram

Static guides for creating and sharing content on Instagram.

## Pages

- [Your Next 10 Days of Evergreen Content](index.html)
- [AI Rap Video — Step‑by‑Step](guide2/index.html)
- [Avatar Studio Onboarding Guide](avatar-guide/index.html)

## Gemini assistant setup

The Avatar Studio onboarding guide uses a Vercel serverless function (`/api/avatar-assistant`) to keep the Gemini API key on the server. To enable the AI helper in production:

1. In your Vercel project settings, add an environment variable named `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) that contains your Gemini key.
2. Redeploy the project so the new variable is available to the function.

When running locally with `vercel dev`, create an `.env.local` file with the same variable so the proxy can forward requests during development.
