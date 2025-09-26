# EmployeeReact/frontend.Dockerfile

# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all application files
COPY . .

# Run the build command
# VITE will replace VITE_API_URL with the value provided during this build stage.
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine
# Copy the built files from the build stage to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the standard HTTP port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]