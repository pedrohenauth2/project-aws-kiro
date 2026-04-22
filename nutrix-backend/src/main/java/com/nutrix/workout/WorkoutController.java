package com.nutrix.workout;

import com.nutrix.workout.dto.WorkoutPlanDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout/plans")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @GetMapping
    public ResponseEntity<List<WorkoutPlanDto>> getAllPlans(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        List<WorkoutPlanDto> plans = workoutService.getAllPlans(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/latest")
    public ResponseEntity<WorkoutPlanDto> getLatestPlan(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return workoutService.getLatestPlan(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WorkoutPlanDto> createPlan(
            @Valid @RequestBody WorkoutPlanDto dto,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        WorkoutPlanDto created = workoutService.createPlan(dto, userId);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutPlanDto> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutPlanDto dto,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        WorkoutPlanDto updated = workoutService.updatePlan(id, dto, userId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        workoutService.deletePlan(id, userId);
        return ResponseEntity.noContent().build();
    }
}
