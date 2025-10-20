// src/app/utils/helpers.ts
export class Helpers {
  static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not specified';
    }
  }

  static formatCurrency(amount: number): string {
    if (amount === 0 || amount === null || amount === undefined) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    if (!phone) return true; // 手机号是可选的
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static getUrlParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  static calculateProgress(progress: number, goal: number): number {
    if (!goal || !progress) return 0;
    return Math.min(100, (progress / goal) * 100);
  }

  static generateRegistrationId(): string {
    return 'REG-' + Date.now();
  }
}