import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardComponent, getGreetingPeriod, GreetingPeriod } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import * as fc from 'fast-check';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getFullName', 'getUsername']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastService = jasmine.createSpyObj('ToastService', ['showInfo']);

    mockAuthService.getFullName.and.returnValue('Test User');
    mockAuthService.getUsername.and.returnValue('testuser');

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Feature: nutrix-frontend-redesign, Property 10: Card inativo sempre dispara notificação info
  it('Property 10: Card inativo sempre dispara notificação info', () => {
    // Arrange
    const inactiveFeature = component.features.find(f => !f.active);
    expect(inactiveFeature).toBeTruthy();

    // Act
    component.onCardClick(inactiveFeature);

    // Assert
    expect(mockToastService.showInfo).toHaveBeenCalledWith('Funcionalidade disponível em breve!');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // Feature: nutrix-frontend-redesign, Property 11: Saudação corresponde corretamente ao período do dia
  it('Property 11: Saudação corresponde corretamente ao período do dia', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour: number) => {
        // Act
        const period = getGreetingPeriod(hour);

        // Assert
        if (hour >= 5 && hour < 12) {
          expect(period).toBe('morning');
        } else if (hour >= 12 && hour < 18) {
          expect(period).toBe('afternoon');
        } else {
          expect(period).toBe('evening');
        }

        // Verify it's a valid GreetingPeriod
        const validPeriods: GreetingPeriod[] = ['morning', 'afternoon', 'evening'];
        expect(validPeriods).toContain(period);
      }),
      { numRuns: 100 }
    );
  });

  // Additional test: Verify greeting text matches period
  it('should return correct greeting text for each period', () => {
    // Test morning
    component.greetingPeriod = 'morning';
    expect(component.getGreetingText()).toBe('Bom dia');

    // Test afternoon
    component.greetingPeriod = 'afternoon';
    expect(component.getGreetingText()).toBe('Boa tarde');

    // Test evening
    component.greetingPeriod = 'evening';
    expect(component.getGreetingText()).toBe('Boa noite');
  });

  // Additional test: Verify active card navigates
  it('should navigate when clicking active card', () => {
    // Arrange
    const activeFeature = component.features.find(f => f.active);
    expect(activeFeature).toBeTruthy();

    // Act
    component.onCardClick(activeFeature);

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith([activeFeature!.route]);
    expect(mockToastService.showInfo).not.toHaveBeenCalled();
  });

  // Additional test: Verify slide navigation
  it('should navigate slides correctly', () => {
    // Test next slide
    component.currentSlide = 0;
    component.nextSlide();
    expect(component.currentSlide).toBe(1);

    // Test prev slide
    component.prevSlide();
    expect(component.currentSlide).toBe(0);

    // Test wrap around on next
    component.currentSlide = component.features.length - 1;
    component.nextSlide();
    expect(component.currentSlide).toBe(0);

    // Test wrap around on prev
    component.currentSlide = 0;
    component.prevSlide();
    expect(component.currentSlide).toBe(component.features.length - 1);
  });

  // Additional test: Verify go to slide
  it('should go to specific slide', () => {
    component.goToSlide(2);
    expect(component.currentSlide).toBe(2);

    component.goToSlide(0);
    expect(component.currentSlide).toBe(0);
  });
});
