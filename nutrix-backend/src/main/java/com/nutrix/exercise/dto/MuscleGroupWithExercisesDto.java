package com.nutrix.exercise.dto;

import java.util.List;

public record MuscleGroupWithExercisesDto(
    Long id,
    String name,
    List<ExerciseDto> exercises
) {}
