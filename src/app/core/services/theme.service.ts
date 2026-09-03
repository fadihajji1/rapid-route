import { Injectable } from '@angular/core';

const THEME_STORAGE_KEY = 'rapid-route-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isLightTheme = localStorage.getItem(THEME_STORAGE_KEY) === 'light';

  toggleTheme(): void {
    this.setLightTheme(!this.isLightTheme);
  }

  setLightTheme(isLightTheme: boolean): void {
    this.isLightTheme = isLightTheme;
    localStorage.setItem(THEME_STORAGE_KEY, isLightTheme ? 'light' : 'dark');
  }
}
