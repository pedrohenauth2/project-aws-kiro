package com.nutrix.workout;

import com.nutrix.user.User;
import com.nutrix.user.UserRepository;
import com.nutrix.workout.dto.ExerciseEntryDto;
import com.nutrix.workout.dto.WorkoutDayDto;
import com.nutrix.workout.dto.WorkoutPlanDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<WorkoutPlanDto> getLatestPlan(Long userId) {
        return workoutPlanRepository.findFirstByUserIdOrderByUpdatedAtDesc(userId)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public List<WorkoutPlanDto> getAllPlans(Long userId) {
        return workoutPlanRepository.findByUserIdOrderByUpdatedAtDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkoutPlanDto createPlan(WorkoutPlanDto dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        WorkoutPlan plan = new WorkoutPlan();
        plan.setUser(user);
        plan.setName(dto.getName());

        if (dto.getDays() != null) {
            for (WorkoutDayDto dayDto : dto.getDays()) {
                WorkoutDay day = toEntity(dayDto, plan);
                plan.getDays().add(day);
            }
        }

        WorkoutPlan saved = workoutPlanRepository.save(plan);
        return toDto(saved);
    }

    @Transactional
    public WorkoutPlanDto updatePlan(Long planId, WorkoutPlanDto dto, Long userId) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));

        if (!plan.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado");
        }

        plan.setName(dto.getName());
        
        // Delete all existing days for this plan
        workoutDayRepository.deleteByWorkoutPlanId(planId);
        plan.getDays().clear();

        if (dto.getDays() != null) {
            for (WorkoutDayDto dayDto : dto.getDays()) {
                WorkoutDay day = toEntity(dayDto, plan);
                plan.getDays().add(day);
            }
        }

        WorkoutPlan updated = workoutPlanRepository.save(plan);
        return toDto(updated);
    }

    @Transactional
    public void deletePlan(Long planId, Long userId) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));

        if (!plan.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Acesso negado");
        }

        workoutPlanRepository.delete(plan);
    }

    private WorkoutPlanDto toDto(WorkoutPlan plan) {
        List<WorkoutDayDto> dayDtos = plan.getDays().stream()
                .map(this::toDayDto)
                .collect(Collectors.toList());

        return new WorkoutPlanDto(
                plan.getId(),
                plan.getName(),
                plan.getCreatedAt(),
                plan.getUpdatedAt(),
                dayDtos
        );
    }

    private WorkoutDayDto toDayDto(WorkoutDay day) {
        List<ExerciseEntryDto> entryDtos = day.getEntries().stream()
                .map(this::toEntryDto)
                .collect(Collectors.toList());

        return new WorkoutDayDto(
                day.getId(),
                day.getDayOfWeek(),
                day.getLabel(),
                entryDtos
        );
    }

    private ExerciseEntryDto toEntryDto(ExerciseEntry entry) {
        return new ExerciseEntryDto(
                entry.getId(),
                entry.getExerciseId(),
                entry.getExerciseName(),
                entry.getExerciseVariationId(),
                entry.getExerciseVariationName(),
                entry.getSets(),
                entry.getReps(),
                entry.getWeightKg(),
                entry.getSortOrder(),
                entry.getNotes()
        );
    }

    private WorkoutDay toEntity(WorkoutDayDto dto, WorkoutPlan plan) {
        WorkoutDay day = new WorkoutDay();
        day.setWorkoutPlan(plan);
        day.setDayOfWeek(dto.getDayOfWeek());
        day.setLabel(dto.getLabel());

        if (dto.getEntries() != null) {
            for (ExerciseEntryDto entryDto : dto.getEntries()) {
                ExerciseEntry entry = toEntryEntity(entryDto, day);
                day.getEntries().add(entry);
            }
        }

        return day;
    }

    private ExerciseEntry toEntryEntity(ExerciseEntryDto dto, WorkoutDay day) {
        ExerciseEntry entry = new ExerciseEntry();
        entry.setWorkoutDay(day);
        entry.setExerciseId(dto.getExerciseId());
        entry.setExerciseName(dto.getExerciseName());
        entry.setExerciseVariationId(dto.getExerciseVariationId());
        entry.setExerciseVariationName(dto.getExerciseVariationName());
        entry.setSets(dto.getSets());
        entry.setReps(dto.getReps());
        entry.setWeightKg(dto.getWeightKg());
        entry.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        entry.setNotes(dto.getNotes());

        return entry;
    }
}