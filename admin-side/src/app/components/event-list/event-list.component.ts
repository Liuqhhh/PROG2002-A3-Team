import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  loading = false;
  lastUpdate = new Date();

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
  this.loading = true;
  this.eventService.getEvents().subscribe({
    next: (events: Event[]) => {
      console.log('=== 详细数据对比 ===');
      console.log('之前的数据长度:', this.events.length);
      console.log('新的数据长度:', events.length);
      
      // 详细对比每个活动
      events.forEach((newEvent, index) => {
        const oldEvent = this.events[index];
        if (oldEvent) {
          const changed = this.hasEventChanged(oldEvent, newEvent);
          if (changed) {
            console.log(`活动 ${index} 有变化:`, { old: oldEvent, new: newEvent });
          }
        } else {
          console.log(`新活动 ${index}:`, newEvent);
        }
      });

      // 强制更新
      this.events = [...events];
      this.lastUpdate = new Date();
      this.loading = false;
      this.cdr.detectChanges();
      
      console.log('更新后events:', this.events);
    },
    error: (error: any) => {
      console.error('Error:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

// 详细对比事件变化
private hasEventChanged(oldEvent: Event, newEvent: Event): boolean {
  return oldEvent.title !== newEvent.title ||
         oldEvent.description !== newEvent.description ||
         oldEvent.date !== newEvent.date ||
         oldEvent.time !== newEvent.time ||
         oldEvent.location !== newEvent.location ||
         oldEvent.category !== newEvent.category ||
         oldEvent.price !== newEvent.price ||
         oldEvent.available_tickets !== newEvent.available_tickets ||
         oldEvent.status !== newEvent.status;
}

  deleteEvent(event: Event): void {
    if (confirm(`确定删除 "${event.title}" 吗？`)) {
      this.eventService.deleteEvent(event.id!).subscribe({
        next: () => {
          console.log('删除成功，重新加载数据');
          this.loadEvents();
          alert('删除成功');
        },
        error: (error: any) => {
          console.error('删除失败:', error);
          alert('删除失败：已有用户注册');
        }
      });
    }
  }

  // 测试方法：手动刷新数据
  refreshData(): void {
    console.log('手动刷新数据');
    this.loadEvents();
  }

  // 测试方法：检查当前数据状态
  checkDataState(): void {
    console.log('=== 当前数据状态 ===');
    console.log('events数组长度:', this.events.length);
    console.log('events内容:', this.events);
    console.log('最后更新时间:', this.lastUpdate);
    
    alert(`当前有 ${this.events.length} 个活动，最后更新: ${this.lastUpdate.toLocaleTimeString()}`);
  }

  // 添加状态样式方法
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge bg-success';
      case 'past':
        return 'badge bg-secondary';
      case 'suspended':
        return 'badge bg-warning';
      default:
        return 'badge bg-info';
    }
  }

  // 添加状态文本方法
  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return '进行中';
      case 'past':
        return '已结束';
      case 'suspended':
        return '已暂停';
      default:
        return status;
    }
  }
}