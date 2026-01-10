FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy everything
COPY . .

# Move into actual Spring Boot project folder
WORKDIR /app/helpdesk

# Give permission to mvnw
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose correct port
EXPOSE 8081

# Run the JAR
CMD ["java", "-jar", "target/*.jar"]
