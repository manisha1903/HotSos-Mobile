import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';

interface ProfileMenuItem {
  id: string;
  icon: string;       // SVG path(s) key
  label: string;
  subtitle?: string;
  badge?: number;
  danger?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-overlay">

      <!-- Top bar -->
      <div class="profile__topbar">
        <button class="profile__close" aria-label="Close" (click)="close()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="profile__help" aria-label="Help">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 17v-1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Avatar + Name -->
      <div class="profile__hero">
        <div class="profile__avatar">JW</div>
        <h2 class="profile__name">John Watson</h2>
        <button class="profile__status-pill">
          On Duty / Off Break
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Menu list -->
      <ul class="profile__menu" role="menu">

        <!-- Notifications -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('notifications')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Notifications</span>
          </span>
          <span class="profile__item-right">
            <span class="profile__badge">3</span>
            <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </li>

        <!-- Messages -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('messages')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Messages</span>
          </span>
          <span class="profile__item-right">
            <span class="profile__badge">1</span>
            <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </li>

        <!-- Change Unit -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('unit')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="profile__label-group">
              <span class="profile__label">Change Unit</span>
              <span class="profile__sublabel">Chrissanie Mountain Lodge</span>
            </span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Change Language -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('language')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 12h4M9 9v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M13 9h4l-2 6" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label-group">
              <span class="profile__label">Change Language</span>
              <span class="profile__sublabel">English</span>
            </span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Change Password -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('password')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="profile__label">Change Password</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Help -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('help')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 17v-1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5"
                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Help</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Submit Feedback -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('feedback')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1"/>
              </svg>
            </span>
            <span class="profile__label">Submit Feedback</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Log Out -->
        <li class="profile__item profile__item--danger" role="menuitem" (click)="onLogOut()">
          <span class="profile__item-left">
            <span class="profile__icon profile__icon--danger">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="profile__label profile__label--danger">Log Out</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#9ca3af" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

      </ul>

      <!-- Version footer -->
      <div class="profile__version">HotSOS 3.208.0</div>

    </div>
  `,
  styles: [`
    /* ── Full-screen overlay ── */
    .profile-overlay {
      position: fixed;
      inset: 0;
      z-index: 500;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      animation: slideInRight 240ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0.6; }
      to   { transform: translateX(0);    opacity: 1;   }
    }

    /* ── Top bar ── */
    .profile__topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 8px;
    }

    .profile__close,
    .profile__help {
      background: none;
      border: none;
      cursor: pointer;
      color: #374151;
      padding: 6px;
      display: flex;
      align-items: center;
      border-radius: 50%;
      -webkit-tap-highlight-color: transparent;
    }
    .profile__close:active,
    .profile__help:active {
      background: #f3f4f6;
    }

    /* ── Hero ── */
    .profile__hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 28px;
    }

    .profile__avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #6d28d9;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.5px;
    }

    .profile__name {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.3px;
    }

    .profile__status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #dcfce7;
      color: #166534;
      border: none;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
    }

    /* ── Menu list ── */
    .profile__menu {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
    }

    .profile__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      -webkit-tap-highlight-color: transparent;
      transition: background 120ms ease;
    }
    .profile__item:active {
      background: #f9fafb;
    }

    .profile__item-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .profile__item-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .profile__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111827;
      flex-shrink: 0;
      width: 24px;
    }
    .profile__icon--danger {
      color: #dc2626;
    }

    .profile__label-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .profile__label {
      font-size: 16px;
      font-weight: 400;
      color: #111827;
      line-height: 1.3;
    }
    .profile__label--danger {
      color: #dc2626;
      font-weight: 500;
    }

    .profile__sublabel {
      font-size: 13px;
      color: #6b7280;
    }

    .profile__badge {
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      background: #dc2626;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    .profile__chevron {
      color: #9ca3af;
      flex-shrink: 0;
    }

    .profile__item--danger .profile__chevron {
      color: #d1d5db;
    }

    /* ── Version footer ── */
    .profile__version {
      text-align: center;
      padding: 28px 20px 40px;
      font-size: 14px;
      color: #1d4ed8;
      font-weight: 500;
    }
  `],
})
export class ProfileComponent {
  @Output() closed = new EventEmitter<void>();

  private router     = inject(Router);
  private profileSvc = inject(ProfileService);
  private authService = inject(AuthService);

  close() {
    this.profileSvc.close();
    this.closed.emit();
  }

  onMenuTap(item: string) {
    // placeholder for future navigation
  }

  async onLogOut() {
    await this.authService.clearToken();
    this.profileSvc.close();
    this.router.navigate(['/login']);
  }
}
