# EmployeeManagement/backend.Dockerfile

# Stage 1: Build the Java application
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Maven wrapper files (from your project structure)
COPY mvnw .
COPY .mvn/ .mvn
COPY pom.xml ./
COPY src ./src

# Make the wrapper executable
RUN chmod +x mvnw

# Package the application (skipping tests for faster build)
# The JAR name is EmployeeManagement-0.0.1-SNAPSHOT.jar (from pom.xml)
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the final production image
# Use a smaller JRE image for runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/EmployeeManagement-0.0.1-SNAPSHOT.jar app.jar

# Expose the Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]