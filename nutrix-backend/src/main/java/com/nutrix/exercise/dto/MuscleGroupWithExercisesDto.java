package com.nutrix.exercise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MuscleGroupWithExercisesDto {
    
    private Long id;
    private String name;
    private List<ExerciseDto> exercises;
}
