// src/app/components/search/search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Event, Category } from '../../services/api.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  categories: Category[] = [];
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = false;
  
  searchFilters = {
    category: '',
    location: '',
    date: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadAllEvents();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.categories = response;
        } else {
          this.categories = (response as any).data || [];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadAllEvents() {
    this.isLoading = true;
    this.apiService.getEvents().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.events = response;
          this.filteredEvents = response;
        } else {
          this.events = (response as any).data || [];
          this.filteredEvents = this.events;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.filteredEvents = this.events.filter(event => {
      const matchesCategory = !this.searchFilters.category || 
        event.category_name === this.searchFilters.category || 
        event.category === this.searchFilters.category;
      
      const matchesLocation = !this.searchFilters.location || 
        event.location.toLowerCase().includes(this.searchFilters.location.toLowerCase());
      
      const matchesDate = !this.searchFilters.date || 
        new Date(event.date).toDateString() === new Date(this.searchFilters.date).toDateString();
      
      return matchesCategory && matchesLocation && matchesDate;
    });
  }

  clearFilters() {
    this.searchFilters = { category: '', location: '', date: '' };
    this.filteredEvents = this.events;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
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
}