import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api'; // 改成组员的API地址

  constructor(private http: HttpClient) { }

  // 获取所有事件
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  // 根据ID获取单个事件
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }

  // 创建新事件
  createEvent(event: Event): Observable<any> {
    return this.http.post(`${this.apiUrl}/events`, event);
  }

  // 更新事件
  updateEvent(id: number, event: Event): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${id}`, event);
  }

  // 删除事件
  deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${id}`);
  }
}