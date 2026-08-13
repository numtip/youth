# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Serve the Astro static output. No Node.js in this image.
COPY --from=build /app/dist /usr/share/nginx/html

# Minimal nginx config: serve subdirectory index.html files (e.g. /activities/2569/biochar-brand/index.html),
# resolve hashed _astro assets, and fall back to the site's own 404 page for unknown paths.
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /404.html;
    }
}
EOF

EXPOSE 80
