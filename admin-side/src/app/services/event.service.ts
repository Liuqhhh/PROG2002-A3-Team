import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event, toFormEvent } from '../models/event.model';
import { environment } from '../../environments/environment'; // 添加这行

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = environment.apiUrl; // 使用环境变量

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = '发生未知错误';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `客户端错误: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `服务器错误: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // 修改所有方法，移除 php 相关参数
  getEvents(): Observable<Event[]> {
    const apiUrl = `${this.baseUrl}/events`; // 直接调用 Node.js API
    console.log('调用API获取活动列表:', apiUrl);
    
    return this.http.get<Event[]>(apiUrl) // 直接返回 Event 数组
      .pipe(
        map(events => {
          console.log('=== Node.js API 响应 ===');
          console.log('获取到活动数量:', events.length);
          return events;
        }),
        catchError(this.handleError)
      );
  }

getEventById(id: number): Observable<Event> {
  const apiUrl = `${this.baseUrl}/events/${id}`;
  console.log('调用API获取单个活动:', apiUrl);
  
  return this.http.get<any>(apiUrl)
    .pipe(
      map(response => {
        console.log('=== 单个活动API响应 ===');
        console.log('响应:', response);
        
        // 根据你的API响应结构调整
        if (response.event) {
          // 如果返回格式是 { event: {...}, registrations: [...] }
          return toFormEvent(response.event);
        } else {
          // 如果直接返回活动对象
          return toFormEvent(response);
        }
      }),
      catchError(this.handleError)
    );
}

  updateEvent(id: number, eventData: any): Observable<any> {
    console.log('=== 更新活动请求 ===');
    console.log('URL:', `${this.baseUrl}/admin/events/${id}`);
    console.log('数据:', eventData);
    
    return this.http.put(`${this.baseUrl}/admin/events/${id}`, eventData)
      .pipe(
        map(response => {
          console.log('=== 更新API响应 ===');
          console.log('响应:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  createEvent(eventData: any): Observable<any> {
    console.log('=== 创建活动请求 ===');
    console.log('URL:', `${this.baseUrl}/admin/events`);
    console.log('数据:', eventData);
    
    return this.http.post(`${this.baseUrl}/admin/events`, eventData)
      .pipe(
        map(response => {
          console.log('=== 创建API响应 ===');
          console.log('响应:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  deleteEvent(id: number): Observable<any> {
    console.log('=== 删除活动请求 ===');
    const apiUrl = `${this.baseUrl}/admin/events/${id}`;
    console.log('URL:', apiUrl);
    
    return this.http.delete(apiUrl)
      .pipe(
        map(response => {
          console.log('删除API响应:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
}