import { Component, OnInit } from '@angular/core';
import { MovementService } from '../services/movement.service';
import { Movement } from '../models/movement.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, throwError, catchError, switchMap } from 'rxjs';
import { FarmService } from '../services/farm.service';
import { Farm } from '../models/farm.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-movement-list',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './movement-list.component.html',
  styleUrl: './movement-list.component.css',
})
export class MovementListComponent implements OnInit {
  userRole: string | null = 'ROLE_VIEWER';
  movements: Movement[] = [];
  filteredMovements: Movement[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = [
    'originFarm',
    'destinationFarm',
    'numItemsMoved',
  ];
  totalMovements: number = 0;
  totalAnimalsMoved: number = 0;

  constructor(
    private movementService: MovementService,
    public authService: AuthService,
    private farmService: FarmService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovements();
    this.userRole = this.authService.getCurrentUserRole();
  }

  loadMovements(): void {
    this.movementService.getMovements().subscribe({
      next: (data) => {
        this.movements = data;
        this.filteredMovements = data;
        this.totalMovements = this.movements.length;
        this.totalAnimalsMoved = this.movements.reduce(
          (total, movement) => total + movement.numItemsMoved,
          0
        );
      },
      error: (err) => {
        console.error('Error fetching movements:', err);
      },
    });
  }

  applyFilter(): void {
    this.filteredMovements = this.movements.filter(
      (movement) =>
        movement.originFarm.premiseId
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        movement.destinationFarm.premiseId
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  createMovement(): void {
    this.router.navigate(['/movement/create']);
  }

  editMovement(movementId: number): void {
    this.router.navigate(['/movement/edit', movementId]);
  }

  private reverseOriginalMovement(
    originalMovement: Movement
  ): Observable<Farm> {
    const originFarm = originalMovement.originFarm;
    const destinationFarm = originalMovement.destinationFarm;

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

  deleteMovement(movementId: number): void {
    this.reverseOriginalMovement(
      this.movements.find((m) => m.movementId === movementId)!
    ).subscribe({
      next: () => {
        if (confirm('Are you sure you want to delete this movement?')) {
          this.movementService.deleteMovement(movementId).subscribe({
            next: () => {
              this.loadMovements();
            },
            error: (err) => console.error('Failed to delete movement:', err),
          });
        }
      },
      error: (err) =>
        console.error('Failed to reverse original movement:', err),
    });
  }
}
