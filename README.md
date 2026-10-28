# Gstat

GitHub profile finder. Search a username and load public profile stats, language mix, and repositories from the GitHub REST API.

```bash
npm install
npm run dev
```

Unauthenticated requests are limited to 60 per hour. Open **API token & rate limit** in the app and paste a classic personal access token to raise that to 5,000 per hour. The token is stored only in `localStorage`.

Share a lookup with `?u=octocat`.
