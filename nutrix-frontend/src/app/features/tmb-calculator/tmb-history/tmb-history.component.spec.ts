import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TmbHistoryComponent, calculateTrend, TrendIndicator } from './tmb-history.component';
import { TmbService, TmbHistory } from '../../../core/services/tmb.service';
import { ToastService } from '../../../core/services/toast.service';
import { of, throwError } from 'rxjs';
import * as fc from 'fast-check';

describe('TmbHistoryComponent', () => {
  let component: TmbHistoryComponent;
  let fixture: ComponentFixture<TmbHistoryComponent>;
  let mockTmbService: jasmine.SpyObj<TmbService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockTmbService = jasmine.createSpyObj('TmbService', ['getHistory']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastService = jasmine.createSpyObj('ToastService', ['showError', 'showSuccess']);

    mockTmbService.getHistory.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [TmbHistoryComponent],
      providers: [
        { provide: TmbService, useValue: mockTmbService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TmbHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Feature: nutrix-frontend-redesign, Property 13: Histórico TMB exibido em ordem decrescente de data
  it('Property 13: Histórico TMB exibido em ordem decrescente de data', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 10000 }),
            tmb: fc.integer({ min: 1000, max: 3000 }),
            tdee: fc.integer({ min: 1500, max: 5000 }),
            timestamp: fc.integer({ min: 0, max: 1000000000 })
          }),
          { minLength: 2, maxLength: 20 }
        )
      ),
      (records: Array<{ id: number; tmb: number; tdee: number; timestamp: number }>) => {
        // Arrange
        const mockHistory: TmbHistory[] = records.map(r => ({
          id: r.id,
          userId: 1,
          tmbKcal: r.tmb,
          tdeeKcal: r.tdee,
          age: 30,
          weight: 70,
          height: 175,
          biologicalSex: 'MALE',
          activityLevel: 'MODERATELY_ACTIVE',
          calculatedAt: new Date(r.timestamp * 1000).toISOString()
        }));

        // Act
        const sorted = component.getSortedHistory(mockHistory);

        // Assert - Verify descending order
        for (let i = 1; i < sorted.length; i++) {
          const currentDate = new Date(sorted[i - 1].calculatedAt).getTime();
          const nextDate = new Date(sorted[i].calculatedAt).getTime();
          expect(currentDate).toBeGreaterThanOrEqual(nextDate);
        }
      },
      { numRuns: 100 }
    );
  });

  // Feature: nutrix-frontend-redesign, Property 15: Indicador de tendência reflete corretamente a variação de TDEE
  it('Property 15: Indicador de tendência reflete corretamente a variação de TDEE', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 6000 }),
        fc.integer({ min: 1000, max: 6000 })
      ),
      (currentTdee: number, previousTdee: number) => {
        // Act
        const trend = calculateTrend(currentTdee, previousTdee);

        // Assert
        const delta = currentTdee - previousTdee;

        if (Math.abs(delta) < 1) {
          expect(trend.direction).toBe('stable');
          expect(trend.delta).toBe(0);
        } else if (delta > 0) {
          expect(trend.direction).toBe('up');
          expect(trend.delta).toBe(Math.abs(delta));
        } else {
          expect(trend.direction).toBe('down');
          expect(trend.delta).toBe(Math.abs(delta));
        }

        // Verify it's a valid TrendIndicator
        const validDirections = ['up', 'down', 'stable'];
        expect(validDirections).toContain(trend.direction);
      },
      { numRuns: 100 }
    );
  });

  // Additional test: Verify trend emoji mapping
  it('should return correct trend emoji', () => {
    const upTrend: TrendIndicator = { direction: 'up', delta: 100 };
    expect(component.getTrendEmoji(upTrend)).toBe('↑');

    const downTrend: TrendIndicator = { direction: 'down', delta: 100 };
    expect(component.getTrendEmoji(downTrend)).toBe('↓');

    const stableTrend: TrendIndicator = { direction: 'stable', delta: 0 };
    expect(component.getTrendEmoji(stableTrend)).toBe('→');

    expect(component.getTrendEmoji(null)).toBe('');
  });

  // Additional test: Verify date formatting
  it('should format date correctly', () => {
    const dateString = '2026-04-20T14:30:00Z';
    const formatted = component.formatDate(dateString);
    expect(formatted).toContain('20');
    expect(formatted).toContain('04');
    expect(formatted).toContain('2026');
  });

  // Additional test: Verify activity level labels
  it('should return correct activity level labels', () => {
    expect(component.getActivityLabel('SEDENTARY')).toBe('Sedentário');
    expect(component.getActivityLabel('LIGHTLY_ACTIVE')).toBe('Levemente Ativo');
    expect(component.getActivityLabel('MODERATELY_ACTIVE')).toBe('Moderadamente Ativo');
    expect(component.getActivityLabel('VERY_ACTIVE')).toBe('Muito Ativo');
    expect(component.getActivityLabel('EXTREMELY_ACTIVE')).toBe('Extremamente Ativo');
  });

  // Additional test: Verify biological sex labels
  it('should return correct biological sex labels', () => {
    expect(component.getSexLabel('MALE')).toBe('Masculino');
    expect(component.getSexLabel('FEMALE')).toBe('Feminino');
  });

  // Additional test: Verify navigation to new calculation
  it('should navigate to TMB calculator', () => {
    component.newCalculation();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tmb']);
  });

  // Additional test: Verify reset history
  it('should reset history with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.history = [
      {
        id: 1,
        userId: 1,
        tmbKcal: 1500,
        tdeeKcal: 2000,
        age: 30,
        weight: 70,
        height: 175,
        biologicalSex: 'MALE',
        activityLevel: 'MODERATELY_ACTIVE',
        calculatedAt: new Date().toISOString()
      }
    ];

    component.resetHistory();

    expect(component.history.length).toBe(0);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Histórico limpo com sucesso!');
  });

  // Additional test: Verify reset history cancellation
  it('should not reset history if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const mockHistory: TmbHistory[] = [
      {
        id: 1,
        userId: 1,
        tmbKcal: 1500,
        tdeeKcal: 2000,
        age: 30,
        weight: 70,
        height: 175,
        biologicalSex: 'MALE',
        activityLevel: 'MODERATELY_ACTIVE',
        calculatedAt: new Date().toISOString()
      }
    ];
    component.history = [...mockHistory];

    component.resetHistory();

    expect(component.history.length).toBe(1);
    expect(mockToastService.showSuccess).not.toHaveBeenCalled();
  });
});
