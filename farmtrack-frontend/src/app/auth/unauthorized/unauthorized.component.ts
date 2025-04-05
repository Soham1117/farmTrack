import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div class="unauthorized-container">
      <h2>Access Denied</h2>
      <p>You don't have permission to access this resource.</p>
      <button (click)="goBack()" class="btn btn-primary">Go Back</button>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        max-width: 600px;
        margin: 50px auto;
        padding: 20px;
        text-align: center;
      }
      .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
      }
    `,
  ],
})
export class UnauthorizedComponent {
  goBack(): void {
    window.history.back();
  }
}
