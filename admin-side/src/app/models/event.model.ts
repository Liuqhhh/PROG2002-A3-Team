export interface Event {
  id?: number;
  title: string;
  description: string;
  
  // 前端表单使用的字段名（保持现有代码兼容）
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  available_tickets: number;
  status: string;
  
  // 后端API字段名（新增，可选）
  event_date?: string;
  event_time?: string;
  event_category?: string;
  ticket_price?: number;
}

// API响应接口
export interface EventResponse {
  event?: Event;
  id?: number;
  title?: string;
  description?: string;
  date?: string;
  event_date?: string;
  time?: string;
  event_time?: string;
  location?: string;
  category?: string;
  event_category?: string;
  price?: number;
  ticket_price?: number;
  available_tickets?: number;
  status?: string;
  registrations?: any[];
}

// 转换函数：从前端字段转换为后端API字段
export function toApiEvent(event: Event): any {
  return {
    title: event.title,
    description: event.description,
    event_date: event.event_date || event.date,  // 优先使用后端字段，没有则用前端字段
    event_time: event.event_time || event.time,
    location: event.location,
    event_category: event.event_category || event.category,
    ticket_price: event.ticket_price || event.price,
    available_tickets: event.available_tickets,
    status: event.status
  };
}

// 转换函数：从后端API字段转换为前端字段
export function toFormEvent(apiData: any): Event {
  return {
    id: apiData.id,
    title: apiData.title || '',
    description: apiData.description || '',
    // 前端字段
    date: apiData.event_date || apiData.date || '',
    time: apiData.event_time || apiData.time || '19:00',
    location: apiData.location || '',
    category: apiData.event_category || apiData.category || '慈善',
    price: apiData.ticket_price || apiData.price || 0,
    available_tickets: apiData.available_tickets || 0,
    status: apiData.status || 'active',
    // 后端字段（可选）
    event_date: apiData.event_date,
    event_time: apiData.event_time,
    event_category: apiData.event_category,
    ticket_price: apiData.ticket_price
  };
}