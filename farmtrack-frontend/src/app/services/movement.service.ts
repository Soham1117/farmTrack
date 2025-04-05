import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Movement } from '../models/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private apiUrl = 'http://localhost:8080/api/movements';

  constructor(private http: HttpClient) {}

  getMovements(): Observable<Movement[]> {
    return this.http
      .get<Movement[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getMovementById(movementId: number): Observable<Movement> {
    return this.http
      .get<Movement>(`${this.apiUrl}/${movementId}`)
      .pipe(catchError(this.handleError));
  }

  createMovement(movement: Movement): Observable<Movement> {
    return this.http
      .post<Movement>(this.apiUrl, movement)
      .pipe(catchError(this.handleError));
  }

  updateMovement(movementId: number, movement: Movement): Observable<Movement> {
    return this.http
      .put<Movement>(`${this.apiUrl}/${movementId}`, movement)
      .pipe(catchError(this.handleError));
  }

  deleteMovement(movementId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${movementId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
