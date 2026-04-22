package com.nutrix.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, Long> {
    @Modifying
    @Query("DELETE FROM WorkoutDay w WHERE w.workoutPlan.id = :workoutPlanId")
    void deleteByWorkoutPlanId(Long workoutPlanId);
}


