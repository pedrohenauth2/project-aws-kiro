import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TmbService, TmbHistory } from '../../../core/services/tmb.service';
import { ToastService } from '../../../core/services/toast.service';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendIndicator {
  direction: TrendDirection;
  delta: number;
}

export function calculateTrend(current: number, previous: number): TrendIndicator {
  const delta = current - previous;
  if (Math.abs(delta) < 1) return { direction: 'stable', delta: 0 };
  return { direction: delta > 0 ? 'up' : 'down', delta: Math.abs(delta) };
}

@Component({
  selector: 'app-tmb-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tmb-history.component.html',
  styleUrls: ['./tmb-history.component.scss']
})
export class TmbHistoryComponent implements OnInit {
  private tmbService = inject(TmbService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  history: TmbHistory[] = [];
  isLoading: boolean = true;

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

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.tmbService.getHistory().subscribe({
      next: (data) => {
        this.history = this.getSortedHistory(data);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.message || 'Erro ao carregar histórico.';
        this.toastService.showError(errorMessage);
      }
    });
  }

  getSortedHistory(data: TmbHistory[] = this.history): TmbHistory[] {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.calculatedAt).getTime();
      const dateB = new Date(b.calculatedAt).getTime();
      return dateB - dateA;
    });
  }

  getActivityLabel(activityLevel: string): string {
    return this.activityLevelLabels[activityLevel] || activityLevel;
  }

  getSexLabel(biologicalSex: string): string {
    return this.biologicalSexLabels[biologicalSex] || biologicalSex;
  }

  getTrend(index: number): TrendIndicator | null {
    if (index === 0 || index >= this.history.length) return null;
    const current = this.history[index].tdeeKcal;
    const previous = this.history[index + 1].tdeeKcal;
    return calculateTrend(current, previous);
  }

  getTrendEmoji(trend: TrendIndicator | null): string {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
    }
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

  newCalculation(): void {
    this.router.navigate(['/tmb']);
  }

  trackByHistoryId(index: number, record: TmbHistory): number {
    return record.id;
  }

  resetHistory(): void {
    if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
      // Aqui você pode adicionar uma chamada ao backend para deletar o histórico
      this.history = [];
      this.toastService.showSuccess('Histórico limpo com sucesso!');
    }
  }
}
