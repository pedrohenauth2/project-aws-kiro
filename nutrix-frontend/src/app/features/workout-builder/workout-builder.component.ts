import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutService, WorkoutPlan, WorkoutDay } from '../../core/services/workout.service';
import { ToastService } from '../../core/services/toast.service';
import { WorkoutDayComponent } from './workout-day/workout-day.component';

@Component({
  selector: 'app-workout-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, WorkoutDayComponent],
  templateUrl: './workout-builder.component.html',
  styleUrls: ['./workout-builder.component.scss']
})
export class WorkoutBuilderComponent implements OnInit {
  currentPlan: WorkoutPlan | null = null;
  selectedDayIndex: number = 0;
  isLoading: boolean = true;
  isSaving: boolean = false;
  hasChanges: boolean = false;

  daysOfWeek = [
    { dayOfWeek: 1, label: 'Segunda-feira' },
    { dayOfWeek: 2, label: 'Terça-feira' },
    { dayOfWeek: 3, label: 'Quarta-feira' },
    { dayOfWeek: 4, label: 'Quinta-feira' },
    { dayOfWeek: 5, label: 'Sexta-feira' },
    { dayOfWeek: 6, label: 'Sábado' },
    { dayOfWeek: 7, label: 'Domingo' }
  ];

  constructor(
    private workoutService: WorkoutService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLatestPlan();
  }

  loadLatestPlan(): void {
    this.isLoading = true;
    this.workoutService.getLatestPlan().subscribe({
      next: (plan) => {
        this.currentPlan = plan;
        this.isLoading = false;
      },
      error: () => {
        // Nenhum plano encontrado, criar novo
        this.createNewPlan();
        this.isLoading = false;
      }
    });
  }

  createNewPlan(): void {
    if (this.currentPlan && this.hasUnsavedChanges()) {
      if (!confirm('Você tem alterações não salvas. Deseja criar um novo treino?')) {
        return;
      }
    }

    this.currentPlan = {
      name: 'Meu Treino',
      days: this.daysOfWeek.map(day => ({
        dayOfWeek: day.dayOfWeek,
        label: day.label,
        entries: []
      }))
    };
  }

  hasUnsavedChanges(): boolean {
    return this.hasChanges;
  }

  markAsChanged(): void {
    this.hasChanges = true;
  }

  markAsSaved(): void {
    this.hasChanges = false;
  }

  selectDay(index: number): void {
    this.selectedDayIndex = index;
  }

  getCurrentDay(): WorkoutDay | null {
    if (!this.currentPlan || !this.currentPlan.days) {
      return null;
    }
    return this.currentPlan.days[this.selectedDayIndex] || null;
  }

  onDayChanged(updatedDay: WorkoutDay): void {
    if (this.currentPlan && this.currentPlan.days) {
      this.currentPlan.days[this.selectedDayIndex] = updatedDay;
      this.markAsChanged();
    }
  }

  savePlan(): void {
    if (!this.currentPlan) {
      this.toastService.showError('Nenhum plano para salvar');
      return;
    }

    if (!this.currentPlan.name || this.currentPlan.name.trim() === '') {
      this.toastService.showError('Por favor, dê um nome ao seu treino');
      return;
    }

    this.isSaving = true;

    if (this.currentPlan.id) {
      // Atualizar plano existente
      this.workoutService.updatePlan(this.currentPlan.id, this.currentPlan).subscribe({
        next: (updatedPlan) => {
          this.currentPlan = updatedPlan;
          this.isSaving = false;
          this.markAsSaved();
          this.toastService.showSuccess('Treino atualizado com sucesso!');
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Erro ao atualizar treino');
        }
      });
    } else {
      // Criar novo plano
      this.workoutService.createPlan(this.currentPlan).subscribe({
        next: (createdPlan) => {
          this.currentPlan = createdPlan;
          this.isSaving = false;
          this.markAsSaved();
          this.toastService.showSuccess('Treino salvo com sucesso!');
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Erro ao salvar treino');
        }
      });
    }
  }

  goBack(): void {
    if (this.hasUnsavedChanges()) {
      this.toastService.showInfo('Você tem alterações não salvas. Salve antes de sair.');
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getTotalExercises(): number {
    if (!this.currentPlan) return 0;
    return this.currentPlan.days.reduce((total, day) => total + day.entries.length, 0);
  }

  getDayExerciseCount(dayIndex: number): number {
    if (!this.currentPlan || !this.currentPlan.days[dayIndex]) return 0;
    return this.currentPlan.days[dayIndex].entries.length;
  }
}
