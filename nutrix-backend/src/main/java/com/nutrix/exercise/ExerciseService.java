package com.nutrix.exercise;

import com.nutrix.exercise.dto.ExerciseDto;
import com.nutrix.exercise.dto.MuscleGroupWithExercisesDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço de exercícios que retorna dados estáticos.
 * Os exercícios são gerenciados no código, não no banco de dados.
 */
@Service
public class ExerciseService {

    public List<MuscleGroupWithExercisesDto> getAllGroupedByMuscleGroup() {
        return ExerciseData.getAllExercises();
    }

    public List<ExerciseDto> getByMuscleGroup(Long muscleGroupId) {
        return ExerciseData.getAllExercises().stream()
                .filter(group -> group.getId().equals(muscleGroupId))
                .findFirst()
                .map(MuscleGroupWithExercisesDto::getExercises)
                .orElse(List.of());
    }
}
