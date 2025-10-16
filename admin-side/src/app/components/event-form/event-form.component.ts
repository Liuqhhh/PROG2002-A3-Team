import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 添加 FormsModule 和 RouterModule
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: 0,
    available_tickets: 0,
    status: 'active'
  };
  
  isEdit = false;
  loading = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      //this.loadEvent(Number(id));
    }
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        alert('加载活动失败');
      }
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.isEdit) {
      this.eventService.updateEvent(this.event.id!, this.event).subscribe({
        next: () => {
          alert('更新成功');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          alert('更新失败');
          this.loading = false;
        }
      });
    } else {
      this.eventService.createEvent(this.event).subscribe({
        next: () => {
          alert('创建成功');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          alert('创建失败');
          this.loading = false;
        }
      });
    }
  }
}