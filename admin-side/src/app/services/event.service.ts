import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event, toFormEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'https://f39ee77b0d28533835f585424a1822ce.serveo.net/api';

  constructor(private http: HttpClient) { }

  // 数据映射函数
  private mapToEvent(data: any): Event {
    console.log('映射原始数据:', data);
    return toFormEvent(data);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = '发生未知错误';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `客户端错误: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 404:
          errorMessage = '资源未找到';
          break;
        case 409:
          errorMessage = '数据冲突';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        case 0:
          errorMessage = '网络连接失败，请检查后端服务';
          break;
        default:
          errorMessage = `服务器错误: ${error.status}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  // 获取所有事件
  getEvents(): Observable<Event[]> {
    console.log('调用API获取活动列表:', `${this.baseUrl}/events`);
    
    return this.http.get<any[]>(`${this.baseUrl}/events`)
      .pipe(
        map(events => {
          console.log('API原始响应数据:', events);
          
          if (!events || !Array.isArray(events)) {
            console.warn('API返回数据格式异常，返回空数组');
            return [];
          }
          
          console.log('活动数量:', events.length);
          const mappedEvents = events.map(item => this.mapToEvent(item));
          console.log('映射后的活动列表:', mappedEvents);
          return mappedEvents;
        }),
        catchError(this.handleError)
      );
  }

  // 根据ID获取单个事件
  getEventById(id: number): Observable<Event> {
    console.log('调用API获取单个活动:', `${this.baseUrl}/events/${id}`);
    
    return this.http.get<any>(`${this.baseUrl}/events/${id}`)
      .pipe(
        map(response => {
          console.log('单个活动API原始响应:', response);
          
          if (response.event) {
            return this.mapToEvent(response.event);
          }
          return this.mapToEvent(response);
        }),
        catchError(this.handleError)
      );
  }

  // 创建新事件
  createEvent(eventData: any): Observable<any> {
    console.log('=== 创建活动请求 ===');
    console.log('API URL:', `${this.baseUrl}/admin/events`);
    console.log('发送的数据:', eventData);
    
    return this.http.post(`${this.baseUrl}/admin/events`, eventData)
      .pipe(
        catchError(error => {
          console.error('创建活动请求失败:', error);
          return this.handleError(error);
        })
      );
  }

  // 更新事件
  updateEvent(id: number, eventData: any): Observable<any> {
    console.log('=== 更新活动请求 ===');
    console.log('API URL:', `${this.baseUrl}/admin/events/${id}`);
    console.log('活动ID:', id);
    console.log('发送的数据:', eventData);
    
    return this.http.put(`${this.baseUrl}/admin/events/${id}`, eventData)
      .pipe(
        catchError(error => {
          console.error('更新活动请求失败:', error);
          console.error('错误状态:', error.status);
          console.error('错误响应:', error.error);
          return this.handleError(error);
        })
      );
  }

  // 删除事件
  deleteEvent(id: number): Observable<any> {
    console.log('删除活动:', `${this.baseUrl}/admin/events/${id}`);
    
    return this.http.delete(`${this.baseUrl}/admin/events/${id}`)
      .pipe(catchError(this.handleError));
  }
}