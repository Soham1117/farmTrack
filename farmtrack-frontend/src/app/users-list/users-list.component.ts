import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'username', 'role'];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  totalUsers: number = 0;
  totalViewers: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.totalUsers = this.users.filter(
          (user) => user.role === 'USER'
        ).length;
        this.totalViewers = this.users.filter(
          (user) => user.role === 'VIEWER'
        ).length;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter((user) =>
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  createUser(): void {
    this.router.navigate(['/user/create']);
  }

  deleteUser(id: number | undefined): void {
    if (confirm('Are you sure you want to delete this user?')) {
      if (!id) {
        return;
      }
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.error('Failed to delete user:', err),
      });
    }
  }
}
