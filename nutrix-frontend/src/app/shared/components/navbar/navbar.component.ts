import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  get fullName(): string {
    return this.authService.getFullName() || this.authService.getUsername() || 'Usuário';
  }

  get userInitial(): string {
    const name = this.fullName;
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  getAppleLogo(): SafeHtml {
    const svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#22c55e" stroke="#ffffff" stroke-width="1.5"/>
      <ellipse cx="38" cy="38" rx="10" ry="14" fill="rgba(255,255,255,0.4)"/>
      <rect x="47" y="15" width="6" height="12" fill="#92400e" rx="2"/>
      <ellipse cx="58" cy="20" rx="8" ry="5" fill="#22c55e" stroke="#ffffff" stroke-width="1" transform="rotate(-30 58 20)"/>
    </svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
