# Guide-instagram

Static guides for creating and sharing content on Instagram.

## Pages

- [Your Next 10 Days of Evergreen Content](index.html)
- [AI Rap Video — Step‑by‑Step](guide2/index.html)
- [Avatar Studio Onboarding Guide](avatar-guide/index.html)

## Environment variables

The Avatar Studio onboarding page uses a Vercel serverless function at `/api/gemini` to call Gemini securely. Set the following environment variable in your Vercel project (for Production, Preview, and Development):

- `GEMINI_API_KEY` – Google AI Studio API key with access to the Gemini model used in the chatbot.

When testing locally with `vercel dev`, ensure the same variable is available in your shell environment.
