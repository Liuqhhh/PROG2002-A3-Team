import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, toApiEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    event_date: '',
    location: '',
    ticket_price: 0,
    available_tickets: 0
  };
  
  isEdit = false;
  loading = false;
  eventId: number | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 使用 paramMap 订阅方式，更可靠
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('路由参数ID:', id); // 调试日志
      
      if (id && id !== 'undefined' && id !== 'null') {
        this.isEdit = true;
        this.eventId = Number(id);
        this.loadEvent(this.eventId);
      } else {
        this.isEdit = false;
        this.eventId = null;
      }
    });
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        console.log('=== 完整API响应数据 ===');
        console.log('原始event对象:', event);
        console.log('所有属性:', Object.keys(event));
        console.log('具体值:');
        console.log('- id:', event.id);
        console.log('- title:', event.title);
        console.log('- description:', event.description);
        console.log('- event_date:', event.event_date);
        console.log('- location:', event.location);
        console.log('- ticket_price:', event.ticket_price);
        console.log('- available_tickets:', event.available_tickets);
        
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        console.error('加载活动失败:', error);
        this.loading = false;
        alert('加载活动失败');
      }
    });
  }

 onSubmit(): void {
  // 表单验证
  if (!this.event.title || !this.event.description || !this.event.event_date) {
    alert('请填写所有必填字段');
    return;
  }

  console.log('=== 详细提交数据调试 ===');
  console.log('原始event对象:', this.event);
  
  // 确保数字字段是数字类型
  const submitData = {
    ...this.event,
    ticket_price: Number(this.event.ticket_price), // 确保是数字
    available_tickets: Number(this.event.available_tickets) // 确保是数字
  };
  
  // 使用转换函数将前端数据转换为API格式
  const apiData = toApiEvent(submitData);
  console.log('转换后的API数据:', apiData);
  console.log('JSON字符串:', JSON.stringify(apiData, null, 2));

  this.loading = true;

if (this.isEdit && this.eventId) {
    this.eventService.updateEvent(this.eventId, apiData).subscribe({
      next: (response: any) => {
        console.log('=== 更新成功响应 ===');
        console.log('API响应:', response);
        
        if (response.success) {
          console.log('更新成功，准备跳转到活动列表');
          // 添加短暂延迟确保数据保存完成
          setTimeout(() => {
            alert('更新成功');
            this.router.navigate(['/events']);
          }, 500);
        } else {
          alert('更新失败: ' + (response.error || '未知错误'));
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('=== 更新失败完整详情 ===');
        console.error('错误对象:', error);
        console.error('错误消息:', error.message);
        
        this.loading = false;
        alert('更新失败: ' + error.message);
      }
    });
  } else {
    // 创建新活动
    this.eventService.createEvent(apiData).subscribe({
      next: (response: any) => {
        if (response.success) {
          console.log('创建成功，准备跳转到活动列表');
          setTimeout(() => {
            alert('创建成功');
            this.router.navigate(['/events']);
          }, 500);
        } else {
          alert('创建失败: ' + (response.error || '未知错误'));
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('创建失败:', error);
        this.loading = false;
        alert('创建失败: ' + error.message);
      }
    });
  }
}
}