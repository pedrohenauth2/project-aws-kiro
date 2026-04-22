import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

export function getGreetingPeriod(hour: number): GreetingPeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  fullName: string = '';
  greetingPeriod: GreetingPeriod = 'morning';
  greetingEmoji: string = '🌅';
  currentSlide: number = 0;

  features = [
    {
      title: 'Calculadora de TMB',
      description: 'Calcule sua Taxa Metabólica Basal e gasto calórico diário',
      icon: 'fire',
      route: '/tmb',
      active: true,
      gradient: 'gradient-primary'
    },
    {
      title: 'Montador de Treino',
      description: 'Monte seu plano de treino semanal personalizado',
      icon: 'dumbbell',
      route: '/workout',
      active: true,
      gradient: 'gradient-primary'
    },
    {
      title: 'Nutrição Inteligente',
      description: 'Planejamento nutricional personalizado',
      icon: 'apple',
      route: '',
      active: false,
      gradient: ''
    },
    {
      title: 'Exames de Bioimpedância',
      description: 'Cadastre e acompanhe seus exames',
      icon: 'chart',
      route: '',
      active: false,
      gradient: ''
    }
  ];

  constructor() {
    this.fullName = this.authService.getFullName() || this.authService.getUsername() || 'Bem-vindo';
    this.updateGreeting();
  }

  private updateGreeting(): void {
    const hour = new Date().getHours();
    this.greetingPeriod = getGreetingPeriod(hour);
    
    switch (this.greetingPeriod) {
      case 'morning':
        this.greetingEmoji = '🌅';
        break;
      case 'afternoon':
        this.greetingEmoji = '☀️';
        break;
      case 'evening':
        this.greetingEmoji = '🌙';
        break;
    }
  }

  getGreetingText(): string {
    const greetings = {
      morning: 'Bom dia',
      afternoon: 'Boa tarde',
      evening: 'Boa noite'
    };
    return greetings[this.greetingPeriod];
  }

  onCardClick(feature: any): void {
    if (feature.active) {
      this.router.navigate([feature.route]);
    } else {
      this.toastService.showInfo('Funcionalidade disponível em breve!');
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.features.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.features.length) % this.features.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  trackByFeature(index: number, feature: any): string {
    return feature.title;
  }

  getIconSvg(iconName: string): SafeHtml {
    const icons: Record<string, string> = {
      fire: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f97316;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow3d">
            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g filter="url(#shadow3d)">
          <path d="M50 20C40 35 35 45 35 55C35 70 42 80 50 80C58 80 65 70 65 55C65 45 60 35 50 20Z" fill="url(#fireGrad)"/>
          <path d="M45 50C45 55 47 60 50 62C53 60 55 55 55 50C55 45 52 40 50 38C48 40 45 45 45 50Z" fill="#fef3c7" opacity="0.6"/>
        </g>
      </svg>`,
      dumbbell: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dumbbellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow3d2">
            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g filter="url(#shadow3d2)">
          <rect x="15" y="40" width="12" height="20" rx="2" fill="url(#dumbbellGrad)"/>
          <rect x="73" y="40" width="12" height="20" rx="2" fill="url(#dumbbellGrad)"/>
          <rect x="30" y="45" width="40" height="10" rx="2" fill="#94a3b8"/>
          <circle cx="35" cy="50" r="3" fill="#cbd5e1"/>
          <circle cx="65" cy="50" r="3" fill="#cbd5e1"/>
        </g>
      </svg>`,
      apple: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="appleGrad" cx="35%" cy="35%">
            <stop offset="0%" style="stop-color:#4ade80;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#15803d;stop-opacity:1" />
          </radialGradient>
          <filter id="shadow3d3">
            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g filter="url(#shadow3d3)">
          <circle cx="50" cy="55" r="28" fill="url(#appleGrad)"/>
          <ellipse cx="40" cy="40" rx="12" ry="16" fill="rgba(255,255,255,0.3)"/>
          <rect x="48" y="20" width="4" height="12" fill="#92400e" rx="2"/>
          <ellipse cx="58" cy="25" rx="7" ry="4" fill="#22c55e" transform="rotate(-30 58 25)"/>
        </g>
      </svg>`,
      chart: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d946ef;stop-opacity:1" />
          </linearGradient>
          <filter id="shadow3d4">
            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <g filter="url(#shadow3d4)">
          <rect x="20" y="60" width="12" height="20" fill="url(#chartGrad)" rx="2"/>
          <rect x="40" y="40" width="12" height="40" fill="url(#chartGrad)" rx="2"/>
          <rect x="60" y="20" width="12" height="60" fill="url(#chartGrad)" rx="2"/>
          <circle cx="26" cy="58" r="2" fill="#fff"/>
          <circle cx="46" cy="38" r="2" fill="#fff"/>
          <circle cx="66" cy="18" r="2" fill="#fff"/>
        </g>
      </svg>`
    };
    const svg = icons[iconName] || icons['fire'];
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}