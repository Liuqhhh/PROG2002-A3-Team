// src/app/components/registration/registration.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService, Event, RegistrationData } from '../../services/api.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {
  event: Event | null = null;
  isLoading = true;
  isSubmitting = false;
  showSuccess = false;
  
  registrationData = {
    fullName: '',
    email: '',
    phone: '',
    ticketCount: 0,
    specialRequirements: ''
  };

  ticketPrice = 0;
  totalAmount = 0;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const eventId = params['eventId'];
      if (eventId) {
        this.loadEventInfo(eventId);
      } else {
        this.showDefaultEvent();
      }
    });
  }

  loadEventInfo(eventId: string) {
    this.apiService.getEvent(eventId).subscribe({
      next: (response) => {
        this.event = response;
        this.ticketPrice = this.event.ticket_price || 0;
        this.updateTotalAmount();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.showDefaultEvent();
      }
    });
  }

  showDefaultEvent() {
    this.event = {
      id: 'default',
      name: "Charity Gala Dinner",
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      location: "City Center International Convention Center",
      description: "Annual charity fundraising dinner featuring auctions and performances to support children's education. All proceeds will be donated to the Children's Education Foundation to provide learning resources and scholarships for underprivileged students.",
      ticket_price: 150,
      category_name: "Fundraising Gala",
      purpose: "Supporting children's education through fundraising"
    };
    this.ticketPrice = this.event.ticket_price;
    this.updateTotalAmount();
    this.isLoading = false;
  }

  onTicketCountChange() {
    this.updateTotalAmount();
  }

  updateTotalAmount() {
    this.totalAmount = this.registrationData.ticketCount * this.ticketPrice;
  }

  validateForm(): boolean {
    if (!this.registrationData.fullName.trim()) {
      alert('Full name is required');
      return false;
    }
    if (!this.registrationData.email.trim()) {
      alert('Email is required');
      return false;
    }
    if (!this.validateEmail(this.registrationData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (this.registrationData.phone && !this.validatePhone(this.registrationData.phone)) {
      alert('Please enter a valid phone number');
      return false;
    }
    if (!this.registrationData.ticketCount || this.registrationData.ticketCount < 1) {
      alert('Please select number of tickets');
      return false;
    }
    return true;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const formData: RegistrationData = {
      eventId: this.event?.id || 'default',
      eventName: this.event?.name || '',
      fullName: this.registrationData.fullName,
      email: this.registrationData.email,
      phone: this.registrationData.phone,
      ticketCount: this.registrationData.ticketCount,
      specialRequirements: this.registrationData.specialRequirements,
      totalAmount: this.totalAmount
    };

    this.apiService.submitRegistration(formData).subscribe({
      next: (result) => {
        console.log('Registration successful:', result);
        this.showSuccess = true;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
        this.isSubmitting = false;
      }
    });
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

  goBackToEvent() {
    if (this.event && this.event.id !== 'default') {
      window.location.href = `/event/${this.event.id}`;
    } else {
      this.goToHome();
    }
  }

  goToHome() {
    window.location.href = '/';
  }

  goToSearch() {
    window.location.href = '/search';
  }
  generateRegistrationId(): string {
  return 'REG-' + Date.now();
}
}