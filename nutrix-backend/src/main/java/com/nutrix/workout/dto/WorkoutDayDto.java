package com.nutrix.workout.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDayDto {
    
    private Long id;
    
    @NotNull(message = "Dia da semana é obrigatório")
    @Min(value = 1, message = "Dia da semana deve ser entre 1 e 7")
    @Max(value = 7, message = "Dia da semana deve ser entre 1 e 7")
    private Integer dayOfWeek;
    
    private String label;
    
    @Valid
    private List<ExerciseEntryDto> entries;
}
