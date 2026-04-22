import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseService, MuscleGroupWithExercises, Exercise, ExerciseVariation } from '../../../core/services/exercise.service';
import { ToastService } from '../../../core/services/toast.service';

export interface SelectedExercise {
  exerciseId: number;
  exerciseName: string;
  exerciseVariationId?: number;
  exerciseVariationName?: string;
}

@Component({
  selector: 'app-exercise-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-picker.component.html',
  styleUrls: ['./exercise-picker.component.scss']
})
export class ExercisePickerComponent implements OnInit {
  @Output() exerciseSelected = new EventEmitter<SelectedExercise>();
  @Output() cancelled = new EventEmitter<void>();

  private exerciseService = inject(ExerciseService);
  private toastService = inject(ToastService);

  muscleGroups: MuscleGroupWithExercises[] = [];
  selectedMuscleGroupId: number | null = null;
  selectedExercise: Exercise | null = null;
  selectedVariationId: number | null = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadMuscleGroups();
  }

  loadMuscleGroups(): void {
    this.isLoading = true;
    this.exerciseService.getAllGrouped().subscribe({
      next: (data) => {
        this.muscleGroups = data;
        this.isLoading = false;
        if (data.length > 0) {
          this.selectedMuscleGroupId = data[0].id;
        }
      },
      error: () => {
        this.isLoading = false;
        this.toastService.showError('Erro ao carregar exercícios');
      }
    });
  }

  selectMuscleGroup(groupId: number): void {
    this.selectedMuscleGroupId = groupId;
    this.selectedExercise = null;
    this.selectedVariationId = null;
  }

  getSelectedMuscleGroup(): MuscleGroupWithExercises | undefined {
    return this.muscleGroups.find(g => g.id === this.selectedMuscleGroupId);
  }

  selectExercise(exercise: Exercise): void {
    this.selectedExercise = exercise;
    this.selectedVariationId = null;
  }

  selectVariation(variationId: number): void {
    this.selectedVariationId = variationId;
  }

  confirmSelection(): void {
    if (!this.selectedExercise) {
      this.toastService.showError('Selecione um exercício');
      return;
    }

    const selection: SelectedExercise = {
      exerciseId: this.selectedExercise.id,
      exerciseName: this.selectedExercise.name
    };

    if (this.selectedVariationId) {
      const variation = this.selectedExercise.variations.find(v => v.id === this.selectedVariationId);
      if (variation) {
        selection.exerciseVariationId = variation.id;
        selection.exerciseVariationName = variation.name;
      }
    }

    this.exerciseSelected.emit(selection);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
