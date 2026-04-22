package com.nutrix.exercise.dto;

import java.util.List;

public record ExerciseDto(
    Long id,
    String name,
    String description,
    List<ExerciseVariationDto> variations
) {}
