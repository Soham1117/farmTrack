import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movement } from '../models/movement.model';
import { MovementService } from '../services/movement.service';
import { FarmService } from '../services/farm.service';
import { Farm } from '../models/farm.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, throwError, catchError, switchMap } from 'rxjs';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  templateUrl: './movement-form.component.html',
  styleUrls: ['./movement-form.component.css'],
  imports: [FormsModule, CommonModule],
})
export class MovementFormComponent implements OnInit {
  movement: Movement = {
    movementId: 0,
    originFarm: { premiseId: '', totalAnimal: 0 },
    destinationFarm: { premiseId: '', totalAnimal: 0 },
    numItemsMoved: 0,
  };
  isEditMode = false;
  farms: Farm[] = [];
  errorMessage: string = '';
  originalMovement: Movement | null = null;

  constructor(
    private movementService: MovementService,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movementId = this.route.snapshot.paramMap.get('id');
    if (movementId) {
      this.isEditMode = true;
      this.movementService.getMovementById(+movementId).subscribe({
        next: (data) => {
          this.movement = data;
          this.originalMovement = { ...data };
        },
        error: (err) => console.error('Failed to load movement:', err),
      });
    }
    this.loadFarms();
  }

  loadFarms(): void {
    this.farmService.getFarms().subscribe({
      next: (data) => (this.farms = data),
      error: (err) => console.error('Failed to load farms:', err),
    });
  }

  private reverseOriginalMovement(
    originalMovement: Movement
  ): Observable<Farm> {
    const originFarm = this.farms.find(
      (f) => f.premiseId === originalMovement.originFarm.premiseId
    );
    const destinationFarm = this.farms.find(
      (f) => f.premiseId === originalMovement.destinationFarm.premiseId
    );

    if (!originFarm || !destinationFarm) {
      return throwError(() => new Error('Invalid origin or destination farm.'));
    }

    originFarm.totalAnimal += originalMovement.numItemsMoved;
    destinationFarm.totalAnimal -= originalMovement.numItemsMoved;

    return this.farmService.updateFarm(originFarm.premiseId, originFarm).pipe(
      switchMap(() =>
        this.farmService.updateFarm(destinationFarm.premiseId, destinationFarm)
      ),
      catchError((err) => {
        console.error('Failed to reverse original movement:', err);
        return throwError(
          () => new Error('Failed to reverse original movement.')
        );
      })
    );
  }

  onSubmit(): void {
    this.errorMessage = '';

    const originFarm = this.farms.find(
      (f) => f.premiseId === this.movement.originFarm.premiseId
    );
    const destinationFarm = this.farms.find(
      (f) => f.premiseId === this.movement.destinationFarm.premiseId
    );

    if (!originFarm || !destinationFarm || this.movement.numItemsMoved <= 0) {
      this.errorMessage = 'Invalid input data';
      return;
    }

    if (
      !this.isEditMode &&
      originFarm.totalAnimal < this.movement.numItemsMoved
    ) {
      this.errorMessage = 'Origin farm does not have enough animals';
      return;
    }

    if (this.isEditMode && this.originalMovement) {
      this.reverseOriginalMovement(this.originalMovement).subscribe({
        next: () => {
          const sameOrigin =
            this.originalMovement!.originFarm.premiseId ===
            this.movement.originFarm.premiseId;
          const sameDest =
            this.originalMovement!.destinationFarm.premiseId ===
            this.movement.destinationFarm.premiseId;

          if (sameOrigin && sameDest) {
            let diff = this.movement.numItemsMoved;
            if (diff < 0) {
              diff = Math.abs(diff);
            } else {
              diff = diff;
            }
            originFarm.totalAnimal -= diff;
            destinationFarm.totalAnimal += diff;
          } else {
            originFarm.totalAnimal -= this.movement.numItemsMoved;
            destinationFarm.totalAnimal += this.movement.numItemsMoved;
          }

          this.farmService
            .updateFarm(originFarm.premiseId, originFarm)
            .pipe(
              switchMap(() =>
                this.farmService.updateFarm(
                  destinationFarm.premiseId,
                  destinationFarm
                )
              ),
              catchError((err) => {
                console.error('Failed to update farms:', err);
                this.errorMessage = 'Failed to update farms. Please try again.';
                return throwError(() => new Error('Failed to update farms.'));
              })
            )
            .subscribe({
              next: () => {
                const saveOperation = this.isEditMode
                  ? this.movementService.updateMovement(
                      this.movement.movementId,
                      this.movement
                    )
                  : this.movementService.createMovement(this.movement);

                saveOperation.subscribe({
                  next: () => this.router.navigate(['/movements']),
                  error: (err) => {
                    console.error('Operation failed:', err);
                    this.errorMessage = 'Operation failed. Please try again.';

                    if (this.isEditMode && this.originalMovement) {
                      this.reverseOriginalMovement(this.movement).subscribe();
                    }
                  },
                });
              },
              error: (err) => {
                console.error('Failed to update farms:', err);
                this.errorMessage = 'Failed to update farms. Please try again.';
              },
            });
        },
        error: (err) => {
          console.error('Failed to reverse original movement:', err);
          this.errorMessage =
            'Failed to reverse original movement. Please try again.';
        },
      });
    } else {
      originFarm.totalAnimal -= this.movement.numItemsMoved;
      destinationFarm.totalAnimal += this.movement.numItemsMoved;

      this.farmService
        .updateFarm(originFarm.premiseId, originFarm)
        .pipe(
          switchMap(() =>
            this.farmService.updateFarm(
              destinationFarm.premiseId,
              destinationFarm
            )
          ),
          catchError((err) => {
            console.error('Failed to update farms:', err);
            this.errorMessage = 'Failed to update farms. Please try again.';
            return throwError(() => new Error('Failed to update farms.'));
          })
        )
        .subscribe({
          next: () => {
            const saveOperation = this.movementService.createMovement(
              this.movement
            );
            saveOperation.subscribe({
              next: () => this.router.navigate(['/movements']),
              error: (err) => {
                console.error('Operation failed:', err);
                this.errorMessage = 'Operation failed. Please try again.';
              },
            });
          },
          error: (err) => {
            console.error('Failed to update farms:', err);
            this.errorMessage = 'Failed to update farms. Please try again.';
          },
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/movements']);
  }
}
