import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Farm } from '../models/farm.model';
import { FarmService } from '../services/farm.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-farm-form',
  standalone: true,
  templateUrl: './farm-form.component.html',
  styleUrls: ['./farm-form.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class FarmFormComponent implements OnInit {
  farmForm: FormGroup;
  farm: Farm = { premiseId: '', totalAnimal: 0 };
  isEditMode = false;
  error: string | null = null;
  loading = false;
  formSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.farmForm = this.fb.group({
      premiseId: ['', Validators.required],
      totalAnimal: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.farmService.getFarmById(id).subscribe({
        next: (data) => {
          this.farm = data;

          this.farmForm.patchValue({
            premiseId: data.premiseId,
            totalAnimal: data.totalAnimal,
          });
        },
        error: (err) => console.error('Failed to load farm:', err),
      });
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.farmForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = '';

    const updatedFarm: Farm = {
      premiseId: this.farmForm.get('premiseId')?.value,
      totalAnimal: this.farmForm.get('totalAnimal')?.value,
    };

    if (this.isEditMode) {
      this.farmService
        .updateFarm(updatedFarm.premiseId, updatedFarm)
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => {
            this.error = 'Invalid premise ID or total animals';
            this.loading = false;
          },
        });
    } else {
      this.farmService.createFarm(updatedFarm).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => {
          if (err.status === 409) {
            this.error = 'Premise ID already exists';
          } else {
            this.error = 'Invalid premise ID or total animals';
          }
          this.loading = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/farms']);
  }
}
