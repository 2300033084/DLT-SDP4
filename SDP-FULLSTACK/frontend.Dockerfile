# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Context is project root, so paths include the folder names
COPY SDP-Frontend/package*.json ./
RUN npm install

# Optional: may not exist in all installs; ignore failure
RUN chmod +x node_modules/.bin/vite || true

COPY SDP-Frontend/ ./
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# nginx.conf lives in SDP-FULLSTACK (visible because context is project root)
COPY SDP-FULLSTACK/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]