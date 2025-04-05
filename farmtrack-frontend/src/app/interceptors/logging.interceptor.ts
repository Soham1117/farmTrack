import { Injectable } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();

  return next(req).pipe(
    tap(
      (event) => {
        if (event instanceof HttpResponse) {
          const endTime = Date.now();
          const elapsed = endTime - startTime;

          console.group('%cAPI Response', 'color: green; font-weight: bold;');
          console.log('URL:', req.url);
          console.log('Method:', req.method);
          console.log('Request Body:', req.body);
          console.log('Response:', event.body);
          console.log(`Elapsed Time: ${elapsed}ms`);
          console.groupEnd();
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          const endTime = Date.now();
          const elapsed = endTime - startTime;

          console.group('%cAPI Error', 'color: red; font-weight: bold;');
          console.log('URL:', req.url);
          console.log('Method:', req.method);
          console.log('Request Body:', req.body);
          console.log('Error Status:', error.status);
          console.log('Error Message:', error.message);
          console.log(`Elapsed Time: ${elapsed}ms`);
          console.groupEnd();
        }
      }
    )
  );
};
