import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ExerciseVariation {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  variations: ExerciseVariation[];
}

export interface MuscleGroupWithExercises {
  id: number;
  name: string;
  exercises: Exercise[];
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly API_URL = `${environment.apiUrl}/api/exercises`;

  constructor(private http: HttpClient) {}

  getAllGrouped(): Observable<MuscleGroupWithExercises[]> {
    return this.http.get<MuscleGroupWithExercises[]>(this.API_URL);
  }

  getByMuscleGroup(muscleGroupId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.API_URL}?muscleGroupId=${muscleGroupId}`);
  }
}
