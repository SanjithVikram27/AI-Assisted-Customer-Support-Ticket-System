FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src
COPY helpdesk helpdesk

# Build jar
RUN ./mvnw clean package -DskipTests

EXPOSE 8081

CMD ["java", "-jar", "helpdesk/target/*.jar"]
