FROM maven:3.8-openjdk-17 as build
WORKDIR /app

COPY pom.xml .
COPY src/ ./src/

# Skip tests temporarily
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]