package com.hospital.users;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      USERS SERVICE APPLICATION                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Entry point for the Users & Roles microservice.                             ║
 * ║                                                                              ║
 * ║  @EnableDiscoveryClient: Registers this service with Eureka                  ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                       ║
 * ║  Port: 8086 (see application.yml)                                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@SpringBootApplication
@EnableDiscoveryClient
public class UsersServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UsersServiceApplication.class, args);
    }
}
