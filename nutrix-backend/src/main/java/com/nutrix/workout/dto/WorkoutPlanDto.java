package com.nutrix.workout.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutPlanDto {
    
    private Long id;
    
    @NotBlank(message = "Nome do plano é obrigatório")
    private String name;
    
    private Instant createdAt;
    private Instant updatedAt;
    
    @Valid
    private List<WorkoutDayDto> days;
}
