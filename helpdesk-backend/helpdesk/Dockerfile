FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy everything from build context (already helpdesk/)
COPY . .

# Give permission to Maven wrapper
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose Render port
EXPOSE 10000

# Run the app
CMD ["java", "-jar", "target/helpdesk-0.0.1-SNAPSHOT.jar"]
