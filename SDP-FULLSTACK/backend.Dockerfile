# Stage 1: Build the app
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy files from the EmployeeManagement directory in the build context
COPY EmployeeManagement/mvnw .
COPY EmployeeManagement/.mvn/ .mvn
COPY EmployeeManagement/pom.xml .
COPY EmployeeManagement/src ./src

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:21-jdk

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# The application runs on port 8080 as defined in application.properties
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
