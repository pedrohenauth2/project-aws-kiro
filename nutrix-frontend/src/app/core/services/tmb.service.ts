import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TmbRequest {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  biologicalSex: 'MALE' | 'FEMALE';
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE';
}

export interface TmbResponse {
  tmbKcal: number;
  tdeeKcal: number;
}

export interface TmbHistory {
  id: number;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  biologicalSex: string;
  activityLevel: string;
  tmbKcal: number;
  tdeeKcal: number;
  calculatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TmbService {
  private readonly API_URL = `${environment.apiUrl}/api/tmb`;

  constructor(private http: HttpClient) {}

  calculate(request: TmbRequest): Observable<TmbResponse> {
    return this.http.post<TmbResponse>(`${this.API_URL}/calculate`, request);
  }

  saveHistory(request: TmbRequest): Observable<TmbHistory> {
    return this.http.post<TmbHistory>(`${this.API_URL}/history`, request);
  }

  getHistory(): Observable<TmbHistory[]> {
    return this.http.get<TmbHistory[]>(`${this.API_URL}/history`);
  }

  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/history`);
  }
}
