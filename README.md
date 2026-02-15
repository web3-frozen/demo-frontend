# Demo Frontend

Production-ready React/TypeScript Task Manager UI.

## Features

- **Kanban board** with To Do / In Progress / Done columns
- **CRUD operations** via REST API
- **Auto-refresh** every 30 seconds
- **Responsive** mobile-first design
- **Nginx** with SPA fallback and API reverse proxy
- **Non-root container** via nginx-unprivileged

## Development

```bash
npm install
npm run dev     # http://localhost:5173 (proxies /api to :8080)
npm run lint
npm test
npm run build
```

## Architecture

In production, nginx serves the SPA and proxies `/api/*` to the backend service via K8s DNS. All traffic is secured with Linkerd mTLS automatically.
