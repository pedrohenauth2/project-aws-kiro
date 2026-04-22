package com.nutrix.workout.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseEntryDto {
    
    private Long id;
    
    @NotNull(message = "Exercise ID é obrigatório")
    private Long exerciseId;
    
    private String exerciseName;
    
    private Long exerciseVariationId;
    
    private String exerciseVariationName;
    
    @NotNull(message = "Séries são obrigatórias")
    @Positive(message = "Séries devem ser maior que zero")
    private Integer sets;
    
    @NotNull(message = "Repetições são obrigatórias")
    @Positive(message = "Repetições devem ser maior que zero")
    private Integer reps;
    
    private BigDecimal weightKg;
    private Integer sortOrder;
    private String notes;
}
