package com.nutrix;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class NutrixApplicationTests {

    @Test
    void contextLoads() {
        // Verifica que o contexto Spring carrega corretamente
    }
}
