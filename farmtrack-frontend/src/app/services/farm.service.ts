import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root',
})
export class FarmService {
  private apiUrl = 'http://localhost:8080/api/farms';

  constructor(private http: HttpClient) {}

  getFarms(): Observable<Farm[]> {
    return this.http
      .get<Farm[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getFarmById(premiseid: string): Observable<Farm> {
    return this.http
      .get<Farm>(`${this.apiUrl}/${premiseid}`)
      .pipe(catchError(this.handleError));
  }

  createFarm(farm: Farm): Observable<Farm> {
    return this.http
      .post<Farm>(this.apiUrl, farm)
      .pipe(catchError(this.handleError));
  }

  updateFarm(premiseid: string, farm: Farm): Observable<Farm> {
    return this.http
      .put<Farm>(`${this.apiUrl}/${premiseid}`, farm)
      .pipe(catchError(this.handleError));
  }

  hasAssociatedMovements(premiseId: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/${premiseId}/has-movements`)
      .pipe(catchError(this.handleError));
  }

  deleteFarm(premiseid: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${premiseid}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
