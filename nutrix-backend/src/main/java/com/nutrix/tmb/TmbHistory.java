package com.nutrix.tmb;

import com.nutrix.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "tmb_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmbHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "height_cm", nullable = false, precision = 6, scale = 2)
    private BigDecimal heightCm;

    @Column(name = "age_years", nullable = false)
    private Integer ageYears;

    @Column(name = "biological_sex", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private BiologicalSex biologicalSex;

    @Column(name = "activity_level", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Column(name = "tmb_kcal", nullable = false, precision = 10, scale = 2)
    private BigDecimal tmbKcal;

    @Column(name = "tdee_kcal", nullable = false, precision = 10, scale = 2)
    private BigDecimal tdeeKcal;

    @Column(name = "calculated_at", nullable = false)
    private Instant calculatedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = Instant.now();
    }
}
