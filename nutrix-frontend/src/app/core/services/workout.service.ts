import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExerciseEntry {
  id?: number;
  exerciseId: number;
  exerciseName?: string;
  exerciseVariationId?: number;
  exerciseVariationName?: string;
  sets: number;
  reps: number;
  weightKg?: number;
  sortOrder: number;
  notes?: string;
}

export interface WorkoutDay {
  id?: number;
  dayOfWeek: number;
  label: string;
  entries: ExerciseEntry[];
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  days: WorkoutDay[];
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly API_URL = `${environment.apiUrl}/api/workout`;

  constructor(private http: HttpClient) {}

  getLatestPlan(): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.API_URL}/plans/latest`);
  }

  getAllPlans(): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.API_URL}/plans`);
  }

  createPlan(plan: WorkoutPlan): Observable<WorkoutPlan> {
    return this.http.post<WorkoutPlan>(`${this.API_URL}/plans`, plan);
  }

  updatePlan(planId: number, plan: WorkoutPlan): Observable<WorkoutPlan> {
    return this.http.put<WorkoutPlan>(`${this.API_URL}/plans/${planId}`, plan);
  }

  deletePlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/plans/${planId}`);
  }

  addEntry(planId: number, dayId: number, entry: ExerciseEntry): Observable<ExerciseEntry> {
    return this.http.post<ExerciseEntry>(
      `${this.API_URL}/plans/${planId}/days/${dayId}/entries`,
      entry
    );
  }

  updateEntry(planId: number, dayId: number, entryId: number, entry: ExerciseEntry): Observable<ExerciseEntry> {
    return this.http.put<ExerciseEntry>(
      `${this.API_URL}/plans/${planId}/days/${dayId}/entries/${entryId}`,
      entry
    );
  }

  deleteEntry(planId: number, dayId: number, entryId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/plans/${planId}/days/${dayId}/entries/${entryId}`
    );
  }
}
