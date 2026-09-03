import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'rapid-route-token';
  private readonly currentUserSubject = new BehaviorSubject<string | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.currentUserSubject.next('Authenticated user');
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        const token = response.token ?? response.accessToken;

        if (token) {
          localStorage.setItem(this.tokenKey, token);
          this.currentUserSubject.next(credentials.username);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<unknown> {
    return this.http.post(`${environment.apiBaseUrl}/users`, request);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
