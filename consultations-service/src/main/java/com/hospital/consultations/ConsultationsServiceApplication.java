package com.hospital.consultations;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                   CONSULTATIONS SERVICE APPLICATION                           ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Entry point for the Consultations microservice.                              ║
 * ║                                                                              ║
 * ║  @EnableDiscoveryClient: Registers this service with Eureka                    ║
 * ║  @EnableFeignClients: Allows calling other microservices                     ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                       ║
 * ║  Port: 8087 (see application.yml)                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ConsultationsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsultationsServiceApplication.class, args);
    }
}
