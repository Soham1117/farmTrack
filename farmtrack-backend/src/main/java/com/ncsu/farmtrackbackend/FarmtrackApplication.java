package com.ncsu.farmtrackbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.ncsu.farmtrackbackend.repository")
public class FarmtrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(FarmtrackApplication.class, args);
	}
}
