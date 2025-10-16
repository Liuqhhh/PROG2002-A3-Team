import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `<h1>测试页面 - 路由正常工作!</h1>`
})
export class TestComponent { }