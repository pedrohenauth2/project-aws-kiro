import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { jwtInterceptor } from './jwt.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import * as fc from 'fast-check';

describe('jwtInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([jwtInterceptor]))
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Feature: nutrix-frontend-redesign, Property 3: JWT Interceptor injeta token em todas as requisições autenticadas
  it('Property 3: JWT Interceptor injeta token em todas as requisições autenticadas', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 500 }),
        fc.webUrl()
      ),
      (token: string, url: string) => {
        // Arrange - Set token in localStorage
        localStorage.setItem('nutrix_token', token);

        // Act - Make HTTP request
        httpClient.get(url).subscribe();

        // Assert - Verify Authorization header is present
        const req = httpMock.expectOne(url);
        expect(req.request.headers.has('Authorization')).toBe(true);
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

        req.flush({});
      },
      { numRuns: 50 }
    );
  });

  // Feature: nutrix-frontend-redesign, Property 4: JWT Interceptor não injeta header sem token
  it('Property 4: JWT Interceptor não injeta header sem token', () => {
    fc.assert(
      fc.property(fc.webUrl()),
      (url: string) => {
        // Arrange - No token in localStorage
        localStorage.clear();

        // Act - Make HTTP request
        httpClient.get(url).subscribe();

        // Assert - Verify Authorization header is NOT present
        const req = httpMock.expectOne(url);
        expect(req.request.headers.has('Authorization')).toBe(false);

        req.flush({});
      },
      { numRuns: 50 }
    );
  });

  // Additional test: Verify interceptor adds token to POST requests
  it('should add token to POST requests', () => {
    const token = 'test-token-123';
    localStorage.setItem('nutrix_token', token);

    httpClient.post('http://api.example.com/data', { test: 'data' }).subscribe();

    const req = httpMock.expectOne('http://api.example.com/data');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  // Additional test: Verify interceptor adds token to PUT requests
  it('should add token to PUT requests', () => {
    const token = 'test-token-456';
    localStorage.setItem('nutrix_token', token);

    httpClient.put('http://api.example.com/data/1', { test: 'data' }).subscribe();

    const req = httpMock.expectOne('http://api.example.com/data/1');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  // Additional test: Verify interceptor adds token to DELETE requests
  it('should add token to DELETE requests', () => {
    const token = 'test-token-789';
    localStorage.setItem('nutrix_token', token);

    httpClient.delete('http://api.example.com/data/1').subscribe();

    const req = httpMock.expectOne('http://api.example.com/data/1');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  // Additional test: Verify interceptor doesn't add token to requests without token
  it('should not add Authorization header when no token exists', () => {
    localStorage.clear();

    httpClient.get('http://api.example.com/public').subscribe();

    const req = httpMock.expectOne('http://api.example.com/public');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
