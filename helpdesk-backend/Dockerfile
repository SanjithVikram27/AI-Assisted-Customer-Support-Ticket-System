FROM eclipse-temurin:17-jdk

# Go inside backend module
WORKDIR /app

# Copy only backend folder
COPY helpdesk ./helpdesk

# Move into the actual Spring Boot project
WORKDIR /app/helpdesk

# Give permission to Maven wrapper
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Build the app
RUN ./mvnw clean package -DskipTests

# App runs on 8081
EXPOSE 8081

# Run the jar
CMD ["java", "-jar", "target/helpdesk-0.0.1-SNAPSHOT.jar"]
