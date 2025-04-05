import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class UsermanagementComponent implements OnInit {
  selectedUser: User = { username: '', password: '', role: 'VIEWER' };
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = '';

    if (
      !this.selectedUser.username ||
      !this.selectedUser.password ||
      !this.selectedUser.role
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.userService.createUser(this.selectedUser).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Username already exists.';
          return;
        } else {
          this.errorMessage = 'Failed to create user. Please try again.';
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
