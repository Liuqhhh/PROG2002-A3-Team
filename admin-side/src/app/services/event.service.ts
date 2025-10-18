import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event, toFormEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'https://24517047.it.scu.edu.au';

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

getEvents(): Observable<Event[]> {
  const apiUrl = `${this.baseUrl}/api.php?action=events`;
  console.log('调用API获取活动列表:', apiUrl);
  
  return this.http.get<any>(apiUrl)
    .pipe(
      map(response => {
        console.log('=== API完整响应 ===');
        console.log('响应success:', response.success);
        console.log('响应data长度:', response.data?.length);
        console.log('完整响应:', response);
        
        if (response && response.success && Array.isArray(response.data)) {
          const events = response.data.map((item: any) => toFormEvent(item));
          console.log('转换后的事件:', events);
          return events;
        }
        console.warn('API响应格式异常:', response);
        return [];
      }),
      catchError(this.handleError)
    );
}

  // 根据ID获取单个事件
  getEventById(id: number): Observable<Event> {
    // 暂时通过获取所有事件然后过滤
    return this.getEvents().pipe(
      map(events => {
        const event = events.find(e => e.id === id);
        if (!event) {
          throw new Error('活动未找到');
        }
        return event;
      })
    );
  }

// 更新事件 - 添加详细响应日志
updateEvent(id: number, eventData: any): Observable<any> {
  console.log('=== 更新活动请求 ===');
  console.log('URL:', `${this.baseUrl}/api.php?action=update_event&id=${id}`);
  console.log('数据:', eventData);
  
  const formData = new FormData();
  Object.keys(eventData).forEach(key => {
    formData.append(key, eventData[key]);
  });
  
  return this.http.post(`${this.baseUrl}/api.php?action=update_event&id=${id}`, formData)
    .pipe(
      map(response => {
        console.log('=== 更新API完整响应 ===');
        console.log('更新响应:', response);
        console.log('响应类型:', typeof response);
        console.log('响应keys:', Object.keys(response));
        return response;
      }),
      catchError(this.handleError)
    );
}

// 创建事件 - 也添加详细日志
createEvent(eventData: any): Observable<any> {
  console.log('=== 创建活动请求 ===');
  console.log('URL:', `${this.baseUrl}/api.php?action=create_event`);
  console.log('数据:', eventData);
  
  const formData = new FormData();
  Object.keys(eventData).forEach(key => {
    formData.append(key, eventData[key]);
  });
  
  return this.http.post(`${this.baseUrl}/api.php?action=create_event`, formData)
    .pipe(
      map(response => {
        console.log('=== 创建API完整响应 ===');
        console.log('创建响应:', response);
        return response;
      }),
      catchError(this.handleError)
    );
}
  // 删除事件 - 修复API端点
  deleteEvent(id: number): Observable<any> {
    console.log('=== 删除活动请求 ===');
    
    const apiUrl = `${this.baseUrl}/api.php?action=delete_event&id=${id}`;
    console.log('URL:', apiUrl);
    
    return this.http.post(apiUrl, {})
      .pipe(
        map(response => {
          console.log('删除API响应:', response);
          return response;
        }),
        catchError(this.handleError)
      );
  }
}