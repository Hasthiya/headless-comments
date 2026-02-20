# comment-section-monorepo

Monorepo for **@hasthiya_/headless-comments-react** — a headless-first React comment engine with standalone hooks, composable primitives, pluggable adapters, and optional styled presets. TypeScript-native, zero dependencies (React 18+ as peer).

- **[Live demo](https://headless.hasthiya.dev/)**
- **[npm package](https://www.npmjs.com/package/@hasthiya_/headless-comments-react)**

## Repository structure

| Path | Description |
|------|-------------|
| `packages/comment-section` | Publishable library `@hasthiya_/headless-comments-react`. Full API, usage, and architecture are documented in [packages/comment-section/README.md](packages/comment-section/README.md). |
| `apps/showcase` | Next.js app: live demo, docs, and “Bring Your Own UI” examples (Home, Docs, Bring Your Own UI). |

## Prerequisites

- **Node** ≥ 18.0.0
- **pnpm** (this repo uses `pnpm@9.15.9` via `packageManager` field)

## Commands

From the repo root:

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies for all workspaces. |
| `pnpm dev` | Run the showcase app (Next.js dev server). |
| `pnpm build` | Build all packages and the showcase app. |
| `pnpm lint` | Lint all workspaces. |
| `pnpm typecheck` | Type-check all workspaces. |

## Contributing

Contributions are welcome.

1. **Fork** the [repository](https://github.com/Hasthiya/headless-comments) and clone your fork.
2. **Create a branch** for your change (`git checkout -b your-feature`).
3. **Make your changes.** For API and architecture details, see [packages/comment-section/README.md](packages/comment-section/README.md).
4. **Run** `pnpm lint` and `pnpm typecheck` from the root.
5. **Open a pull request** against the default branch.

- **Bug reports and feature requests:** [GitHub Issues](https://github.com/Hasthiya/headless-comments/issues)

## Links

- [GitHub repository](https://github.com/Hasthiya/headless-comments)
- [GitHub Issues](https://github.com/Hasthiya/headless-comments/issues)
- [npm package](https://www.npmjs.com/package/@hasthiya_/headless-comments-react)
- [Live demo](https://headless.hasthiya.dev/)

## License

MIT
