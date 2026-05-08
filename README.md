# Aerotech Backoffice

This repository contains the frontend admin panel (React + TypeScript + MUI X) for the Aerotech PSS backoffice.

## What I added
- Vite + React + TypeScript project configuration
- MUI theme and layout skeleton
- Redux Toolkit auth slice with login flow
- Axios client and auth service wired to your Login API
- Login page and protected Dashboard route

## Local development
1. Install dependencies: `pnpm install` (or `npm install`)
2. Run dev server: `pnpm dev`

## Notes
- The login service posts to your provided endpoint: `https://irongate.dotair.stg.agidp.ir/bff/backoffice/identity-service/v1/Users/LoginByPassword`.
- Tokens are stored in localStorage under `aero_token` and attached to `apiClient` as a Bearer header.
- The auth slice assumes the API returns `accessToken` or `token` in the response — adjust `authSlice` if the real response differs.
