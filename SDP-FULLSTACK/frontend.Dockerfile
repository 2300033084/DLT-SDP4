# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files from the EmployeeReact directory
COPY EmployeeReact/package*.json ./
RUN npm install

# Copy all source code from the EmployeeReact directory
COPY EmployeeReact/ ./
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built assets from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Create a new configuration file that's suitable for a Single Page Application (SPA)
# This configuration ensures that all routes are directed to index.html
RUN echo "server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

