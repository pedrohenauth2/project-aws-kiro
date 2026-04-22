import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  constructor() { }

  showSuccess(message: string): void {
    this.addToast('success', message);
  }

  showError(message: string): void {
    this.addToast('error', message);
  }

  showInfo(message: string): void {
    this.addToast('info', message);
  }

  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  private addToast(type: Toast['type'], message: string): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      createdAt: Date.now()
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Schedule automatic removal after 4000ms
    setTimeout(() => {
      this.dismiss(toast.id);
    }, 4000);
  }

  private generateId(): string {
    // Use crypto.randomUUID() if available, fallback to Date.now().toString()
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}