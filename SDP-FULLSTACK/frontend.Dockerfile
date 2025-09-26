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

# Copy the Nginx configuration file from the SDP-FULLSTACK directory
COPY SDP-FULLSTACK/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
