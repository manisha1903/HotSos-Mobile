import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { map, switchMap, throwError, timer } from 'rxjs';
import { env } from '../../../environments/environment';

interface MockAuthData {
  pins: { pin: string; token: string; user: string }[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  /**
   * In dev/qa: validates PIN against local JSON mock file.
   * In production: would call env.apiBaseUrl — currently falls back to mock.
   */
  loginWithPin(pin: string) {
    if (!navigator.onLine) {
      return throwError(() => new Error('Offline: Please check your connection.'));
    }

    const url = env.mockAuth
      ? '/assets/mock/auth.json'
      : `${env.apiBaseUrl}/api/auth/pin`;

    return this.http.get<MockAuthData>(url).pipe(
      // Simulate 500ms network delay in non-production environments
      switchMap((data) =>
        env.production ? [data] : timer(500).pipe(map(() => data))
      ),
      map((data) => {
        const match = data.pins.find((entry) => entry.pin === pin);
        if (!match) {
          throw new Error('Invalid PIN. Please try again.');
        }
        return { token: match.token, user: match.user };
      })
    );
  }

  async saveToken(token: string) {
    await Preferences.set({ key: 'session_token', value: token });
  }

  async getToken() {
    const { value } = await Preferences.get({ key: 'session_token' });
    return value;
  }

  async clearToken() {
    await Preferences.remove({ key: 'session_token' });
  }
}