// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  ticket_price: number;
  category_name: string;
  purpose: string;
  organizer?: string;
  contact_email?: string;
  goal_amount?: number;
  progress_amount?: number;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface RegistrationData {
  eventId: string;
  eventName: string;
  fullName: string;
  email: string;
  phone: string;
  ticketCount: number;
  specialRequirements: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // 生产环境 - 直接连接后端API
  private readonly API_BASE_URL = 'https://24517047.it.scu.edu.au/api';

  constructor(private http: HttpClient) {}

  // 获取所有活动
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_BASE_URL}/events`);
  }

  // 获取单个活动详情
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.API_BASE_URL}/events/${id}`);
  }

  // 获取分类
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_BASE_URL}/categories`);
  }

  // 提交注册
  submitRegistration(data: RegistrationData): Observable<any> {
    // 生产环境使用真实API调用
    // 注意：需要确保后端有对应的注册端点
    return this.http.post(`${this.API_BASE_URL}/registrations`, data);
  }

  // 检查API连接状态
  checkAPIHealth(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/health`);
  }
}