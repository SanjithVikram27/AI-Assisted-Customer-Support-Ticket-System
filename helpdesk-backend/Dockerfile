FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy Maven wrapper and pom from helpdesk folder
COPY helpdesk/mvnw .
COPY helpdesk/.mvn .mvn
COPY helpdesk/pom.xml .

# Give execute permission
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY helpdesk/src src

# Build the application
RUN ./mvnw clean package -DskipTests

EXPOSE 8081

CMD ["java", "-jar", "target/*.jar"]
