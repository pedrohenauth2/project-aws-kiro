import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toastService.toasts$ | async; trackBy: trackByToastId"
        class="toast"
        [ngClass]="'toast--' + toast.type"
        (click)="onToastClick(toast.id)"
      >
        <div class="toast__icon">
          <span [innerHTML]="getToastIcon(toast.type)"></span>
        </div>
        <div class="toast__message">
          {{ toast.message }}
        </div>
        <button 
          class="toast__close"
          (click)="onToastClick(toast.id)"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  toastService = inject(ToastService);

  onToastClick(toastId: string): void {
    this.toastService.dismiss(toastId);
  }

  getToastIcon(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }

  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }
}