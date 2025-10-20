export interface Event {
  id?: number;
  title: string;
  description: string;
  event_date: string;  // 保留（数据库中有）
  location: string;    // 保留（数据库中有）
  ticket_price: number;    // 保留（数据库中有）
  available_tickets: number;  // 保留（数据库中有）
  // 删除 status, event_category, event_time
}

// 转换函数：从前端字段转换为后端API字段
export function toApiEvent(event: Event): any {
  return {
    title: event.title,
    description: event.description,
    event_date: event.event_date,
    location: event.location,
    ticket_price: Number(event.ticket_price), // 确保是数字
    available_tickets: Number(event.available_tickets) // 确保是数字
  };
}

// 转换函数：从后端API字段转换为前端字段
export function toFormEvent(apiData: any): Event {
  return {
    id: apiData.id,
    title: apiData.title || '',
    description: apiData.description || '',
    event_date: apiData.event_date || '',
    location: apiData.location || '',
    ticket_price: Number(apiData.ticket_price) || 0, // 转换为数字
    available_tickets: Number(apiData.available_tickets) || 0 // 转换为数字
  };
}