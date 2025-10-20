// src/app/components/event-details/event-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService, Event } from '../../services/api.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-details.component.html'
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  error = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.loadEventDetails(eventId);
      } else {
        this.error = 'No event ID provided';
        this.isLoading = false;
      }
    });
  }

  loadEventDetails(eventId: string) {
    this.isLoading = true;
    this.apiService.getEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event details:', response);
        this.event = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.error = 'Error loading event details. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    if (this.event) {
      const eventId = this.event.id;
      window.location.href = `/register/${eventId}`;
    } else {
      window.location.href = '/register';
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not specified';
    }
  }

  formatCurrency(amount: number): string {
    if (amount === 0 || amount === null || amount === undefined) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  calculateProgressPercentage(): number {
    if (!this.event || !this.event.goal_amount || !this.event.progress_amount) {
      return 0;
    }
    return Math.min(100, (this.event.progress_amount / this.event.goal_amount) * 100);
  }
}