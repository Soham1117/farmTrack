import { Component, OnInit } from '@angular/core';
import { FarmService } from '../services/farm.service';
import { Farm } from '../models/farm.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-farm-list',
  templateUrl: './farm-list.component.html',
  styleUrls: ['./farm-list.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class FarmListComponent implements OnInit {
  farms: Farm[] = [];
  displayedColumns: string[] = ['premiseId', 'totalAnimal'];
  filteredFarms: Farm[] = [];
  searchTerm: string = '';
  totalAnimals: number = 0;
  totalFarms: number = 0;

  constructor(
    private farmService: FarmService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFarms();
  }

  loadFarms(): void {
    this.farmService.getFarms().subscribe({
      next: (data) => {
        this.farms = data;
        this.filteredFarms = data;
        this.totalFarms = this.farms.length;
        this.totalAnimals = this.farms.reduce(
          (total, farm) => total + farm.totalAnimal,
          0
        );
      },
      error: (err) => {
        console.error('Error fetching farms:', err);
      },
    });
  }

  applyFilter(): void {
    this.filteredFarms = this.farms.filter((farm) =>
      farm.premiseId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createFarm(): void {
    this.router.navigate(['/farm/create']);
  }

  editFarm(premiseid: string): void {
    this.router.navigate(['/farm/edit', premiseid]);
  }

  deleteFarm(premiseId: string): void {
    this.farmService.hasAssociatedMovements(premiseId).subscribe({
      next: (hasMovements) => {
        if (hasMovements) {
          alert('Cannot delete farm. It has associated movements.');
        } else {
          if (confirm('Are you sure you want to delete this farm?')) {
            this.farmService.deleteFarm(premiseId).subscribe({
              next: () => {
                this.loadFarms();
              },
              error: (err) => console.error('Failed to delete farm:', err),
            });
          }
        }
      },
      error: (err) =>
        console.error('Failed to check for associated movements:', err),
    });
  }
}
