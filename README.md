# open-cloud (factory demo)

A tiny gateway used to demonstrate the Open Cloud Factory: TODOs become specs,
specs become PRs, PRs are reviewed, gated and merged by agents — humans approve
at the gates.

- `npm test` — unit tests (node:test)
- `npm start` — gateway on :8080 (`GET /status`, `GET /version`, `GET /engines` with `x-api-key`)

`src/auth.js` is deliberately a gated path: any change there requires a human.
