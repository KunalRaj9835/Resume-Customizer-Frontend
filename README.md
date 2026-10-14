# Resume Customizer — Frontend (lean first build)

Next.js 14 (App Router), TypeScript strict, Tailwind 3, Supabase Auth (Google), typed fetch client for the FastAPI backend.

## Run (macOS)
```bash
unzip resume-customizer-frontend.zip -d resume-customizer && cd resume-customizer
cp .env.example .env.local   # fill in Supabase URL + anon key
npm install
npm run dev                  # http://localhost:3000
```
Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Supabase / Google OAuth
Supabase Dashboard > Project Settings > API: copy URL and anon/publishable key.
Authentication > Providers > Google: enable it with your Google OAuth client. Add `http://localhost:3000/auth/callback` (and your production URL) under Authentication > URL Configuration > Redirect URLs.

## Backend
Start FastAPI separately (default `http://127.0.0.1:8000/api/v1`, docs at `/docs`). Set `NEXT_PUBLIC_API_BASE_URL` to change it.

## Assumptions to reconcile (src/lib/api.ts, src/lib/types.ts)
- `POST /auth/session` returns `{ "session_id": "..." }`; sent back as header `X-Session-ID`.
- List endpoints return `{items,total,page,page_size}` and accept `?page=`.
- `POST /customizations` is synchronous and returns the customization with structured `content`.
- Upload limit is hard-coded to 10 MB in the upload page.

## Not included yet
Resume detail page, job-description pages, settings, dark mode, shadcn/ui, React Hook Form/Zod, tests, docs/ folder, Vercel guide beyond: import repo, set the five env vars, add the production callback URL in Supabase.
Live integration with Supabase, Google, and the backend is untested.
