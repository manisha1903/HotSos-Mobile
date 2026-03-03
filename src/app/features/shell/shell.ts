import {
  Component,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BottomSheetComponent } from '../../shared/components/bottom-sheet/bottom-sheet.component';
import { ProfileComponent } from '../profile/profile';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BottomSheetComponent, ProfileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <!-- Page content -->
      <main class="shell__content">
        <router-outlet />
      </main>

      <!-- Bottom Tab Bar -->
      <nav class="tab-bar" role="tablist" aria-label="Main navigation">

        <!-- Housekeeping -->
        <a class="tab-bar__tab"
           routerLink="/shell/housekeeping"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Housekeeping">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L5 7v2h2v10h6V9h2V7l-4-4H9z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M7 9h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M19 14l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M14 14l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Housekeeping</span>
        </a>

        <!-- Service Orders -->
        <a class="tab-bar__tab"
           routerLink="/shell/service-orders"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Service Orders">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91A6 6 0 0114.7 6.3z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Service Orders</span>
        </a>

        <!-- Guests -->
        <a class="tab-bar__tab"
           routerLink="/shell/guests"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Guests">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Guests</span>
        </a>

        <!-- More (opens bottom sheet) -->
        <button class="tab-bar__tab tab-bar__tab--button"
                [class.tab-bar__tab--active]="moreSheetOpen()"
                (click)="openMoreSheet()"
                role="tab"
                aria-label="More"
                [attr.aria-expanded]="moreSheetOpen()">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5"  cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="19" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          </span>
          <span class="tab-bar__label">More</span>
        </button>
      </nav>

      <!-- Bottom Sheet (rendered inside shell so it sits above the tab bar) -->
      @if (moreSheetOpen()) {
        <app-bottom-sheet (closed)="closeMoreSheet()" />
      }

      <!-- Profile overlay -->
      @if (profileOpen()) {
        <app-profile (closed)="closeProfile()" />
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    /* ── Main content area ── */
    .shell__content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* ── Tab Bar ── */
    .tab-bar {
      display: flex;
      align-items: stretch;
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      flex-shrink: 0;
      box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
    }

    .tab-bar__tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 10px 4px 8px;
      text-decoration: none;
      color: #6b7280;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.2px;
      transition: color 150ms ease;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
      min-height: 56px;
      -webkit-tap-highlight-color: transparent;
    }

    .tab-bar__tab--active {
      color: #1d4ed8;
    }

    .tab-bar__tab:focus-visible {
      outline: 2px solid #1d4ed8;
      outline-offset: -2px;
      border-radius: 4px;
    }

    .tab-bar__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .tab-bar__label {
      line-height: 1;
    }
  `],
})
export class Shell {
  moreSheetOpen = signal(false);
  private profileSvc = inject(ProfileService);
  profileOpen = this.profileSvc.isOpen;

  openMoreSheet() { this.moreSheetOpen.set(true); }
  closeMoreSheet() { this.moreSheetOpen.set(false); }

  openProfile()  { this.profileSvc.open(); }
  closeProfile() { this.profileSvc.close(); }
}
