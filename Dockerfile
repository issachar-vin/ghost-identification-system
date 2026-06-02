# ── base: shared npm install ───────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── dev: Vite dev server — source is bind-mounted at runtime ──────────────────
FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# ── builder: compile production assets ────────────────────────────────────────
FROM base AS builder
COPY . .
RUN npm run build

# ── prod: nginx serving compiled assets ───────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
