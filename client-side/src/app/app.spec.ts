import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';  // 应该是 app.component，不是 app

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],  // 如果是 standalone 组件
      // 或者如果是 NgModule 结构：
      // declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    // 根据你的实际组件属性调整
    expect(app.title).toBeDefined();
  });
});