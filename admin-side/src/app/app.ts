import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet], // 确保有 RouterModule
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'admin-side';
}