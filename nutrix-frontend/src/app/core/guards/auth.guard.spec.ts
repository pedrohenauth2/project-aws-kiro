import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';
import * as fc from 'fast-check';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  // Feature: nutrix-frontend-redesign, Property 2: authGuard bloqueia acesso sem autenticação
  it('Property 2: authGuard bloqueia acesso sem autenticação', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('/dashboard'),
          fc.constant('/tmb'),
          fc.constant('/tmb/history'),
          fc.constant('/workout')
        )
      ),
      (route: string) => {
        // Arrange
        authService.isAuthenticated.and.returnValue(false);

        // Act
        const result = TestBed.runInInjectionContext(() =>
          authGuard({ component: null } as any, { url: route } as any)
        );

        // Assert
        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      }
    );
  });

  // Additional test: Verify guard allows access when authenticated
  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({ component: null } as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // Additional test: Verify guard blocks access when not authenticated
  it('should block access when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({ component: null } as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // Additional test: Verify guard navigates to login for all protected routes
  it('should navigate to login for all protected routes', () => {
    const protectedRoutes = ['/dashboard', '/tmb', '/tmb/history', '/workout'];
    authService.isAuthenticated.and.returnValue(false);

    protectedRoutes.forEach(route => {
      router.navigate.calls.reset();

      TestBed.runInInjectionContext(() =>
        authGuard({ component: null } as any, { url: route } as any)
      );

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
