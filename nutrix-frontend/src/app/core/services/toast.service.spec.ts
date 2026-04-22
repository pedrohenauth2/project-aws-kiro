import { TestBed } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';
import * as fc from 'fast-check';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Feature: nutrix-frontend-redesign, Property 5: Toast renderiza com tipo e estilo corretos
  it('Property 5: Toast renderiza com tipo e estilo corretos', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('success'),
          fc.constant('error'),
          fc.constant('info')
        ),
        fc.string({ minLength: 1, maxLength: 200 })
      ),
      (type: 'success' | 'error' | 'info', message: string) => {
        // Arrange
        service = TestBed.inject(ToastService);
        let capturedToasts: Toast[] = [];
        service.toasts$.subscribe(toasts => {
          capturedToasts = toasts;
        });

        // Act
        if (type === 'success') {
          service.showSuccess(message);
        } else if (type === 'error') {
          service.showError(message);
        } else {
          service.showInfo(message);
        }

        // Assert
        expect(capturedToasts.length).toBe(1);
        expect(capturedToasts[0].type).toBe(type);
        expect(capturedToasts[0].message).toBe(message);
        expect(capturedToasts[0].id).toBeTruthy();
        expect(capturedToasts[0].createdAt).toBeGreaterThan(0);
      }
    );
  });

  // Feature: nutrix-frontend-redesign, Property 6: Toasts preservam ordem de inserção
  it('Property 6: Toasts preservam ordem de inserção', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            type: fc.oneof(
              fc.constant('success'),
              fc.constant('error'),
              fc.constant('info')
            ),
            message: fc.string({ minLength: 1, maxLength: 100 })
          }),
          { minLength: 2, maxLength: 10 }
        )
      ),
      (toastConfigs: Array<{ type: 'success' | 'error' | 'info'; message: string }>) => {
        // Arrange
        service = TestBed.inject(ToastService);
        let capturedToasts: Toast[] = [];
        service.toasts$.subscribe(toasts => {
          capturedToasts = toasts;
        });

        // Act - Add toasts in order
        toastConfigs.forEach(config => {
          if (config.type === 'success') {
            service.showSuccess(config.message);
          } else if (config.type === 'error') {
            service.showError(config.message);
          } else {
            service.showInfo(config.message);
          }
        });

        // Assert - Verify FIFO order
        expect(capturedToasts.length).toBe(toastConfigs.length);
        for (let i = 0; i < toastConfigs.length; i++) {
          expect(capturedToasts[i].type).toBe(toastConfigs[i].type);
          expect(capturedToasts[i].message).toBe(toastConfigs[i].message);
        }

        // Verify timestamps are in ascending order
        for (let i = 1; i < capturedToasts.length; i++) {
          expect(capturedToasts[i].createdAt).toBeGreaterThanOrEqual(
            capturedToasts[i - 1].createdAt
          );
        }
      }
    );
  });

  // Feature: nutrix-frontend-redesign, Property 7: Clique em toast o remove imediatamente
  it('Property 7: Clique em toast o remove imediatamente', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            type: fc.oneof(
              fc.constant('success'),
              fc.constant('error'),
              fc.constant('info')
            ),
            message: fc.string({ minLength: 1, maxLength: 100 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0, max: 4 })
      ),
      (toastConfigs: Array<{ type: 'success' | 'error' | 'info'; message: string }>, indexToRemove: number) => {
        // Arrange
        service = TestBed.inject(ToastService);
        let capturedToasts: Toast[] = [];
        service.toasts$.subscribe(toasts => {
          capturedToasts = toasts;
        });

        // Only test if indexToRemove is valid
        if (indexToRemove >= toastConfigs.length) {
          return;
        }

        // Act - Add toasts
        const toastIds: string[] = [];
        toastConfigs.forEach(config => {
          if (config.type === 'success') {
            service.showSuccess(config.message);
          } else if (config.type === 'error') {
            service.showError(config.message);
          } else {
            service.showInfo(config.message);
          }
        });

        // Capture the IDs
        const initialToasts = [...capturedToasts];
        const idToRemove = initialToasts[indexToRemove].id;

        // Act - Dismiss the toast
        service.dismiss(idToRemove);

        // Assert - Toast should be removed immediately
        expect(capturedToasts.length).toBe(toastConfigs.length - 1);
        expect(capturedToasts.find(t => t.id === idToRemove)).toBeUndefined();

        // Verify other toasts are still there
        for (let i = 0; i < capturedToasts.length; i++) {
          expect(capturedToasts[i].id).not.toBe(idToRemove);
        }
      }
    );
  });
});
