export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  available_tickets: number;
  status: string;
}