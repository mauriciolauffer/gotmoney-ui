# Agent Instructions for Million Pixel Billboard

This project is a Million Pixel Billboard inspired by the Million Dollar Homepage.

## Tech Stack
- **Frontend**: Vue.js 3, TypeScript, Vite, Vitest.
- **Backend**: Cloudflare Workers, Hono, Cloudflare D1.
- **Dev Tools**: oxlint, oxfmt.
- **CI/CD**: GitHub Actions.

## Project Structure
- `packages/frontend`: Vue.js application.
- `packages/backend`: Hono application for Cloudflare Workers.

## Coding Standards
- Use TypeScript for both frontend and backend.
- Follow Vue 3 Composition API best practices.
- Use Hono for lightweight and fast API routing.
- Use D1 for persistent storage of pixel data.

## Linting and Formatting
- Use `oxlint` for linting.
- Use `oxfmt` for formatting.

## Testing
- Use Vitest for unit and integration tests in the frontend.
- Backend tests should also use Vitest where applicable.

## Database Schema
- A `pixels` table should store pixel information (x, y, color, link, owner, etc.).
- Consider performance when querying many pixels.

## Deployment
- Deployment is handled via GitHub Actions to Cloudflare Pages (frontend) and Cloudflare Workers (backend).
