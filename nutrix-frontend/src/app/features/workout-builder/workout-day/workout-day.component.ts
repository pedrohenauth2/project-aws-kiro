import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkoutDay, ExerciseEntry } from '../../../core/services/workout.service';
import { ExercisePickerComponent, SelectedExercise } from '../exercise-picker/exercise-picker.component';

@Component({
  selector: 'app-workout-day',
  standalone: true,
  imports: [CommonModule, FormsModule, ExercisePickerComponent],
  templateUrl: './workout-day.component.html',
  styleUrls: ['./workout-day.component.scss']
})
export class WorkoutDayComponent {
  @Input() day!: WorkoutDay;
  @Output() dayChanged = new EventEmitter<WorkoutDay>();

  showExercisePicker: boolean = false;
  editingEntry: ExerciseEntry | null = null;

  openExercisePicker(): void {
    this.showExercisePicker = true;
  }

  closeExercisePicker(): void {
    this.showExercisePicker = false;
  }

  onExerciseSelected(selected: SelectedExercise): void {
    const newEntry: ExerciseEntry = {
      exerciseId: selected.exerciseId,
      exerciseName: selected.exerciseName,
      exerciseVariationId: selected.exerciseVariationId,
      exerciseVariationName: selected.exerciseVariationName,
      sets: 3,
      reps: 12,
      sortOrder: this.day.entries.length
    };

    this.day.entries.push(newEntry);
    this.showExercisePicker = false;
    this.dayChanged.emit(this.day);
  }

  removeEntry(index: number): void {
    if (confirm('Deseja remover este exercício?')) {
      this.day.entries.splice(index, 1);
      this.updateSortOrder();
      this.dayChanged.emit(this.day);
    }
  }

  moveEntryUp(index: number): void {
    if (index > 0) {
      const temp = this.day.entries[index];
      this.day.entries[index] = this.day.entries[index - 1];
      this.day.entries[index - 1] = temp;
      this.updateSortOrder();
      this.dayChanged.emit(this.day);
    }
  }

  moveEntryDown(index: number): void {
    if (index < this.day.entries.length - 1) {
      const temp = this.day.entries[index];
      this.day.entries[index] = this.day.entries[index + 1];
      this.day.entries[index + 1] = temp;
      this.updateSortOrder();
      this.dayChanged.emit(this.day);
    }
  }

  updateSortOrder(): void {
    this.day.entries.forEach((entry, index) => {
      entry.sortOrder = index;
    });
  }

  onEntryChanged(): void {
    this.dayChanged.emit(this.day);
  }

  getExerciseDisplayName(entry: ExerciseEntry): string {
    if (entry.exerciseVariationName) {
      return `${entry.exerciseName} - ${entry.exerciseVariationName}`;
    }
    return entry.exerciseName || 'Sem nome';
  }
}