import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false; // 改为 false，不加载

  constructor(private eventService: EventService) { }

    ngOnInit(): void {
    
      this.loadEvents();
  }

  
loadEvents(): void {
  this.loading = true;
  this.eventService.getEvents().subscribe({
    next: (events: Event[]) => {
      console.log('=== 活动列表API响应 ===');
      events.forEach((event, index) => {
        console.log(`活动 ${index + 1}:`, event);
        console.log(`- title: ${event.title}`);
        console.log(`- date: ${event.date}`);
        console.log(`- price: ${event.price}`);
        console.log(`- status: ${event.status}`);
        console.log(`- 完整对象:`, event);
      });
      
      this.events = events;
      this.loading = false;
    },
    error: (error: any) => {
      console.error('Error:', error);
      this.loading = false;
    }
  });
}

  deleteEvent(event: Event): void {
    if (confirm(`确定删除 "${event.title}" 吗？`)) {
      this.eventService.deleteEvent(event.id!).subscribe({
        next: () => {
          this.loadEvents();
          alert('删除成功');
        },
        error: (error: any) => {
          alert('删除失败：已有用户注册');
        }
      });
    }
  }
}