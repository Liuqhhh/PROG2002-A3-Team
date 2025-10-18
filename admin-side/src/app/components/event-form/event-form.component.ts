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
        console.log('- date:', event.date);
        console.log('- time:', event.time);
        console.log('- location:', event.location);
        console.log('- category:', event.category);
        console.log('- price:', event.price);
        console.log('- available_tickets:', event.available_tickets);
        console.log('- status:', event.status);
        
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
    if (!this.event.title || !this.event.description || !this.event.date || !this.event.time) {
      alert('请填写所有必填字段');
      return;
    }

    console.log('=== 详细提交数据调试 ===');
    console.log('原始event对象:', this.event);
    
    // 使用转换函数将前端数据转换为API格式
    const apiData = toApiEvent(this.event);
    console.log('转换后的API数据:', apiData);
    console.log('JSON字符串:', JSON.stringify(apiData, null, 2));

    this.loading = true;

    if (this.isEdit && this.eventId) {
      this.eventService.updateEvent(this.eventId, apiData).subscribe({
        next: () => {
          alert('更新成功');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('=== 更新失败完整详情 ===');
          console.error('错误对象:', error);
          console.error('错误状态:', error.status);
          console.error('错误消息:', error.message);
          console.error('错误响应:', error.error);
          
          this.loading = false;
          
          if (error.status === 500) {
            alert('服务器内部错误，可能是数据格式问题。请检查控制台日志。');
          } else {
            alert('更新失败: ' + error.message);
          }
        }
      });
    } else {
      // 创建新活动
      const apiData = toApiEvent(this.event);
      console.log('创建活动发送的数据:', apiData);

      this.eventService.createEvent(apiData).subscribe({
        next: () => {
          alert('创建成功');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('创建失败:', error);
          this.loading = false;
          
          if (error.status === 409) {
            alert('活动已存在或数据冲突');
          } else if (error.status === 400) {
            alert('请求参数错误，请检查数据格式');
          } else if (error.status === 500) {
            alert('服务器内部错误');
          } else {
            alert('创建失败，请稍后重试');
          }
        }
      });
    }
  }

  // 测试方法：使用最小化数据更新
  testMinimalUpdate(): void {
    if (!this.eventId) {
      alert('没有活动ID');
      return;
    }
    
    console.log('=== 测试最小化更新 ===');
    
    // 创建最小化数据，确保数据类型正确
    const minimalData = {
      title: String(this.event.title || ''),
      description: String(this.event.description || ''),
      event_date: String(this.event.date || ''),
      event_time: String(this.event.time || ''),
      location: String(this.event.location || ''),
      event_category: String(this.event.category || ''),
      ticket_price: parseFloat(String(this.event.price)) || 0,
      available_tickets: parseInt(String(this.event.available_tickets)) || 0,
      status: String(this.event.status || 'active')
    };
    
    console.log('最小化数据:', minimalData);
    console.log('最小化数据JSON:', JSON.stringify(minimalData, null, 2));
    
    this.loading = true;
    
    this.eventService.updateEvent(this.eventId, minimalData).subscribe({
      next: () => {
        alert('最小化更新成功');
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('最小化更新失败:', error);
        this.loading = false;
        alert('最小化更新也失败: ' + error.message);
      }
    });
  }

  // 测试方法：只更新标题
  testTitleUpdate(): void {
    if (!this.eventId) {
      alert('没有活动ID');
      return;
    }
    
    console.log('=== 测试只更新标题 ===');
    
    const titleOnlyData = {
      title: String(this.event.title || '')
    };
    
    console.log('只更新标题数据:', titleOnlyData);
    
    this.loading = true;
    
    this.eventService.updateEvent(this.eventId, titleOnlyData).subscribe({
      next: () => {
        alert('标题更新成功');
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('标题更新失败:', error);
        this.loading = false;
        alert('标题更新失败: ' + error.message);
      }
    });
  }
}