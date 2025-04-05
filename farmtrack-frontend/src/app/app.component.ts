import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { UserMonitoringComponent } from './usermonitoring/usermonitoring.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavComponent,
    HttpClientModule,
    UserMonitoringComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'farmtrack-frontend';
  selected: boolean = true;

  constructor(private router: Router) {}
  ngOnInit() {}

  onClickFarms() {
    this.selected = true;
    this.router.navigate(['/farms']);
  }
  onClickMovements() {
    this.selected = false;
    this.router.navigate(['/movements']);
  }
}
