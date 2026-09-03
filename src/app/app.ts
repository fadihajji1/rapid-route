import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  isLandingPage = true;
  isAuthPage = false;
  isNotFoundPage = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.isLandingPage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '';
        this.isAuthPage = ['/login', '/register'].includes(event.urlAfterRedirects);
        this.isNotFoundPage = event.urlAfterRedirects !== '/' &&
          event.urlAfterRedirects !== '' &&
          !['/dashboard', '/shipments', '/tracking', '/login', '/register'].includes(event.urlAfterRedirects);
      });
  }
}
