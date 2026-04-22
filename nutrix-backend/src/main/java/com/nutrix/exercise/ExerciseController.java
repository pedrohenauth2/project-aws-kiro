package com.nutrix.exercise;

import com.nutrix.exercise.dto.ExerciseDto;
import com.nutrix.exercise.dto.MuscleGroupWithExercisesDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<?> getExercises(@RequestParam(required = false) Long muscleGroupId) {
        if (muscleGroupId != null) {
            List<ExerciseDto> exercises = exerciseService.getByMuscleGroup(muscleGroupId);
            return ResponseEntity.ok(exercises);
        } else {
            List<MuscleGroupWithExercisesDto> groupedExercises = exerciseService.getAllGroupedByMuscleGroup();
            return ResponseEntity.ok(groupedExercises);
        }
    }
}
