import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { ServiceOrdersService } from '../../core/services/service-orders.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../shared/components/page-toolbar/page-toolbar.component';
import { ServiceOrderCardComponent } from '../../shared/components/service-order-card/service-order-card.component';

export type ActionState = 'play' | 'bell' | 'minus';
export type PriorityLevel = 'P1' | 'P2' | 'P3';
export type PriorityColor = 'red' | 'orange' | 'green';

export interface ServiceOrder {
  id: number;
  location: string;
  taskTitle: string;
  assigneeName?: string;         // blue link; undefined → show "Assign"
  priority: PriorityLevel;
  priorityColor: PriorityColor;
  tag: string;                   // e.g. "Escalated", "Inspection", "Delivery Order"
  tagVariant: 'escalated' | 'neutral';
  orderType: string;             // e.g. "Service Order", "Delivery Order"
  timeAgo: string;
  attachments: number;
  hasCopy: boolean;
  actionState: ActionState;
  assigneeExtra?: string;        // crown label like "X1"
}

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageToolbarComponent, ServiceOrderCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="so">

      <!-- ── Top Header (sticky) ── -->
      <app-page-header
        title="All Work"
        rolePillLabel="List"
        [roleOptions]="[]"
        [showHelpIcon]="false"
        (avatarClicked)="profileSvc.open()">
      </app-page-header>

      <!-- ── Toolbar (scrolls with content) ── -->
      <app-page-toolbar
        sortLabel="Sort by Priority"
        (filterClicked)="null"
        (sortClicked)="null">
      </app-page-toolbar>

      <!-- ── Order Count ── -->
      <div class="so__count">{{ orders().length }} orders</div>

      <!-- ── Order Cards ── -->
      @if (loading()) {
        <div class="so__loading">Loading orders…</div>
      }
      <div class="so__list">
        @for (order of orders(); track order.id) {
          <app-service-order-card [order]="order"/>
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
    .so {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: #f3f4f6;
      font-family: inherit;
      padding-bottom: 88px;
      position: relative;
    }

    /* ── Count ── */
    .so__count {
      padding: 10px 16px 6px;
      font-size: 13px;
      color: #6b7280;
    }

    .so__loading {
      padding: 32px 16px;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
    }

    /* ── List ── */
    .so__list {
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
export class ServiceOrders implements OnInit {
  private soService = inject(ServiceOrdersService);
  profileSvc = inject(ProfileService);

  orders = signal<ServiceOrder[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.soService.getOrders().subscribe({
      next: data => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}