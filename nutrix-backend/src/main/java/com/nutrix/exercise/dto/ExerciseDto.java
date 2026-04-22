package com.nutrix.exercise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDto {
    
    private Long id;
    private String name;
    private String description;
    private List<ExerciseVariationDto> variations;
}
