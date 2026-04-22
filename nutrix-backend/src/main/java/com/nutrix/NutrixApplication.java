package com.nutrix;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NutrixApplication {

    public static void main(String[] args) {
        // Carregar variáveis do arquivo .env.local
        Dotenv dotenv = Dotenv.configure()
                .filename(".env.local")
                .ignoreIfMissing()
                .load();
        
        // Debug: mostrar se o arquivo foi carregado
        System.out.println("=== NUTRIX - Carregando configurações ===");
        System.out.println("Arquivo .env.local encontrado: " + (dotenv.entries().size() > 0));
        
        // Definir as variáveis de ambiente para o Spring Boot
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
            // Debug: mostrar variáveis carregadas (sem mostrar senha completa)
            if (entry.getKey().contains("PASSWORD")) {
                System.out.println("Carregado: " + entry.getKey() + "=***");
            } else {
                System.out.println("Carregado: " + entry.getKey() + "=" + entry.getValue());
            }
        });
        
        System.out.println("==========================================");
        
        SpringApplication.run(NutrixApplication.class, args);
    }
}
