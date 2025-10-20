import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  lastUpdate = new Date();
  private refreshSubscription?: Subscription;

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEvents();
    
    // 监听路由变化，当从编辑页面返回时刷新数据
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private setupRouteListener(): void {
    // 监听页面可见性变化，当从其他标签页返回时刷新
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.loadEvents();
      }
    });

    // 监听窗口焦点变化
    window.addEventListener('focus', () => {
      this.loadEvents();
    });
  }

  loadEvents(): void {
    this.loading = true;
    console.log('开始加载活动数据...');
    
    this.eventService.getEvents().subscribe({
      next: (events: Event[]) => {
        console.log('=== 成功获取活动数据 ===');
        console.log('获取到的活动数量:', events.length);
        
        // 详细记录每个活动的数据
        events.forEach((event, index) => {
          console.log(`活动 ${index}:`, {
            id: event.id,
            title: event.title,
            price: event.ticket_price,
            tickets: event.available_tickets
          });
        });

        // 使用 setTimeout 确保数据完全更新
        setTimeout(() => {
          this.events = [...events];
          this.lastUpdate = new Date();
          this.loading = false;
          
          console.log('数据更新完成，当前events:', this.events);
          this.cdr.detectChanges(); // 强制变更检测
        }, 100);
      },
      error: (error: any) => {
        console.error('加载活动失败:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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

  // 手动刷新数据
  refreshData(): void {
    console.log('手动刷新数据');
    this.loadEvents();
  }

  // 检查当前数据状态
  checkDataState(): void {
    console.log('=== 当前数据状态 ===');
    console.log('events数组长度:', this.events.length);
    console.log('events内容:', this.events);
    console.log('最后更新时间:', this.lastUpdate);
    
    // 显示详细信息
    this.events.forEach((event, index) => {
      console.log(`活动 ${index} - ID: ${event.id}, 标题: ${event.title}`);
    });
    
    alert(`当前有 ${this.events.length} 个活动，最后更新: ${this.lastUpdate.toLocaleTimeString()}`);
  }

  // 详细对比事件变化
  private hasEventChanged(oldEvent: Event, newEvent: Event): boolean {
    const changed = oldEvent.title !== newEvent.title ||
           oldEvent.description !== newEvent.description ||
           oldEvent.event_date !== newEvent.event_date ||
           oldEvent.location !== newEvent.location ||
           oldEvent.ticket_price !== newEvent.ticket_price ||
           oldEvent.available_tickets !== newEvent.available_tickets;
    
    if (changed) {
      console.log('检测到数据变化:', {
        oldTitle: oldEvent.title,
        newTitle: newEvent.title,
        oldPrice: oldEvent.ticket_price,
        newPrice: newEvent.ticket_price
      });
    }
    
    return changed;
  }
}