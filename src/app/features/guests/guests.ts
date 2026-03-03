import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { GuestsService } from '../../core/services/guests.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../shared/components/page-toolbar/page-toolbar.component';
import { GuestCardComponent } from '../../shared/components/guest-card/guest-card.component';

export type GuestStatus = 'in-house' | 'arriving' | 'departing';

export interface Guest {    
  id: number;
  name: string;
  vipLevel?: string;           // e.g. 'X1'
  room: string;
  dateRange: string;
  status: GuestStatus;
  group?: string;              // e.g. 'AMA', 'Tincidunt', 'Blandit'
  adults?: number;
  children?: number;
  transfers?: number;
}

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageToolbarComponent, GuestCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g">

      <!-- ── Header (sticky) ── -->
      <app-page-header
        title="All Guests"
        [showRolePill]="false"
        [showTitleChevron]="true"
        (avatarClicked)="profileSvc.open()">
      </app-page-header>

      <!-- ── Toolbar (scrolls with content) ── -->
      <app-page-toolbar
        sortLabel="Sort by Guest Name"
        (filterClicked)="null"
        (sortClicked)="null">
      </app-page-toolbar>

      <!-- ── Count ── -->
      <div class="g__count">{{ guests().length }} guests</div>

      <!-- ── Guest Cards ── -->
      @if (loading()) {
        <div class="g__loading">Loading guests…</div>
      }
      <div class="g__list">
        @for (guest of guests(); track guest.id) {
          <app-guest-card [guest]="guest"/>
        }
      </div>

      <!-- ── FAB ── -->
      <button class="fab" aria-label="Open task list">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18"
                stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

    </div>
  `,
  styles: [`
    .g {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: #f3f4f6;
      font-family: inherit;
      padding-bottom: 88px;
      position: relative;
    }

    /* ── Count ── */
    .g__count {
      padding: 10px 16px 6px;
      font-size: 13px;
      color: #6b7280;
    }

    .g__loading {
      padding: 32px 16px;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
    }

    /* ── List ── */
    .g__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 12px 12px;
    }

    /* ── FAB ── */
    .fab {
      position: fixed;
      bottom: 76px;
      right: 20px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.7);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
    }
  `],
})
export class Guests implements OnInit {
  private guestsService = inject(GuestsService);
  profileSvc = inject(ProfileService);

  guests = signal<Guest[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.guestsService.getGuests().subscribe({
      next: data => {
        this.guests.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}