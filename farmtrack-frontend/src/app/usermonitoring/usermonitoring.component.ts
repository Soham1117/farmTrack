import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserInteractionData } from '../services/usermonitoritng.service';
import { UserMonitoringService } from '../services/usermonitoritng.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usermonitoring',
  templateUrl: './usermonitoring.component.html',
  styleUrls: ['./usermonitoring.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class UserMonitoringComponent implements OnInit {
  interactions: UserInteractionData[] = [];
  totalVisits: number = 0;
  clickDensityItems: Array<{
    elementId: string;
    count: number;
    percentage: number;
    color: string;
  }> = [];

  constructor(private monitoringService: UserMonitoringService) {}

  ngOnInit() {
    this.monitoringService.interactions$.subscribe((interactions) => {
      this.interactions = interactions;
    });
  }
}
