import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App implements OnInit {
  title = 'admin-side';

  constructor(private router: Router) {}

  ngOnInit() {
    // 监听路由变化，当导航到活动列表时强制刷新
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/events' || event.url === '/#/events') {
          console.log('导航到活动列表，准备刷新数据');
          // 这里可以触发数据刷新
        }
      });
  }
}