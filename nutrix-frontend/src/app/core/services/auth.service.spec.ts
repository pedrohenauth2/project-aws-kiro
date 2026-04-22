import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import * as fc from 'fast-check';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Feature: nutrix-frontend-redesign, Property 1: Logout limpa completamente o estado de autenticação
  it('Property 1: Logout limpa completamente o estado de autenticação', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 100 })
      ),
      (token: string, username: string, fullName: string) => {
        // Arrange - Set up authentication state
        localStorage.setItem('nutrix_token', token);
        localStorage.setItem('nutrix_username', username);
        localStorage.setItem('nutrix_fullname', fullName);

        // Verify state is set
        expect(service.getToken()).toBe(token);
        expect(service.getUsername()).toBe(username);
        expect(service.getFullName()).toBe(fullName);
        expect(service.isAuthenticated()).toBe(true);

        // Act - Logout
        service.logout();

        // Assert - All authentication state should be cleared
        expect(service.getToken()).toBeNull();
        expect(service.getUsername()).toBeNull();
        expect(service.getFullName()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
      },
      { numRuns: 100 }
    );
  });

  // Additional test: Verify isAuthenticated reflects token presence
  it('should correctly report authentication status', () => {
    // Not authenticated initially
    expect(service.isAuthenticated()).toBe(false);

    // Authenticated after setting token
    localStorage.setItem('nutrix_token', 'test-token');
    expect(service.isAuthenticated()).toBe(true);

    // Not authenticated after logout
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });

  // Additional test: Verify getters return null when not set
  it('should return null for unset values', () => {
    expect(service.getToken()).toBeNull();
    expect(service.getUsername()).toBeNull();
    expect(service.getFullName()).toBeNull();
  });

  // Additional test: Verify getters return correct values
  it('should return correct values when set', () => {
    const token = 'test-token-123';
    const username = 'testuser';
    const fullName = 'Test User';

    localStorage.setItem('nutrix_token', token);
    localStorage.setItem('nutrix_username', username);
    localStorage.setItem('nutrix_fullname', fullName);

    expect(service.getToken()).toBe(token);
    expect(service.getUsername()).toBe(username);
    expect(service.getFullName()).toBe(fullName);
  });
});
