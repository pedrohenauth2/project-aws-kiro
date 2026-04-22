package com.nutrix.tmb.dto;

import com.nutrix.tmb.ActivityLevel;
import com.nutrix.tmb.BiologicalSex;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmbRequestDto {

    @NotNull(message = "Peso é obrigatório")
    @Positive(message = "Peso deve ser maior que zero")
    private BigDecimal weightKg;

    @NotNull(message = "Altura é obrigatória")
    @Positive(message = "Altura deve ser maior que zero")
    private BigDecimal heightCm;

    @NotNull(message = "Idade é obrigatória")
    @Min(value = 1, message = "Idade deve ser no mínimo 1 ano")
    @Max(value = 120, message = "Idade deve ser no máximo 120 anos")
    private Integer ageYears;

    @NotNull(message = "Sexo biológico é obrigatório")
    private BiologicalSex biologicalSex;

    @NotNull(message = "Nível de atividade é obrigatório")
    private ActivityLevel activityLevel;
}
