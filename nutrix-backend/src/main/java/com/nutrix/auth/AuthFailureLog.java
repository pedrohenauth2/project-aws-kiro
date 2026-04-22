package com.nutrix.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "auth_failure_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthFailureLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username_attempted", nullable = false, length = 150)
    private String usernameAttempted;

    @Column(name = "attempted_at", nullable = false)
    private Instant attemptedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        attemptedAt = Instant.now();
    }
}
