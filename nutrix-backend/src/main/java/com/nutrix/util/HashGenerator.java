package com.nutrix.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitário temporário para gerar hash bcrypt de senhas.
 * Execute com: mvn exec:java -Dexec.mainClass="com.nutrix.util.HashGenerator"
 */
public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String[] passwords = {"senha123", "admin123", "nutrix123"};
        
        for (String password : passwords) {
            String hash = encoder.encode(password);
            System.out.println("Senha: " + password);
            System.out.println("Hash:  " + hash);
            System.out.println("---");
        }
    }
}
