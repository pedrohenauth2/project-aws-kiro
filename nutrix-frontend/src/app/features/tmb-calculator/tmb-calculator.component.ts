import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TmbService, TmbRequest, TmbResponse, TmbHistory } from '../../core/services/tmb.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-tmb-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tmb-calculator.component.html',
  styleUrls: ['./tmb-calculator.component.scss']
})
export class TmbCalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tmbService = inject(TmbService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  tmbForm: FormGroup;
  result: TmbResponse | null = null;
  showSavePrompt: boolean = false;
  isLoading: boolean = false;
  recentHistory: TmbHistory[] = [];

  activityLevels = [
    { value: 'SEDENTARY', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'LIGHTLY_ACTIVE', label: 'Levemente Ativo (exercício leve 1-3 dias/semana)' },
    { value: 'MODERATELY_ACTIVE', label: 'Moderadamente Ativo (exercício moderado 3-5 dias/semana)' },
    { value: 'VERY_ACTIVE', label: 'Muito Ativo (exercício intenso 6-7 dias/semana)' },
    { value: 'EXTREMELY_ACTIVE', label: 'Extremamente Ativo (exercício muito intenso, atleta)' }
  ];

  activityLevelLabels: { [key: string]: string } = {
    'SEDENTARY': 'Sedentário',
    'LIGHTLY_ACTIVE': 'Levemente Ativo',
    'MODERATELY_ACTIVE': 'Moderadamente Ativo',
    'VERY_ACTIVE': 'Muito Ativo',
    'EXTREMELY_ACTIVE': 'Extremamente Ativo'
  };

  biologicalSexLabels: { [key: string]: string } = {
    'MALE': 'Masculino',
    'FEMALE': 'Feminino'
  };

  constructor() {
    this.tmbForm = this.fb.group({
      weightKg: ['', [Validators.required, Validators.min(0.1)]],
      heightCm: ['', [Validators.required, Validators.min(0.1)]],
      ageYears: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      biologicalSex: ['', Validators.required],
      activityLevel: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRecentHistory();
  }

  loadRecentHistory(): void {
    this.tmbService.getHistory().subscribe({
      next: (data) => {
        // Sort by date descending and take first 3
        this.recentHistory = data
          .sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime())
          .slice(0, 3);
      },
      error: () => {
        // Silently fail - recent history is optional
        this.recentHistory = [];
      }
    });
  }

  onSubmit(): void {
    if (this.tmbForm.invalid) {
      return;
    }

    this.isLoading = true;
    const request: TmbRequest = this.tmbForm.value;

    this.tmbService.calculate(request).subscribe({
      next: (response) => {
        this.result = response;
        this.showSavePrompt = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Erro ao calcular TMB. Tente novamente.';
        this.toastService.showError(errorMessage);
      }
    });
  }

  saveToHistory(): void {
    const request: TmbRequest = this.tmbForm.value;
    this.tmbService.saveHistory(request).subscribe({
      next: () => {
        this.showSavePrompt = false;
        this.toastService.showSuccess('Resultado salvo no histórico!');
        setTimeout(() => {
          this.newCalculation();
        }, 1500);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Erro ao salvar no histórico.';
        this.toastService.showError(errorMessage);
      }
    });
  }

  skipSave(): void {
    this.showSavePrompt = false;
  }

  viewHistory(): void {
    this.router.navigate(['/tmb/history']);
  }

  newCalculation(): void {
    this.result = null;
    this.showSavePrompt = false;
    this.tmbForm.reset();
  }

  getActivityLabel(activityLevel: string): string {
    return this.activityLevelLabels[activityLevel] || activityLevel;
  }

  getSexLabel(biologicalSex: string): string {
    return this.biologicalSexLabels[biologicalSex] || biologicalSex;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByHistoryId(index: number, record: TmbHistory): number {
    return record.id;
  }
}
