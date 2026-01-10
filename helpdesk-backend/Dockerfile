FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy entire backend project
COPY . .

# Give permission to Maven wrapper
RUN chmod +x mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose correct port
EXPOSE 8081

# Run the JAR
CMD ["java", "-jar", "target/*.jar"]
