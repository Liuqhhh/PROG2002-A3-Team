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
    // 暂时使用测试数据，等后端好了删除下面这行
    this.events = this.getTestData();
    
    // 等后端API好了，取消注释下面这行，删除上面那行
    // this.loadEvents();
  }

  private getTestData(): Event[] {
    return [
      {
        id: 1,
        title: '慈善音乐会',
        description: '为贫困儿童筹款的慈善音乐会',
        date: '2025-10-25',
        time: '19:00',
        location: '悉尼歌剧院',
        category: '音乐',
        price: 50,
        available_tickets: 100,
        status: 'active'
      },
      {
        id: 2,
        title: '环保义跑',
        description: '支持环保事业的5公里义跑活动',
        date: '2025-11-15',
        time: '08:00',
        location: '百年纪念公园',
        category: '运动',
        price: 30,
        available_tickets: 200,
        status: 'active'
      },
      {
        id: 3,
        title: '艺术拍卖会',
        description: '本地艺术家作品慈善拍卖',
        date: '2025-12-05',
        time: '14:00',
        location: '艺术画廊',
        category: '艺术',
        price: 100,
        available_tickets: 50,
        status: 'active'
      }
    ];
  }  
  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
        ;
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